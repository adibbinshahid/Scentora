"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, GripVertical } from "lucide-react";
import toast from "react-hot-toast";

interface ScrollAd {
  id: string;
  text: string;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
}

const emptyForm = { text: "", link: "", isActive: true, sortOrder: 0 };

export default function AdsPage() {
  const [ads, setAds] = useState<ScrollAd[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/ads");
    if (res.ok) setAds(await res.json());
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setForm({ ...emptyForm, sortOrder: ads.length });
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(ad: ScrollAd) {
    setForm({ text: ad.text, link: ad.link ?? "", isActive: ad.isActive, sortOrder: ad.sortOrder });
    setEditId(ad.id);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, link: form.link || null };
    const url = editId ? `/api/admin/ads/${editId}` : "/api/admin/ads";
    const method = editId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);

    if (res.ok) {
      toast.success(editId ? "Updated." : "Created.");
      setShowForm(false);
      load();
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Failed.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this ad?")) return;
    await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
    toast.success("Deleted.");
    load();
  }

  async function toggleActive(ad: ScrollAd) {
    await fetch(`/api/admin/ads/${ad.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !ad.isActive }),
    });
    load();
  }

  const input = "w-full bg-bg-primary border border-border-primary text-text-primary text-sm px-3 py-2 outline-none focus:border-border-gold transition-colors";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary" style={{ letterSpacing: "0.05em" }}>Scroll Ads</h1>
          <p className="text-sm text-text-muted mt-1">Marquee banner messages shown sitewide</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors"
        >
          <Plus size={13} /> New Ad
        </button>
      </div>

      {/* Preview */}
      {ads.filter((a) => a.isActive).length > 0 && (
        <div className="glass-panel p-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2">Preview (active ads)</p>
          <div className="overflow-hidden bg-bg-tertiary py-2 px-4">
            <p className="text-xs text-gold-primary tracking-[0.15em] truncate">
              {ads.filter((a) => a.isActive).map((a) => a.text).join("  ✦  ")}
            </p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-gold-primary">{editId ? "Edit Ad" : "New Ad"}</h2>
            <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-primary"><X size={16} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">Ad Text</label>
              <input value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Free shipping on orders over $150" className={input} />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">Link URL (optional)</label>
              <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/shop" className={input} />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className={input} />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-gold-primary" />
            <span className="text-sm text-text-secondary">Active</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="px-6 py-2 text-[11px] tracking-[0.2em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-60">
              {saving ? "Saving…" : editId ? "Save Changes" : "Create Ad"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[11px] tracking-[0.2em] uppercase border border-border-primary text-text-muted hover:text-text-primary transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-primary">
              {["#", "Text", "Link", "Active", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-text-muted font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary">
            {ads.map((ad) => (
              <tr key={ad.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 text-text-muted text-xs">{ad.sortOrder}</td>
                <td className="px-4 py-3 text-text-primary max-w-xs">
                  <p className="truncate">{ad.text}</p>
                </td>
                <td className="px-4 py-3 text-text-muted text-xs font-mono">{ad.link ?? "—"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(ad)}
                    className={`text-[9px] px-2 py-0.5 border uppercase tracking-wider transition-colors ${
                      ad.isActive
                        ? "text-green-400 bg-green-400/10 border-green-400/20"
                        : "text-text-muted bg-transparent border-border-primary hover:border-border-gold"
                    }`}
                  >
                    {ad.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(ad)} className="text-text-muted hover:text-gold-primary transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => handleDelete(ad.id)} className="text-text-muted hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {ads.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted text-sm">No ads yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
