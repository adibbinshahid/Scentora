"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, Save, ChevronDown, ChevronRight, Image as ImageIcon, Type, AlignLeft, Link as LinkIcon, Ruler } from "lucide-react";
import toast from "react-hot-toast";
import { upload } from "@vercel/blob/client";

interface ContentItem {
  id: string;
  key: string;
  value: string;
  type: string;
  label: string | null;
}

/* Recommended dimensions for every image field */
const IMAGE_HINTS: Record<string, { dims: string; ratio: string; note: string }> = {
  hero_bg_image:          { dims: "1920 × 1080 px", ratio: "16 : 9",  note: "Desktop hero — full-screen cinematic perfume shoot, landscape" },
  hero_bg_image_mobile:   { dims: "750 × 1200 px",  ratio: "5 : 8",   note: "Mobile hero — portrait crop, bottle centered, dark background" },
  story_image:            { dims: "800 × 600 px",   ratio: "4 : 3",   note: "Brand story section right-column visual" },
  shop_banner_image:      { dims: "1440 × 400 px",  ratio: "3.6 : 1", note: "Wide banner shown at the top of the shop page" },
  about_hero_bg_image:    { dims: "1920 × 1080 px", ratio: "16 : 9",  note: "About page cinematic hero — dark editorial perfume shoot" },
  about_ingredients_image:{ dims: "800 × 1000 px",  ratio: "4 : 5",   note: "Ingredients section — vertical portrait or ingredient flat-lay" },
  about_perfumer1_image:  { dims: "600 × 750 px",   ratio: "4 : 5",   note: "Perfumer 1 portrait — formal editorial headshot" },
  about_perfumer2_image:  { dims: "600 × 750 px",   ratio: "4 : 5",   note: "Perfumer 2 portrait — formal editorial headshot" },
  about_atelier_image:    { dims: "1200 × 800 px",  ratio: "3 : 2",   note: "Atelier or boutique interior / exterior shot" },
};

/* Page → Layer (sub-section) → Field keys */
const PAGES: {
  page: string;
  icon: string;
  sections: { title: string; keys: string[] }[];
}[] = [
  {
    page: "Global & Branding",
    icon: "🌐",
    sections: [
      {
        title: "Brand Identity",
        keys: ["global_brand_name", "global_brand_tagline", "global_meta_title_suffix"],
      },
    ],
  },
  {
    page: "Navigation",
    icon: "🔗",
    sections: [
      {
        title: "Nav Links",
        keys: [
          "nav_link1_label", "nav_link1_href",
          "nav_link2_label", "nav_link2_href",
          "nav_link3_label", "nav_link3_href",
        ],
      },
    ],
  },
  {
    page: "Home Page",
    icon: "🏠",
    sections: [
      {
        title: "Layer 1 — Hero Section",
        keys: [
          "hero_eyebrow",
          "hero_title_line1",
          "hero_title_line2",
          "hero_tagline",
          "hero_cta",
          "hero_cta_href",
          "hero_cta_secondary",
          "hero_cta_secondary_href",
          "hero_scroll_hint",
          "hero_bg_image",
          "hero_bg_image_mobile",
          "hero_card_eyebrow",
          "hero_card_desc",
          "hero_card_cta",
        ],
      },
      {
        title: "Layer 2 — Brand Value Strip",
        keys: ["feature1_label", "feature2_label", "feature3_label", "feature4_label"],
      },
      {
        title: "Layer 3 — Our Best Sellers",
        keys: ["featured_title", "featured_view_all"],
      },
      {
        title: "Layer 4 — Editorial Promo Blocks",
        keys: [
          "editorial_block1_title", "editorial_block1_desc", "editorial_block1_cta", "editorial_block1_href",
          "editorial_block2_title", "editorial_block2_desc", "editorial_block2_cta", "editorial_block2_href",
          "editorial_block3_title", "editorial_block3_desc", "editorial_block3_cta", "editorial_block3_href",
        ],
      },
      {
        title: "Layer 5 — Newsletter Strip",
        keys: [
          "newsletter_title",
          "newsletter_body",
          "newsletter_cta",
          "newsletter_placeholder",
          "newsletter_success",
        ],
      },
    ],
  },
  {
    page: "Shop Page",
    icon: "🛍",
    sections: [
      {
        title: "Page Header",
        keys: ["shop_title", "shop_subtitle", "shop_banner_image"],
      },
    ],
  },
  {
    page: "About Us Page",
    icon: "🏛",
    sections: [
      {
        title: "Layer 1 — Hero",
        keys: [
          "about_hero_eyebrow",
          "about_hero_title",
          "about_hero_subtitle",
          "about_hero_bg_image",
        ],
      },
      {
        title: "Layer 2 — Ingredients",
        keys: [
          "about_ingredients_eyebrow",
          "about_ingredients_title",
          "about_ingredients_body",
          "about_ingredients_image",
          "about_ingredient1_name", "about_ingredient1_origin", "about_ingredient1_desc",
          "about_ingredient2_name", "about_ingredient2_origin", "about_ingredient2_desc",
          "about_ingredient3_name", "about_ingredient3_origin", "about_ingredient3_desc",
          "about_ingredient4_name", "about_ingredient4_origin", "about_ingredient4_desc",
        ],
      },
      {
        title: "Layer 3 — Perfumers",
        keys: [
          "about_perfumers_eyebrow",
          "about_perfumers_title",
          "about_perfumers_body",
          "about_perfumer1_name", "about_perfumer1_role", "about_perfumer1_bio", "about_perfumer1_image",
          "about_perfumer2_name", "about_perfumer2_role", "about_perfumer2_bio", "about_perfumer2_image",
        ],
      },
      {
        title: "Layer 4 — Atelier & Contact",
        keys: [
          "about_atelier_eyebrow",
          "about_atelier_title",
          "about_atelier_body",
          "about_atelier_address",
          "about_atelier_city",
          "about_atelier_hours",
          "about_atelier_email",
          "about_atelier_phone",
          "about_atelier_image",
        ],
      },
    ],
  },
  {
    page: "Brand Story",
    icon: "📖",
    sections: [
      {
        title: "Layer 1 — Headline & Body",
        keys: ["story_eyebrow", "story_title", "story_body1", "story_body2", "story_cta", "story_cta_href", "story_image"],
      },
      {
        title: "Layer 2 — Pillars",
        keys: [
          "story_pillar1_number", "story_pillar1_title", "story_pillar1_desc",
          "story_pillar2_number", "story_pillar2_title", "story_pillar2_desc",
          "story_pillar3_number", "story_pillar3_title", "story_pillar3_desc",
        ],
      },
    ],
  },
  {
    page: "Footer",
    icon: "🦶",
    sections: [
      {
        title: "Brand & Legal",
        keys: ["footer_brand_desc", "footer_copyright"],
      },
      {
        title: "Social Links",
        keys: [
          "footer_social_instagram",
          "footer_social_facebook",
          "footer_social_pinterest",
          "footer_social_tiktok",
        ],
      },
    ],
  },
  {
    page: "AI Chatbot",
    icon: "🤖",
    sections: [
      {
        title: "Chatbot Brief & Instructions",
        keys: ["chatbot_brief"],
      },
    ],
  },
];

const FIELD_ICON: Record<string, React.ReactNode> = {
  text:     <Type size={11} className="text-text-muted" />,
  richtext: <AlignLeft size={11} className="text-text-muted" />,
  longtext: <AlignLeft size={11} className="text-gold-primary/60" />,
  image:    <ImageIcon size={11} className="text-gold-primary" />,
};

function fieldHint(key: string): string {
  if (key.endsWith("_href") || key.endsWith("_url")) return "URL — include leading /";
  return "";
}

export default function ContentPage() {
  const [items, setItems]         = useState<ContentItem[]>([]);
  const [values, setValues]       = useState<Record<string, string>>({});
  const [types, setTypes]         = useState<Record<string, string>>({});
  const [labels, setLabels]       = useState<Record<string, string>>({});
  const [dirty, setDirty]         = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [loading, setLoading]     = useState(true);
  const [loadErr, setLoadErr]     = useState(false);

  /* Two-level open state: "Home Page" → Set{"Layer 1 — Hero Section", ...} */
  const [openPages, setOpenPages]       = useState<Set<string>>(new Set(["Home Page"]));
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["Layer 1 — Hero Section"]));

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function load() {
    setLoading(true);
    setLoadErr(false);
    try {
      const res = await fetch("/api/admin/content");
      if (!res.ok) { setLoadErr(true); return; }
      const data: ContentItem[] = await res.json();
      setItems(data);
      const v: Record<string, string> = {};
      const t: Record<string, string> = {};
      const l: Record<string, string> = {};
      data.forEach((d) => { v[d.key] = d.value; t[d.key] = d.type; l[d.key] = d.label ?? d.key; });
      setValues(v); setTypes(t); setLabels(l);
      setDirty(new Set());
    } catch {
      setLoadErr(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setDirty((prev) => new Set(prev).add(key));
  }

  async function saveSingle(key: string): Promise<boolean> {
    const res = await fetch("/api/admin/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: values[key] ?? "" }),
    });
    if (res.ok) {
      setDirty((prev) => { const n = new Set(prev); n.delete(key); return n; });
      return true;
    }
    return false;
  }

  async function handleSaveAll() {
    setSaving(true);
    let ok = 0;
    for (const key of Array.from(dirty)) {
      if (await saveSingle(key)) ok++;
    }
    setSaving(false);
    if (ok > 0) toast.success(`${ok} item${ok > 1 ? "s" : ""} saved.`);
  }

  async function handleImageUpload(key: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(key);
    try {
      // Uploads straight to Vercel Blob (bypasses the 4.5 MB serverless body limit).
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });

      handleChange(key, blob.url);
      toast.success("Uploaded. Save to apply.");
    } catch {
      toast.error("Upload failed.");
    } finally {
      setUploading(null);
      if (fileRefs.current[key]) fileRefs.current[key]!.value = "";
    }
  }

  function togglePage(page: string) {
    setOpenPages((prev) => {
      const n = new Set(prev);
      n.has(page) ? n.delete(page) : n.add(page);
      return n;
    });
  }

  function toggleSection(sec: string) {
    setOpenSections((prev) => {
      const n = new Set(prev);
      n.has(sec) ? n.delete(sec) : n.add(sec);
      return n;
    });
  }

  const inputCls = "w-full bg-bg-primary border border-border-primary text-text-primary text-sm px-3 py-2.5 outline-none focus:border-border-gold transition-colors rounded-sm";

  function renderField(key: string) {
    const type    = types[key]  ?? "text";
    const label   = labels[key] ?? key;
    const hint    = IMAGE_HINTS[key];
    const urlHint = fieldHint(key);
    const isDirty = dirty.has(key);
    const val     = values[key] ?? "";

    return (
      <div
        key={key}
        className={`px-6 py-4 transition-colors ${isDirty ? "bg-gold-primary/[0.025]" : ""}`}
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Field header */}
        <div className="flex items-start justify-between mb-2.5 gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {FIELD_ICON[type]}
              <label className="text-[10.5px] tracking-[0.18em] uppercase text-text-primary font-medium">
                {label}
              </label>
              {isDirty && (
                <span className="text-[8px] px-1.5 py-0.5 bg-gold-primary/15 text-gold-primary border border-border-gold uppercase tracking-wider rounded-sm">
                  unsaved
                </span>
              )}
            </div>
            <p className="text-[8.5px] text-text-muted font-mono">{key}</p>
            {urlHint && (
              <p className="flex items-center gap-1 text-[9px] text-text-muted mt-0.5">
                <LinkIcon size={9} /> {urlHint}
              </p>
            )}
          </div>
          {isDirty && (
            <button
              onClick={() => saveSingle(key).then((ok) => ok && toast.success("Saved."))}
              className="shrink-0 text-[10px] tracking-[0.15em] uppercase text-gold-primary hover:text-gold-light transition-colors whitespace-nowrap"
            >
              Save
            </button>
          )}
        </div>

        {/* Image field */}
        {type === "image" ? (
          <div className="space-y-3">
            {/* Dimension hint */}
            {hint && (
              <div
                className="flex items-start gap-2 px-3 py-2 rounded-sm"
                style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}
              >
                <Ruler size={12} className="text-gold-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gold-primary font-medium">{hint.dims}</p>
                  <p className="text-[9px] text-text-muted">Ratio {hint.ratio} · {hint.note}</p>
                </div>
              </div>
            )}

            {/* Preview */}
            {val && (
              <div
                className="relative w-full max-w-sm overflow-hidden rounded-sm"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <img
                  src={val}
                  alt=""
                  className="w-full h-32 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.15"; }}
                />
                {hint && (
                  <div
                    className="absolute bottom-0 left-0 right-0 px-2 py-1 text-[8px] text-text-muted"
                    style={{ background: "rgba(0,0,0,0.65)" }}
                  >
                    {hint.dims} recommended
                  </div>
                )}
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-3 items-center flex-wrap">
              <input
                ref={(el) => { fileRefs.current[key] = el; }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(key, e)}
              />
              <button
                type="button"
                onClick={() => fileRefs.current[key]?.click()}
                disabled={uploading === key}
                className="flex items-center gap-2 px-4 py-2 text-[10px] tracking-[0.15em] uppercase border border-border-primary text-text-secondary hover:border-border-gold hover:text-text-primary transition-colors disabled:opacity-50 rounded-sm"
              >
                <Upload size={11} />
                {uploading === key ? "Uploading…" : "Upload Image"}
              </button>
              <span className="text-[9px] text-text-muted">or</span>
              <input
                type="text"
                value={val}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder="Paste image URL…"
                className={`${inputCls} flex-1 min-w-40`}
              />
            </div>
          </div>
        ) : type === "richtext" ? (
          <textarea
            value={val}
            onChange={(e) => handleChange(key, e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
          />
        ) : type === "longtext" ? (
          <textarea
            value={val}
            onChange={(e) => handleChange(key, e.target.value)}
            rows={16}
            placeholder="Write the AI chatbot's instructions here…"
            className={`${inputCls} resize-y font-mono text-[11px] leading-relaxed`}
          />
        ) : (
          <input
            type="text"
            value={val}
            onChange={(e) => handleChange(key, e.target.value)}
            className={inputCls}
          />
        )}
      </div>
    );
  }

  /* Collect all known keys for "Other" fallback */
  const knownKeys = new Set(PAGES.flatMap((p) => p.sections.flatMap((s) => s.keys)));
  const uncategorised = items.filter((i) => !knownKeys.has(i.key));

  const totalDirty = dirty.size;

  return (
    <div className="space-y-4">
      {/* ── Sticky header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="font-display text-3xl text-text-primary"
            style={{ letterSpacing: "0.05em" }}
          >
            Content Management
          </h1>
          <p className="text-[12px] text-text-muted mt-1">
            All site text and images — organised by page → layer
          </p>
        </div>
        {totalDirty > 0 && (
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-60 shrink-0"
          >
            <Save size={13} />
            {saving ? "Saving…" : `Save All (${totalDirty})`}
          </button>
        )}
      </div>

      {loading && (
        <div className="glass-panel p-8 text-center text-text-muted text-sm">
          Loading content…
        </div>
      )}
      {loadErr && !loading && (
        <div className="glass-panel p-8 text-center text-sm" style={{ color: "rgba(220,80,80,0.9)", border: "1px solid rgba(220,80,80,0.25)" }}>
          Failed to load content. Check your database connection, then{" "}
          <button onClick={load} className="underline hover:opacity-80">retry</button>.
        </div>
      )}

      {/* ── Page blocks ── */}
      <div className="space-y-3">
        {PAGES.map((pageDef) => {
          const allPageKeys  = pageDef.sections.flatMap((s) => s.keys);
          const pageItems    = allPageKeys;
          const pageDirtyCount = allPageKeys.filter((k) => dirty.has(k)).length;
          const pageOpen     = openPages.has(pageDef.page);

          return (
            <div
              key={pageDef.page}
              className="overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
              }}
            >
              {/* ── Page header (Level 1 toggle) ── */}
              <button
                onClick={() => togglePage(pageDef.page)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base" aria-hidden>{pageDef.icon}</span>
                  {pageOpen
                    ? <ChevronDown size={14} className="text-gold-primary" />
                    : <ChevronRight size={14} className="text-text-muted" />}
                  <span className="text-[12px] tracking-[0.22em] uppercase text-text-primary font-medium">
                    {pageDef.page}
                  </span>
                  <span className="text-[9px] text-text-muted">
                    {pageItems.length} fields
                  </span>
                </div>
                {pageDirtyCount > 0 && (
                  <span className="text-[9px] px-2 py-0.5 bg-gold-primary/10 text-gold-primary border border-border-gold uppercase tracking-wider rounded-sm">
                    {pageDirtyCount} unsaved
                  </span>
                )}
              </button>

              {/* ── Sub-sections (Level 2) ── */}
              {pageOpen && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {pageDef.sections.map((sec) => {
                    const secDirty   = sec.keys.filter((k) => dirty.has(k)).length;
                    const secFields  = sec.keys;
                    const secOpen    = openSections.has(sec.title);

                    return (
                      <div
                        key={sec.title}
                        className="overflow-hidden"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      >
                        {/* Section toggle */}
                        <button
                          onClick={() => toggleSection(sec.title)}
                          className="w-full flex items-center justify-between px-8 py-3 hover:bg-white/[0.015] transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            {secOpen
                              ? <ChevronDown size={12} className="text-gold-primary/70" />
                              : <ChevronRight size={12} className="text-text-muted/60" />}
                            <span className="text-[10px] tracking-[0.2em] uppercase text-text-secondary">
                              {sec.title}
                            </span>
                            <span className="text-[8.5px] text-text-muted">
                              {secFields.length} fields
                            </span>
                          </div>
                          {secDirty > 0 && (
                            <span className="text-[8px] px-1.5 py-0.5 bg-gold-primary/08 text-gold-primary/80 border border-border-gold/50 uppercase tracking-wider rounded-sm">
                              {secDirty} unsaved
                            </span>
                          )}
                        </button>

                        {/* Fields */}
                        {secOpen && (
                          <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                            {sec.keys.map((key) => renderField(key))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* ── Uncategorised fallback ── */}
        {uncategorised.length > 0 && (
          <div
            className="overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
            }}
          >
            <button
              onClick={() => togglePage("_other")}
              className="w-full flex items-center gap-3 px-6 py-4 hover:bg-white/[0.02]"
            >
              <span aria-hidden>🗂</span>
              {openPages.has("_other")
                ? <ChevronDown size={14} className="text-gold-primary" />
                : <ChevronRight size={14} className="text-text-muted" />}
              <span className="text-[12px] tracking-[0.22em] uppercase text-text-primary">Other</span>
              <span className="text-[9px] text-text-muted">{uncategorised.length} fields</span>
            </button>
            {openPages.has("_other") && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {uncategorised.map((item) => renderField(item.key))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
