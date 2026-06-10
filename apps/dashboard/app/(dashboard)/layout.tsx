import { Header } from "@/components/layout/header";
import { Shell } from "@/components/layout/shell";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <Shell header={<Header />}>{children}</Shell>;
}
