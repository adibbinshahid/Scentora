"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderValue: number | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
}

const empty = {
  code: "",
  type: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING",
  value: "",
  minOrderValue: "",
  maxUses: "",
  isActive: true,
  expiresAt: "",
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/coupons");
    if (res.ok) setCoupons(await res.json());
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setForm(empty);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(c: Coupon) {
    setForm({
      code: c.code,
      type: c.type as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING",
      value: String(c.value),
      minOrderValue: c.minOrderValue != null ? String(c.minOrderValue) : "",
      maxUses: c.maxUses != null ? String(c.maxUses) : "",
      isActive: c.isActive,
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "",
    });
    setEditId(c.id);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      ...form,
      code: form.code.toUpperCase(),
      value: parseFloat(form.value) || 0,
      minOrderValue: form.minOrderValue ? parseFloat(form.minOrderValue) : null,
      maxUses: form.maxUses ? parseInt(form.maxUses) : null,
      expiresAt: form.expiresAt || null,
    };

    const url = editId ? `/api/admin/coupons/${editId}` : "/api/admin/coupons";
    const method = editId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);

    if (res.ok) {
      toast.success(editId ? "Coupon updated." : "Coupon created.");
      setShowForm(false);
      load();
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Failed.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    toast.success("Deleted.");
    load();
  }

  async function toggleActive(c: Coupon) {
    await fetch(`/api/admin/coupons/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    load();
  }

  const input = "w-full bg-bg-primary border border-border-primary text-text-primary text-sm px-3 py-2 outline-none focus:border-border-gold transition-colors";
  const select = "w-full bg-bg-primary border border-border-primary text-text-primary text-sm px-3 py-2 outline-none focus:border-border-gold transition-colors";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary" style={{ letterSpacing: "0.05em" }}>Coupons & Discounts</h1>
          <p className="text-sm text-text-muted mt-1">{coupons.length} total</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors"
        >
          <Plus size={13} /> New Coupon
        </button>
      </div>

      {showForm && (
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-gold-primary">
              {editId ? "Edit Coupon" : "New Coupon"}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-primary">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">Code</label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER20"
                className={input}
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING" })} className={select}>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED_AMOUNT">Fixed Amount ($)</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">
                Value {form.type === "PERCENTAGE" ? "(%)" : form.type === "FIXED_AMOUNT" ? "($)" : "(n/a)"}
              </label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className={input}
                disabled={form.type === "FREE_SHIPPING"}
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">Min Order ($)</label>
              <input type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} placeholder="—" className={input} />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">Max Uses</label>
              <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="Unlimited" className={input} />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">Expires</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={input} />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-gold-primary" />
            <span className="text-sm text-text-secondary">Active</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 text-[11px] tracking-[0.2em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-60"
            >
              {saving ? "Saving…" : editId ? "Save Changes" : "Create Coupon"}
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
              {["Code", "Type", "Value", "Min Order", "Uses", "Expires", "Active", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-text-muted font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 font-mono text-text-primary text-xs">{c.code}</td>
                <td className="px-4 py-3 text-text-secondary text-xs">{c.type.replace("_", " ")}</td>
                <td className="px-4 py-3 text-text-primary">
                  {c.type === "PERCENTAGE" ? `${c.value}%` : c.type === "FIXED_AMOUNT" ? formatPrice(c.value) : "—"}
                </td>
                <td className="px-4 py-3 text-text-muted text-xs">{c.minOrderValue != null ? formatPrice(c.minOrderValue) : "—"}</td>
                <td className="px-4 py-3 text-text-muted text-xs">{c.usedCount}{c.maxUses != null ? ` / ${c.maxUses}` : ""}</td>
                <td className="px-4 py-3 text-text-muted text-xs">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(c)} className={c.isActive ? "text-green-400" : "text-text-muted"}>
                    {c.isActive ? <Check size={14} /> : <X size={14} />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(c)} className="text-text-muted hover:text-gold-primary transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="text-text-muted hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-text-muted text-sm">No coupons yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
