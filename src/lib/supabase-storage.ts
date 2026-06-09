import { getSupabase } from "./supabase";

const BUCKET_NAME = "documents";

export async function ensureBucketExists() {
  const supabase = getSupabase();
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find((b: { name: string }) => b.name === BUCKET_NAME)) {
    await supabase.storage.createBucket(BUCKET_NAME, {
      public: false,
      fileSizeLimit: 10485760,
    });
  }
}

export async function uploadDocument(
  file: File,
  userId: string
): Promise<string> {
  const supabase = getSupabase();
  const filePath = `${userId}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) throw error;
  return filePath;
}

export async function getDocumentUrl(filePath: string): Promise<string> {
  const supabase = getSupabase();
  const { data } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 3600);
  if (!data) throw new Error("Failed to generate signed URL");
  return data.signedUrl;
}

export async function deleteDocument(filePath: string): Promise<void> {
  const supabase = getSupabase();
  await supabase.storage.from(BUCKET_NAME).remove([filePath]);
}
