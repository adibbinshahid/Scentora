"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const familyGradients: Record<string, string[]> = {
  "Oriental Woody": [
    "radial-gradient(ellipse at 30% 40%, #3D1F00 0%, #1A0A00 50%, #0A0600 100%)",
    "radial-gradient(ellipse at 70% 60%, #5C3A00 0%, #2A1800 50%, #0D0800 100%)",
    "radial-gradient(ellipse at 50% 20%, #C9A84C22 0%, #2A1800 40%, #0A0600 100%)",
  ],
  "Floral Musk": [
    "radial-gradient(ellipse at 30% 40%, #3D1860 0%, #1E0D30 50%, #0A0810 100%)",
    "radial-gradient(ellipse at 70% 60%, #5C2880 0%, #2A0D40 50%, #100818 100%)",
    "radial-gradient(ellipse at 50% 20%, #9B59B622 0%, #1E0D30 40%, #0A0810 100%)",
  ],
  "Woody Spiced": [
    "radial-gradient(ellipse at 30% 40%, #5C2800 0%, #2A1000 50%, #0D0600 100%)",
    "radial-gradient(ellipse at 70% 60%, #8B3A00 0%, #3D1800 50%, #100800 100%)",
    "radial-gradient(ellipse at 50% 20%, #CC441122 0%, #2A1000 40%, #0D0600 100%)",
  ],
  "Citrus Aromatic": [
    "radial-gradient(ellipse at 30% 40%, #1A3A15 0%, #0D2010 50%, #040A04 100%)",
    "radial-gradient(ellipse at 70% 60%, #2A5A20 0%, #153015 50%, #050D05 100%)",
    "radial-gradient(ellipse at 50% 20%, #7BC14422 0%, #0D2010 40%, #040A04 100%)",
  ],
  "Leather Oriental": [
    "radial-gradient(ellipse at 30% 40%, #5A0020 0%, #2A000F 50%, #0D0006 100%)",
    "radial-gradient(ellipse at 70% 60%, #8B0030 0%, #3D0018 50%, #100008 100%)",
    "radial-gradient(ellipse at 50% 20%, #CC003322 0%, #2A000F 40%, #0D0006 100%)",
  ],
  "Floral Spiced": [
    "radial-gradient(ellipse at 30% 40%, #5C1A35 0%, #2A0D1A 50%, #0D0408 100%)",
    "radial-gradient(ellipse at 70% 60%, #8B2850 0%, #3D1530 50%, #100608 100%)",
    "radial-gradient(ellipse at 50% 20%, #CC335522 0%, #2A0D1A 40%, #0D0408 100%)",
  ],
  "Woody Aromatic": [
    "radial-gradient(ellipse at 30% 40%, #1A3A45 0%, #0D1F2A 50%, #04080A 100%)",
    "radial-gradient(ellipse at 70% 60%, #255A6B 0%, #163040 50%, #050C0F 100%)",
    "radial-gradient(ellipse at 50% 20%, #44AACC22 0%, #0D1F2A 40%, #04080A 100%)",
  ],
  "Amber Balsamic": [
    "radial-gradient(ellipse at 30% 40%, #5C4500 0%, #2A2000 50%, #0D0A00 100%)",
    "radial-gradient(ellipse at 70% 60%, #8B6800 0%, #3D3000 50%, #100D00 100%)",
    "radial-gradient(ellipse at 50% 20%, #C9A84C22 0%, #2A2000 40%, #0D0A00 100%)",
  ],
  "Woody Creamy": [
    "radial-gradient(ellipse at 30% 40%, #4A3018 0%, #2A1E10 50%, #0D0B08 100%)",
    "radial-gradient(ellipse at 70% 60%, #6B4520 0%, #3D2A15 50%, #100E0A 100%)",
    "radial-gradient(ellipse at 50% 20%, #C4965022 0%, #2A1E10 40%, #0D0B08 100%)",
  ],
  "Smoky Balsamic": [
    "radial-gradient(ellipse at 30% 40%, #2E2E28 0%, #1A1A18 50%, #0A0A0A 100%)",
    "radial-gradient(ellipse at 70% 60%, #3A3A32 0%, #222220 50%, #0C0C0C 100%)",
    "radial-gradient(ellipse at 50% 20%, #88888822 0%, #1A1A18 40%, #0A0A0A 100%)",
  ],
  "Marine Aromatic": [
    "radial-gradient(ellipse at 30% 40%, #1A3E5C 0%, #0D2030 50%, #040A0D 100%)",
    "radial-gradient(ellipse at 70% 60%, #255A80 0%, #153040 50%, #050C10 100%)",
    "radial-gradient(ellipse at 50% 20%, #4499CC22 0%, #0D2030 40%, #040A0D 100%)",
  ],
  "Solar Floral": [
    "radial-gradient(ellipse at 30% 40%, #5C3800 0%, #2A1C00 50%, #0D0800 100%)",
    "radial-gradient(ellipse at 70% 60%, #8B5500 0%, #3D2A00 50%, #100A00 100%)",
    "radial-gradient(ellipse at 50% 20%, #FFAA2222 0%, #2A1C00 40%, #0D0800 100%)",
  ],
};

const DEFAULT_GRADIENTS = [
  "radial-gradient(ellipse at 30% 40%, #2A2A2A 0%, #1A1A1A 50%, #0A0A0A 100%)",
  "radial-gradient(ellipse at 70% 60%, #333333 0%, #222222 50%, #0D0D0D 100%)",
  "radial-gradient(ellipse at 50% 20%, #44444422 0%, #1A1A1A 40%, #0A0A0A 100%)",
];

interface Props {
  family: string;
  name: string;
  concentration: string;
  images?: string[];
}

export default function ProductGallery({ family, name, concentration, images }: Props) {
  const hasImages = images && images.length > 0;
  const gradients = familyGradients[family] ?? DEFAULT_GRADIENTS;
  const count = hasImages ? images.length : gradients.length;
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + count) % count);
  const next = () => setActive((i) => (i + 1) % count);

  return (
    <div className="flex flex-col gap-4">
      {/* Main frame */}
      <div
        className="relative aspect-[3/4] overflow-hidden"
        style={hasImages ? { background: "#0A0906" } : { background: gradients[active] }}
      >
        <AnimatePresence mode="wait">
          {hasImages ? (
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={images[active]}
                alt={`${name} ${active + 1}`}
                fill
                className="object-cover"
                priority={active === 0}
              />
            </motion.div>
          ) : (
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
              style={{ background: gradients[active] }}
            />
          )}
        </AnimatePresence>

        {/* Floating label */}
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <p className="text-[9px] tracking-[0.4em] uppercase text-gold-primary mb-1">
            {concentration}
          </p>
          <p className="font-display text-3xl text-text-primary" style={{ letterSpacing: "0.08em" }}>
            {name}
          </p>
        </div>

        {/* Nav arrows */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-bg-primary/40 hover:bg-bg-primary/70 backdrop-blur-sm transition-colors z-10"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-bg-primary/40 hover:bg-bg-primary/70 backdrop-blur-sm transition-colors z-10"
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {hasImages
          ? images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative w-16 aspect-square shrink-0 overflow-hidden transition-all ${
                  i === active
                    ? "ring-1 ring-gold-primary ring-offset-1 ring-offset-bg-primary"
                    : "opacity-50 hover:opacity-75"
                }`}
                aria-label={`View ${i + 1}`}
              >
                <Image src={src} alt={`${name} ${i + 1}`} fill className="object-cover" />
              </button>
            ))
          : gradients.map((grad, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-16 aspect-square shrink-0 transition-all ${
                  i === active
                    ? "ring-1 ring-gold-primary ring-offset-1 ring-offset-bg-primary"
                    : "opacity-50 hover:opacity-75"
                }`}
                style={{ background: grad }}
                aria-label={`View ${i + 1}`}
              />
            ))}
      </div>
    </div>
  );
}
