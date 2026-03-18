import * as FileSystem from "expo-file-system";
import { supabase } from "./supabase";

/**
 * Upload a resume PDF to Supabase Storage.
 * Returns the storage path (not a full URL).
 */
export async function uploadResume(
  userId: string,
  fileUri: string,
  fileName: string
): Promise<string> {
  const path = `${userId}/resume.pdf`;
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const { error } = await supabase.storage
    .from("resumes")
    .upload(path, decode(base64), {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) throw new Error(`Resume upload failed: ${error.message}`);
  return path;
}

/**
 * Get a signed URL to view/download a resume.
 */
export async function getResumeUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(path, 3600); // 1 hour expiry

  if (error || !data) return null;
  return data.signedUrl;
}

/**
 * Upload a profile avatar image.
 */
export async function uploadAvatar(
  userId: string,
  fileUri: string
): Promise<string> {
  const path = `${userId}/avatar.jpg`;
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, decode(base64), {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) throw new Error(`Avatar upload failed: ${error.message}`);

  // Return the public URL
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

/** Decode base64 string to Uint8Array for Supabase upload */
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
