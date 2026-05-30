"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

interface Variant {
  id: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
  product: { name: string; isActive: boolean };
}

export default function StockPage() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [stocks, setStocks] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/stock");
    if (res.ok) {
      const data: Variant[] = await res.json();
      setVariants(data);
      const map: Record<string, string> = {};
      data.forEach((v) => { map[v.id] = String(v.stock); });
      setStocks(map);
      setDirty(new Set());
    }
  }

  useEffect(() => { load(); }, []);

  function handleChange(id: string, value: string) {
    setStocks((prev) => ({ ...prev, [id]: value }));
    setDirty((prev) => new Set(prev).add(id));
  }

  async function handleSave() {
    setSaving(true);
    const updates = Array.from(dirty).map((id) => ({
      id,
      stock: parseInt(stocks[id]) || 0,
    }));

    const res = await fetch("/api/admin/stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates }),
    });
    setSaving(false);

    if (res.ok) {
      toast.success(`${updates.length} variant(s) updated.`);
      setDirty(new Set());
    } else {
      toast.error("Save failed.");
    }
  }

  const grouped = variants.reduce<Record<string, Variant[]>>((acc, v) => {
    const key = v.product.name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(v);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary" style={{ letterSpacing: "0.05em" }}>Stock Management</h1>
          <p className="text-sm text-text-muted mt-1">{variants.length} variants across {Object.keys(grouped).length} products</p>
        </div>
        {dirty.size > 0 && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            <Save size={13} /> {saving ? "Saving…" : `Save ${dirty.size} Change${dirty.size > 1 ? "s" : ""}`}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([productName, pvariants]) => (
          <div key={productName} className="glass-panel p-5">
            <h2 className="text-sm text-text-primary font-medium mb-3">
              {productName}
              {!pvariants[0].product.isActive && (
                <span className="ml-2 text-[9px] px-1.5 py-0.5 bg-red-400/10 text-red-400 border border-red-400/20 uppercase tracking-wider">Hidden</span>
              )}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pvariants.map((v) => {
                const isDirty = dirty.has(v.id);
                const current = parseInt(stocks[v.id] ?? "0");
                return (
                  <div key={v.id} className={`p-3 border transition-colors ${isDirty ? "border-border-gold" : "border-border-primary"}`}>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-text-secondary mb-2">{v.size}</p>
                    <p className="text-[9px] text-text-muted mb-2 font-mono">{v.sku}</p>
                    <input
                      type="number"
                      min="0"
                      value={stocks[v.id] ?? ""}
                      onChange={(e) => handleChange(v.id, e.target.value)}
                      className="w-full bg-bg-primary border border-border-primary text-text-primary text-sm px-2 py-1.5 outline-none focus:border-border-gold transition-colors"
                    />
                    <p className={`text-[9px] mt-1 ${current <= 0 ? "text-red-400" : current <= 5 ? "text-amber-400" : "text-green-400"}`}>
                      {current <= 0 ? "Out of stock" : current <= 5 ? "Low stock" : "In stock"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {variants.length === 0 && (
          <div className="glass-panel p-8 text-center text-text-muted text-sm">No products found.</div>
        )}
      </div>
    </div>
  );
}
