const baseUrl = (process.env.API_GATEWAY_URL ?? "http://localhost:8080").replace(/\/$/, "");
const token = process.env.GATEWAY_PUBLIC_TOKEN;

/**
 * Server-side fetch helper. Adds the gateway bearer token so it never reaches
 * the browser. Used by Server Components and Route Handlers only.
 */
export async function gatewayFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${baseUrl}${path}`, { ...init, headers, cache: "no-store" });
}
