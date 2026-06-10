import { gatewayFetch } from "@/lib/gateway";

export async function GET(request: Request) {
  const companyId = new URL(request.url).searchParams.get("companyId");
  const qs = companyId ? `?companyId=${encodeURIComponent(companyId)}` : "";
  const res = await gatewayFetch(`/api/deliveries${qs}`);
  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const payload = await request.text();
  const res = await gatewayFetch("/api/deliveries", {
    method: "POST",
    body: payload,
  });
  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
