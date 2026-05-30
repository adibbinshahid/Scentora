import { prisma } from "db";
import Link from "next/link";

export default async function ScrollAdsBanner() {
  const ads = await prisma.scrollAd.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  if (ads.length === 0) return null;

  const items = ads.length < 4 ? [...ads, ...ads, ...ads, ...ads] : [...ads, ...ads];

  return (
    <div className="w-full bg-bg-secondary border-b border-border-primary overflow-hidden py-2.5">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((ad, i) => (
          <span key={`${ad.id}-${i}`} className="flex items-center">
            {ad.link ? (
              <Link href={ad.link} className="text-[10px] tracking-[0.2em] uppercase text-gold-primary hover:text-gold-light transition-colors px-6">
                {ad.text}
              </Link>
            ) : (
              <span className="text-[10px] tracking-[0.2em] uppercase text-gold-primary px-6">
                {ad.text}
              </span>
            )}
            <span className="text-gold-primary/40 text-[8px]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
