"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload, X, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { parseJsonArray } from "@/lib/utils";

interface Variant {
  id?: string;
  size: string;
  sku: string;
  price: number | string;
  salePrice: number | string | null;
  stock: number | string;
}

interface Category { id: string; name: string }

interface ProductData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  story: string;
  concentration: string;
  gender: string;
  family: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  images: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  isActive: boolean;
  metaTitle: string;
  metaDesc: string;
  variants: Variant[];
  categoryId: string | null;
}

const CONCENTRATIONS = ["EDP Intense", "EDP", "EDT"];
const GENDERS = ["MALE", "FEMALE", "UNISEX"];
const FAMILIES = [
  "Oriental Woody", "Floral Musk", "Woody Spiced", "Citrus Aromatic",
  "Leather Oriental", "Floral Spiced", "Woody Aromatic", "Amber Balsamic",
  "Woody Creamy", "Smoky Balsamic", "Marine Aromatic", "Solar Floral",
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProductForm({
  initial,
  categories,
}: {
  initial?: Partial<ProductData>;
  categories: Category[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<ProductData>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    story: initial?.story ?? "",
    concentration: initial?.concentration ?? "EDP",
    gender: initial?.gender ?? "UNISEX",
    family: initial?.family ?? "Oriental Woody",
    topNotes: initial?.topNotes ?? "",
    heartNotes: initial?.heartNotes ?? "",
    baseNotes: initial?.baseNotes ?? "",
    images: initial?.images ?? [],
    isFeatured: initial?.isFeatured ?? false,
    isBestseller: initial?.isBestseller ?? false,
    isActive: initial?.isActive ?? true,
    metaTitle: initial?.metaTitle ?? "",
    metaDesc: initial?.metaDesc ?? "",
    variants: initial?.variants ?? [{ size: "50ml", sku: "", price: "", salePrice: null, stock: "" }],
    categoryId: initial?.categoryId ?? null,
  });

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  function set(field: keyof ProductData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : slugify(name),
    }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const urlRes = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      const urlData = await urlRes.json().catch(() => ({}));
      if (!urlRes.ok) { toast.error(urlData.error ?? "Upload failed"); return; }

      const uploadRes = await fetch(urlData.signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) { toast.error("Upload failed"); return; }

      set("images", [...form.images, urlData.publicUrl]);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingImage(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeImage(idx: number) {
    set("images", form.images.filter((_, i) => i !== idx));
  }

  function addImageUrl(url: string) {
    if (!url.trim()) return;
    set("images", [...form.images, url.trim()]);
  }

  function addVariant() {
    set("variants", [...form.variants, { size: "", sku: "", price: "", salePrice: null, stock: "" }]);
  }

  function updateVariant(idx: number, field: keyof Variant, value: unknown) {
    const updated = form.variants.map((v, i) => (i === idx ? { ...v, [field]: value } : v));
    set("variants", updated);
  }

  function removeVariant(idx: number) {
    if (form.variants.length <= 1) return;
    set("variants", form.variants.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      ...form,
      variants: form.variants.map((v) => ({
        ...v,
        price: parseFloat(String(v.price)),
        salePrice: v.salePrice !== null && v.salePrice !== "" ? parseFloat(String(v.salePrice)) : null,
        stock: parseInt(String(v.stock)),
      })),
    };

    const url = isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (res.ok) {
      toast.success(isEdit ? "Product saved." : "Product created.");
      router.push("/admin/products");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Save failed.");
    }
  }

  async function handleDeactivate() {
    if (!initial?.id) return;
    await fetch(`/api/admin/products/${initial.id}`, {
      method: "DELETE",
    });
    toast.success("Product hidden.");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-text-muted hover:text-text-secondary transition-colors"
      >
        <ArrowLeft size={12} /> Products
      </button>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-text-primary" style={{ letterSpacing: "0.05em" }}>
          {isEdit ? "Edit Product" : "New Product"}
        </h1>
        <div className="flex gap-3">
          {isEdit && (
            <button
              onClick={handleDeactivate}
              className="px-4 py-2 text-[11px] tracking-[0.15em] uppercase border border-red-400/30 text-red-400 hover:bg-red-400/5 transition-colors"
            >
              Hide Product
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>

      {/* Basic info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Product Name">
            <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} className={input} />
          </Field>
          <Field label="Slug (URL)">
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={input} />
          </Field>
        </div>
        <Field label="Description">
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={textarea} />
        </Field>
        <Field label="Story (displayed on product page)">
          <textarea value={form.story} onChange={(e) => set("story", e.target.value)} rows={4} className={textarea} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Concentration">
            <select value={form.concentration} onChange={(e) => set("concentration", e.target.value)} className={select}>
              {CONCENTRATIONS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Gender">
            <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className={select}>
              {GENDERS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Fragrance Family">
            <select value={form.family} onChange={(e) => set("family", e.target.value)} className={select}>
              {FAMILIES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Category">
          <select value={form.categoryId ?? ""} onChange={(e) => set("categoryId", e.target.value || null)} className={select}>
            <option value="">— No category —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <div className="flex gap-6">
          {(["isFeatured", "isBestseller", "isActive"] as const).map((key) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => set(key, e.target.checked)}
                className="accent-gold-primary"
              />
              <span className="text-sm text-text-secondary capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Images */}
      <Section title="Images">
        {/* Dimension guide */}
        <div
          className="flex flex-wrap gap-3 mb-4 p-3 rounded-lg text-[10px]"
          style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}
        >
          {[
            { label: "Product card / shop grid", dims: "800 × 1000 px", ratio: "4 : 5", note: "Portrait — shows in collections & best sellers" },
            { label: "Product detail hero",      dims: "900 × 1200 px", ratio: "3 : 4", note: "Tall portrait — main gallery on product page" },
            { label: "Additional gallery",       dims: "800 × 800 px",  ratio: "1 : 1", note: "Square — zoom / alternate angle shots" },
          ].map(({ label, dims, ratio, note }) => (
            <div key={label} className="flex-1 min-w-[160px]">
              <p className="text-gold-primary font-medium mb-0.5">{label}</p>
              <p className="text-text-primary font-mono">{dims} &nbsp;<span className="text-text-muted">({ratio})</span></p>
              <p className="text-text-muted mt-0.5">{note}</p>
            </div>
          ))}
          <div className="w-full pt-2" style={{ borderTop: "1px solid rgba(201,168,76,0.12)" }}>
            <p className="text-text-muted">Use PNG or WebP with transparent background. Max 5 MB per image. First image = primary shown everywhere.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          {form.images.map((img, i) => (
            <div key={i} className="relative group w-24 h-32 bg-bg-tertiary border border-border-primary overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
              {i === 0 && <span className="absolute bottom-0 left-0 right-0 text-[8px] text-center py-0.5 bg-gold-primary text-bg-primary uppercase tracking-wider">Primary</span>}
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploadingImage}
            className="flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.15em] uppercase border border-border-primary text-text-secondary hover:border-border-gold hover:text-text-primary transition-colors disabled:opacity-50"
          >
            <Upload size={13} /> {uploadingImage ? "Uploading…" : "Upload Image"}
          </button>
          <div className="flex gap-2 flex-1 min-w-48">
            <input
              type="text"
              placeholder="Or paste image URL…"
              onKeyDown={(e) => { if (e.key === "Enter") { addImageUrl((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; } }}
              className={`${input} flex-1`}
            />
          </div>
        </div>
        <p className="text-[10px] text-text-muted mt-2">Press Enter to add URL. First image = primary.</p>
      </Section>

      {/* Fragrance notes */}
      <Section title="Fragrance Notes">
        <p className="text-xs text-text-muted mb-3">Comma-separated, e.g.: Saffron, Black Pepper, Incense</p>
        {(["topNotes", "heartNotes", "baseNotes"] as const).map((key) => (
          <Field key={key} label={key === "topNotes" ? "Top Notes" : key === "heartNotes" ? "Heart Notes" : "Base Notes"}>
            <input value={form[key]} onChange={(e) => set(key, e.target.value)} className={input} placeholder="Note 1, Note 2, Note 3" />
          </Field>
        ))}
      </Section>

      {/* Variants */}
      <Section title="Variants & Pricing">
        <div className="space-y-3">
          {form.variants.map((v, i) => (
            <div key={i} className="glass-panel p-4 grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
              <Field label="Size">
                <input value={v.size} onChange={(e) => updateVariant(i, "size", e.target.value)} className={input} placeholder="50ml" />
              </Field>
              <Field label="SKU">
                <input value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} className={input} placeholder="AN-EDP-50" />
              </Field>
              <Field label="Price ($)">
                <input type="number" step="0.01" value={v.price} onChange={(e) => updateVariant(i, "price", e.target.value)} className={input} />
              </Field>
              <Field label="Sale Price ($)">
                <input type="number" step="0.01" value={v.salePrice ?? ""} onChange={(e) => updateVariant(i, "salePrice", e.target.value || null)} className={input} placeholder="—" />
              </Field>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Field label="Stock">
                    <input type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} className={input} />
                  </Field>
                </div>
                <button onClick={() => removeVariant(i)} className="mb-0.5 text-text-muted hover:text-red-400 transition-colors p-2">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addVariant}
          className="flex items-center gap-2 mt-3 text-[11px] tracking-[0.15em] uppercase text-gold-primary hover:text-gold-light transition-colors"
        >
          <Plus size={12} /> Add Variant
        </button>
      </Section>

      {/* SEO */}
      <Section title="SEO (optional)">
        <Field label="Meta Title">
          <input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} className={input} />
        </Field>
        <Field label="Meta Description">
          <textarea value={form.metaDesc} onChange={(e) => set("metaDesc", e.target.value)} rows={2} className={textarea} />
        </Field>
      </Section>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 text-[11px] tracking-[0.25em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel p-6 space-y-4">
      <h2 className="text-[10px] tracking-[0.3em] uppercase text-gold-primary border-b border-border-primary pb-2">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const input = "w-full bg-bg-primary border border-border-primary text-text-primary text-sm px-3 py-2.5 outline-none focus:border-border-gold transition-colors placeholder:text-text-muted";
const textarea = "w-full bg-bg-primary border border-border-primary text-text-primary text-sm px-3 py-2.5 outline-none focus:border-border-gold transition-colors resize-none";
const select = "w-full bg-bg-primary border border-border-primary text-text-primary text-sm px-3 py-2.5 outline-none focus:border-border-gold transition-colors";
