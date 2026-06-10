export default function SectionFallback({ minHeight = "24rem" }: { minHeight?: string }) {
  return (
    <div
      className="mx-auto max-w-7xl px-5 sm:px-8"
      style={{ minHeight }}
      aria-hidden
    />
  );
}
