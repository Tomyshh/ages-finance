import type { LucideIcon } from "lucide-react";

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type Features4Props = {
  label?: string;
  title: string;
  description?: string;
  items: FeatureItem[];
};

export function Features4({ label, title, description, items }: Features4Props) {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-5 sm:px-8 md:space-y-14 lg:space-y-16">
      <div className="relative z-10 mx-auto max-w-2xl space-y-4 text-center sm:space-y-5 md:space-y-6">
        {label && (
          <span className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-8 bg-accent/30" />
            {label}
            <span className="h-px w-8 bg-accent/30" />
          </span>
        )}
        <h2 className="font-display text-balance text-[2rem] font-semibold leading-[1.1] tracking-tight text-navy sm:text-4xl md:text-5xl lg:text-[3.25rem]">
          {title}
        </h2>
        {description && (
          <p className="mx-auto max-w-xl text-base leading-[1.75] text-muted/90 md:text-lg">
            {description}
          </p>
        )}
      </div>

      <div className="relative mx-auto grid max-w-3xl divide-x divide-y divide-navy/[0.05] sm:max-w-none sm:grid-cols-2 lg:max-w-5xl lg:grid-cols-3 [&>*]:px-6 [&>*]:py-8 sm:[&>*]:px-8 sm:[&>*]:py-10 md:[&>*]:px-10 md:[&>*]:py-12 lg:[&>*]:px-12 lg:[&>*]:py-14">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-3">
                <Icon className="size-[1.125rem] shrink-0 text-accent" strokeWidth={1.5} />
                <h3 className="font-display text-base font-semibold tracking-tight text-navy sm:text-lg">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm leading-[1.75] text-muted/85">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
