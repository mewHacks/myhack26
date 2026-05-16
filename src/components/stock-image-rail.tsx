import Image from "next/image";

import type { GalleryItem } from "@/lib/page-content";

type StockImageRailProps = {
  items: GalleryItem[];
};

export function StockImageRail({ items }: StockImageRailProps) {
  return (
    <div className="rounded-[1.75rem] border border-line bg-card p-4">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-muted">Stock references</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure
            key={`${item.label}-${item.src}`}
            className="overflow-hidden rounded-[1.3rem] border border-line bg-card transition hover:-translate-y-1"
          >
            <div className="relative h-48 group">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 1024px) 45vw, 30vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <figcaption className="px-3 py-3 text-sm font-medium">{item.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
