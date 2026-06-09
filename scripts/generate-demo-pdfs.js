/* eslint-disable @typescript-eslint/no-require-imports */
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

async function createPDF(filename, title, lines) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([595, 842]);

  let y = 780;
  page.drawText(title, { x: 50, y, size: 18, font: bold, color: rgb(0, 0, 0) });
  y -= 30;

  for (const line of lines) {
    if (line === "") { y -= 12; continue; }
    if (line.startsWith("##")) {
      y -= 20;
      page.drawText(line.replace(/^##\s*/, ""), { x: 50, y, size: 14, font: bold, color: rgb(0.1, 0.1, 0.1) });
      y -= 20;
    } else {
      const words = line.split(" ");
      let currentLine = "";
      for (const word of words) {
        const test = currentLine ? currentLine + " " + word : word;
        if (font.widthOfTextAtSize(test, 11) > 500) {
          page.drawText(currentLine, { x: 50, y, size: 11, font, color: rgb(0.2, 0.2, 0.2) });
          y -= 16;
          currentLine = word;
        } else {
          currentLine = test;
        }
      }
      if (currentLine) {
        page.drawText(currentLine, { x: 50, y, size: 11, font, color: rgb(0.2, 0.2, 0.2) });
        y -= 16;
      }
    }
  }

  const pdfBytes = await doc.save();
  const outPath = path.join(__dirname, "..", "public", "demo", filename);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, pdfBytes);
  console.log(`Created ${filename}`);
}

(async () => {
  await createPDF("scholarship.pdf", "Post-Matric Scholarship for SC/ST Students 2026-27", [
    "## Issuing Authority",
    "Ministry of Social Justice and Empowerment, Government of India",
    "## Purpose",
    "Financial assistance to SC/ST students for pursuing post-matriculation education",
    "## Eligibility Criteria",
    "- Must belong to Scheduled Caste (SC) or Scheduled Tribe (ST) category",
    "- Family annual income must not exceed Rs. 2,50,000 per annum",
    "- Must have passed 10th class with at least 50% marks",
    "- Must be enrolled in a recognized educational institution",
    "- Age must be between 16 and 30 years as on 01 April 2026",
    "- Must be a domicile of India",
    "## Important Dates",
    "Application Deadline: 31 March 2026",
    "Document Verification: 15 April 2026",
    "Disbursement: 01 June 2026",
    "## Required Documents",
    "1. Caste Certificate issued by competent authority",
    "2. Income Certificate not older than 6 months",
    "3. 10th Class Mark Sheet",
    "4. Aadhaar Card",
    "5. Bank Passbook (for direct benefit transfer)",
    "6. Passport-size Photograph",
    "7. Self-attested copy of admission letter",
    "## Required Fields",
    "- Full Name (as per Aadhaar)",
    "- Date of Birth",
    "- Caste Category",
    "- Income Certificate Number",
    "- Bank Account Number",
    "- IFSC Code",
    "- Name of Educational Institution",
    "- Course and Year of Study",
    "- Previous Year Percentage",
    "## Restrictions",
    "- Students with backlogs are not eligible",
    "- Only 2 attempts allowed per application cycle",
    "- Scholarship amount will be credited directly to bank account",
    "## Fees",
    "No application fee required",
    "## Signature Requirements",
    "- Application must be signed by the applicant",
    "- Counter-signed by Head of Institution",
    "- Income certificate must be signed by Tehsildar or equivalent authority",
    "## Important Note",
    "Incomplete applications will be rejected. All documents must be self-attested.",
    "The scholarship covers tuition fees, maintenance allowance, and book grants.",
    "Annual maintenance allowance: Rs. 3,000 for day scholars, Rs. 5,500 for hostellers.",
    "Book grant: Rs. 2,000 per annum.",
    "For queries, contact: scholarship@gov.in or call 1800-180-5678",
  ]);

  await createPDF("reimbursement.pdf", "Employee Medical Reimbursement Claim Form", [
    "## Issuing Authority",
    "Human Resources Department, ABC Corporation Ltd.",
    "## Purpose",
    "Reimbursement of medical expenses incurred by employees or their dependents",
    "## Eligibility Criteria",
    "- Must be a permanent employee with minimum 6 months service",
    "- Medical expenses must be for self, spouse, or dependent children",
    "- Expenses must be from a recognized hospital or clinic",
    "- Original receipts and medical certificates must be submitted",
    "- Claim must be filed within 30 days of treatment",
    "- Annual reimbursement limit: Rs. 50,000 per employee",
    "## Important Dates",
    "Submission Deadline: 31 December 2026",
    "Processing Time: 15 working days",
    "Reimbursement Credit: 1st working day of following month",
    "## Required Documents",
    "1. Original hospital bills and receipts",
    "2. Medical certificate from treating doctor",
    "3. Prescription copies",
    "4. Discharge summary (for hospitalization claims)",
    "5. Employee ID proof",
    "6. Dependent relationship proof (if applicable)",
    "## Required Fields",
    "- Employee ID",
    "- Employee Name",
    "- Department",
    "- Date of Treatment",
    "- Hospital Name and Address",
    "- Diagnosis",
    "- Treatment Type (OPD/IPD)",
    "- Amount Claimed",
    "- Bank Account Number",
    "- IFSC Code",
    "- Dependent Name (if applicable)",
    "## Restrictions",
    "- Cosmetic treatments are not covered",
    "- Pre-existing conditions excluded for first year",
    "- Claims exceeding Rs. 10,000 require VP approval",
    "- Maximum 4 claims per financial year",
    "## Fees",
    "No claim processing fee",
    "## Signature Requirements",
    "- Employee signature on claim form",
    "- Department Head approval",
    "- HR verification stamp",
    "- Hospital stamp on all receipts",
  ]);

  await createPDF("admission.pdf", "College Admission Application 2026-27", [
    "## Issuing Authority",
    "National Institute of Technology, Delhi",
    "## Purpose",
    "Undergraduate admission for B.Tech programs for the academic year 2026-27",
    "## Eligibility Criteria",
    "- Must have passed 12th class with Physics, Chemistry, and Mathematics",
    "- Minimum 75% aggregate marks in 12th class (65% for SC/ST/PwD)",
    "- Valid JEE Main 2026 score",
    "- Age must be between 17 and 25 years as on 01 October 2026",
    "- Indian nationality",
    "- Must have appeared in JEE Main counseling",
    "## Important Dates",
    "Application Deadline: 30 June 2026",
    "Counseling Start: 15 July 2026",
    "Seat Allotment: 25 July 2026",
    "Reporting to College: 01 August 2026",
    "## Required Documents",
    "1. 12th Class Mark Sheet and Certificate",
    "2. JEE Main Score Card",
    "3. Aadhaar Card",
    "4. Migration Certificate",
    "5. Transfer Certificate",
    "6. Category Certificate (if applicable)",
    "7. Passport-size Photographs (8 copies)",
    "8. Medical Fitness Certificate",
    "9. Character Certificate from last institution",
    "## Required Fields",
    "- Full Name",
    "- JEE Main Roll Number",
    "- JEE Main Rank",
    "- 12th Class Board and Year",
    "- 12th Class Percentage",
    "- Choice of Branch (in order of preference)",
    "- Preferred Campus",
    "- Parent/Guardian Name",
    "- Parent/Guardian Occupation",
    "- Contact Address",
    "- Email and Phone Number",
    "- Bank Account Details for refund",
    "## Restrictions",
    "- Only one application per candidate",
    "- No changes in branch preference after counseling",
    "- Admission is provisional until document verification",
    "- Fee must be paid within 7 days of seat allotment",
    "## Fees",
    "Application Fee: Rs. 1,500 (General), Rs. 750 (SC/ST/PwD)",
    "Tuition Fee: Rs. 1,50,000 per annum",
    "Hostel Fee: Rs. 25,000 per annum",
    "## Signature Requirements",
    "- Applicant signature on application",
    "- Parent/Guardian signature for minors",
    "- Principal signature on Transfer Certificate",
    "- Medical officer stamp on Fitness Certificate",
  ]);

  console.log("All demo PDFs created!");
})();
