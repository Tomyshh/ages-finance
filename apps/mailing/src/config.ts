import {
  getEnv,
  getEnvBool,
  getEnvNumber,
  normalizeBaseUrl,
  requireEnv,
} from "@agec/shared";

export const config = {
  port: getEnvNumber("PORT", 8081),
  internalSecret: requireEnv("INTERNAL_SHARED_SECRET"),

  pennylane: {
    /** Firm API token shared with the gateway. */
    apiKey: requireEnv("PENNYLANE_API_KEY"),
    use2026Api: getEnvBool("PENNYLANE_USE_2026_API", true),
  },

  resend: {
    apiKey: requireEnv("RESEND_API_KEY"),
    from: getEnv("MAIL_FROM") ?? "AGEC Finances <onboarding@resend.dev>",
    defaultTo: getEnv("MAIL_TO") ?? "tom@yapio.io",
  },

  gatewayUrl: normalizeBaseUrl(getEnv("API_GATEWAY_URL")),

  storage: {
    url: getEnv("SUPABASE_URL"),
    serviceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    bucket: getEnv("SUPABASE_STORAGE_BUCKET") ?? "clotures",
  },

  /** Resend caps total email size around 40MB; keep margin for encoding. */
  maxAttachmentBytes: getEnvNumber("MAX_ATTACHMENT_BYTES", 38 * 1024 * 1024),
} as const;

export function storageConfigured(): boolean {
  return Boolean(config.storage.url && config.storage.serviceRoleKey);
}
