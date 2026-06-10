"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const UnicornScene = dynamic(() => import("unicornstudio-react"), { ssr: false });

export default function UnicornHeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 size-full pointer-events-none select-none">
      {shouldLoad ? (
        <UnicornScene
          projectId="A3B8Dc5rFWEeEenKZcxn"
          width="100%"
          height="100%"
          scale={1}
          dpi={1}
          sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.12/dist/unicornStudio.umd.js"
          className="size-full pointer-events-none"
          ariaLabel="Animation décorative AGEC Finances"
        />
      ) : null}
    </div>
  );
}
