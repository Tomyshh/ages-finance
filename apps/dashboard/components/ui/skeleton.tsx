import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("squircle-sm animate-pulse bg-surface-muted", className)} {...props} />;
}
