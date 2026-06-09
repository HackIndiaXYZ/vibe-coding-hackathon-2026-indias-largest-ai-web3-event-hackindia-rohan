interface PDFPage {
  getTextContent: () => Promise<{ items: Array<{ str: string }> }>;
}

interface PDFDocumentProxy {
  numPages: number;
  getPage: (n: number) => Promise<PDFPage>;
}

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  pages: Array<{ pageNum: number; text: string }>;
}

export async function extractTextFromPDF(file: File): Promise<PDFExtractionResult> {
  const pdfjsLib: Record<string, unknown> = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const getDocument = pdfjsLib.getDocument as (src: {
    data: ArrayBuffer;
    useSystemFonts?: boolean;
    disableFontFace?: boolean;
  }) => { promise: Promise<PDFDocumentProxy> };

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({
    data: arrayBuffer,
    useSystemFonts: true,
    disableFontFace: true,
  }).promise;

  const pages: Array<{ pageNum: number; text: string }> = [];
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: { str: string }) => item.str)
      .join(" ");

    pages.push({ pageNum: i, text: pageText });
    fullText += `\n--- Page ${i} ---\n${pageText}`;
  }

  return {
    text: fullText.trim(),
    pageCount: pdf.numPages,
    pages,
  };
}

export async function extractTextFromImage(file: File): Promise<string> {
  try {
    const Tesseract = await import("tesseract.js");
    const { data } = await Tesseract.recognize(file, "eng+hin", {
      logger: () => {},
    });
    return data.text || `[OCR could not extract text from ${file.name}]`;
  } catch (error) {
    console.error("Tesseract OCR error:", error);
    return `[Image uploaded: ${file.name}. OCR processing failed. The image may be too complex or unclear.]`;
  }
}
