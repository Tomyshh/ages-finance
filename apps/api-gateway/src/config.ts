import {
  getEnv,
  getEnvBool,
  getEnvNumber,
  normalizeBaseUrl,
  requireEnv,
} from "@agec/shared";

export const config = {
  port: getEnvNumber("PORT", 8080),
  internalSecret: requireEnv("INTERNAL_SHARED_SECRET"),
  /** Bearer token expected from the dashboard. Optional in local dev. */
  publicToken: getEnv("GATEWAY_PUBLIC_TOKEN"),
  dashboardOrigin: getEnv("DASHBOARD_ORIGIN") ?? "*",

  pennylane: {
    /** Firm API token: gives access to the whole AGEC Finances portfolio. */
    apiKey: requireEnv("PENNYLANE_API_KEY"),
    use2026Api: getEnvBool("PENNYLANE_USE_2026_API", true),
  },

  mailingServiceUrl: normalizeBaseUrl(requireEnv("MAILING_SERVICE_URL"))!,
  defaultRecipient: getEnv("MAIL_TO") ?? "tom@yapio.io",

  storage: {
    url: getEnv("SUPABASE_URL"),
    serviceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  },
} as const;

export function persistenceConfigured(): boolean {
  return Boolean(config.storage.url && config.storage.serviceRoleKey);
}
