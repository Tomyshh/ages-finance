import { createClient } from "@supabase/supabase-js";
import { config, storageConfigured } from "./config.js";

/**
 * Uploads the ZIP to Supabase Storage and returns a signed download URL.
 * Used as a fallback when the archive is too large to attach to an email.
 */
export async function uploadZipAndGetLink(
  filename: string,
  buffer: Buffer,
): Promise<string> {
  if (!storageConfigured()) {
    throw new Error(
      "Stockage non configur\u00e9 (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) - impossible d'envoyer un lien pour un ZIP volumineux",
    );
  }

  const supabase = createClient(config.storage.url!, config.storage.serviceRoleKey!, {
    auth: { persistSession: false },
  });

  const path = `${new Date().getFullYear()}/${Date.now()}_${filename}`;

  const { error: uploadError } = await supabase.storage
    .from(config.storage.bucket)
    .upload(path, buffer, {
      contentType: "application/zip",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Upload Supabase \u00e9chou\u00e9: ${uploadError.message}`);
  }

  // 7-day signed URL so the recipient has time to download.
  const { data, error: signError } = await supabase.storage
    .from(config.storage.bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 7);

  if (signError || !data) {
    throw new Error(`Lien sign\u00e9 Supabase \u00e9chou\u00e9: ${signError?.message ?? "inconnu"}`);
  }

  return data.signedUrl;
}
