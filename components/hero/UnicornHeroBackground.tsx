"use client";

import dynamic from "next/dynamic";

const UnicornScene = dynamic(() => import("unicornstudio-react"), { ssr: false });

export default function UnicornHeroBackground() {
  return (
    <div className="absolute inset-0 size-full pointer-events-none select-none">
      <UnicornScene
        projectId="A3B8Dc5rFWEeEenKZcxn"
        width="100%"
        height="100%"
        scale={1}
        dpi={1.5}
        sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.12/dist/unicornStudio.umd.js"
        className="size-full pointer-events-none"
        ariaLabel="Animation décorative AGEC Finances"
      />
    </div>
  );
}
