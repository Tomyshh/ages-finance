/**
 * Lightweight env access helpers shared across the Node services.
 * Throws early with an explicit message so a misconfigured Render service
 * fails fast instead of behaving unpredictably at runtime.
 */

export function getEnv(key: string): string | undefined {
  const value = process.env[key];
  if (value === undefined || value === "") return undefined;
  return value;
}

export function requireEnv(key: string): string {
  const value = getEnv(key);
  if (value === undefined) {
    throw new Error(`Variable d'environnement manquante: ${key}`);
  }
  return value;
}

export function getEnvNumber(key: string, fallback: number): number {
  const value = getEnv(key);
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getEnvBool(key: string, fallback = false): boolean {
  const value = getEnv(key);
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

/**
 * Ensures a base URL has a scheme. Render `fromService` `hostport` injects a
 * bare `host:port`, so we default to http:// on the private network.
 */
export function normalizeBaseUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.replace(/\/$/, "");
  if (/^https?:\/\//.test(trimmed)) return trimmed;
  return `http://${trimmed}`;
}
