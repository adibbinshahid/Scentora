"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";

const LABELS: Record<string, Record<string, string>> = {
  filter: { bestseller: "Bestsellers", featured: "Featured" },
  gender: { MALE: "For Him", FEMALE: "For Her", UNISEX: "Unisex" },
};

const FILTER_KEYS = ["category", "concentration", "gender", "family", "filter"];

export default function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const chips: { key: string; value: string; display: string }[] = [];
  for (const key of FILTER_KEYS) {
    const val = searchParams.get(key);
    if (val) {
      chips.push({
        key,
        value: val,
        display: LABELS[key]?.[val] ?? val,
      });
    }
  }

  if (chips.length === 0) return null;

  function remove(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {chips.map(({ key, display }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] tracking-[0.1em] border border-gold-primary text-gold-primary bg-gold-primary/5"
        >
          {display}
          <button onClick={() => remove(key)} aria-label={`Remove ${display} filter`}>
            <X size={10} />
          </button>
        </span>
      ))}
    </div>
  );
}
