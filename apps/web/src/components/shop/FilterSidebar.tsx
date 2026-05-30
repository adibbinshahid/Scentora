"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const CONCENTRATIONS = ["EDP Intense", "EDP", "EDT"];
const GENDERS = [
  { value: "UNISEX", label: "Unisex" },
  { value: "FEMALE", label: "For Her" },
  { value: "MALE", label: "For Him" },
];
const FAMILIES = [
  "Oriental Woody",
  "Floral Musk",
  "Woody Spiced",
  "Citrus Aromatic",
  "Leather Oriental",
  "Floral Spiced",
  "Woody Aromatic",
  "Amber Balsamic",
  "Woody Creamy",
  "Smoky Balsamic",
  "Marine Aromatic",
  "Solar Floral",
];

interface Category {
  slug: string;
  name: string;
}

interface Props {
  categories: Category[];
  onClose?: () => void;
}

export default function FilterSidebar({ categories, onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
        params.delete("page");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const active = (key: string, value: string) => searchParams.get(key) === value;
  const anyActive =
    searchParams.get("category") ||
    searchParams.get("concentration") ||
    searchParams.get("gender") ||
    searchParams.get("family") ||
    searchParams.get("filter");

  function clearAll() {
    router.push(pathname, { scroll: false });
    onClose?.();
  }

  return (
    <aside className="w-full space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-[0.3em] uppercase text-gold-primary">
          Filter
        </span>
        <div className="flex items-center gap-3">
          {anyActive && (
            <button
              onClick={clearAll}
              className="text-[10px] tracking-[0.15em] uppercase text-text-muted hover:text-text-secondary transition-colors"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Collections */}
      <FilterGroup label="Collection">
        {categories.map((cat) => (
          <FilterChip
            key={cat.slug}
            label={cat.name}
            active={active("category", cat.slug)}
            onClick={() => setParam("category", cat.slug)}
          />
        ))}
      </FilterGroup>

      {/* Quick filters */}
      <FilterGroup label="Shop By">
        <FilterChip
          label="Bestsellers"
          active={active("filter", "bestseller")}
          onClick={() => setParam("filter", "bestseller")}
        />
        <FilterChip
          label="Featured"
          active={active("filter", "featured")}
          onClick={() => setParam("filter", "featured")}
        />
      </FilterGroup>

      {/* Concentration */}
      <FilterGroup label="Concentration">
        {CONCENTRATIONS.map((c) => (
          <FilterChip
            key={c}
            label={c}
            active={active("concentration", c)}
            onClick={() => setParam("concentration", c)}
          />
        ))}
      </FilterGroup>

      {/* Gender */}
      <FilterGroup label="For">
        {GENDERS.map(({ value, label }) => (
          <FilterChip
            key={value}
            label={label}
            active={active("gender", value)}
            onClick={() => setParam("gender", value)}
          />
        ))}
      </FilterGroup>

      {/* Fragrance family */}
      <FilterGroup label="Fragrance Family">
        <div className="space-y-2">
          {FAMILIES.map((f) => (
            <button
              key={f}
              onClick={() => setParam("family", f)}
              className={cn(
                "block w-full text-left text-sm transition-colors py-0.5",
                active("family", f)
                  ? "text-gold-primary"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.25em] uppercase text-text-secondary mb-3 pb-2 border-b border-border-primary">
        {label}
      </p>
      {children}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 mr-2 mb-2 px-3 py-1 text-[11px] tracking-[0.1em] border transition-all",
        active
          ? "border-gold-primary text-gold-primary bg-gold-primary/5"
          : "border-border-primary text-text-muted hover:border-border-gold hover:text-text-secondary"
      )}
    >
      {label}
      {active && <X size={10} />}
    </button>
  );
}
