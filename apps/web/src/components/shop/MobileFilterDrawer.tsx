"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FilterSidebar from "./FilterSidebar";

interface Category {
  slug: string;
  name: string;
}

export default function MobileFilterDrawer({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-text-primary border border-border-gold px-4 py-3 min-h-[44px] hover:bg-gold-primary/10 transition-colors"
        style={{ background: "rgba(201,168,76,0.06)" }}
      >
        <SlidersHorizontal size={14} className="text-gold-primary" />
        Filters
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[90vw] glass-card-dark border-r border-border-primary z-50 overflow-y-auto p-6"
            >
              <FilterSidebar categories={categories} onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
