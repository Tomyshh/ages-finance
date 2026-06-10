import { gatewayFetch } from "@/lib/gateway";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> },
) {
  const { companyId } = await params;
  const search = new URL(request.url).search;
  const res = await gatewayFetch(`/api/dossiers/${companyId}/cloture${search}`);

  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    return new Response(body || JSON.stringify({ error: "build_failed" }), {
      status: res.status || 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(res.body, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition":
        res.headers.get("Content-Disposition") ?? "attachment; filename=cloture.zip",
    },
  });
}
