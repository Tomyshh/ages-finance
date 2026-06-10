export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5">
      <h1 className="font-display text-xl font-bold tracking-tight text-foreground">{title}</h1>
      {description && <p className="mt-1 text-[13px] leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
