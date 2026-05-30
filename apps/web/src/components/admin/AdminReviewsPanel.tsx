"use client";

import { useState } from "react";
import { Star, Trash2, Plus, Pencil, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  rating: number;
  comment: string;
  customerName: string;
  isVerified: boolean;
  createdAt: Date;
}

interface Props {
  productId: string;
  productName: string;
  reviews: Review[];
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={16}
            className={(hover || value) >= i ? "text-gold-primary fill-gold-primary" : "text-text-muted/40"}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewRow({
  review,
  onUpdate,
  onDelete,
}: {
  review: Review;
  onUpdate: (updated: Review) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customerName: review.customerName,
    rating: review.rating,
    comment: review.comment,
    isVerified: review.isVerified,
  });

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await res.json();
      onUpdate(updated);
      setEditing(false);
    } else {
      alert("Failed to save");
    }
    setSaving(false);
  }

  function handleCancel() {
    setForm({
      customerName: review.customerName,
      rating: review.rating,
      comment: review.comment,
      isVerified: review.isVerified,
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="py-3.5 border-b border-border-primary space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1">
              Name
            </label>
            <input
              value={form.customerName}
              onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
              className="w-full bg-bg-primary border border-border-primary px-2.5 py-1.5 text-xs text-text-primary outline-none focus:border-gold-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1">
              Rating
            </label>
            <StarPicker value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
          </div>
        </div>
        <div>
          <label className="block text-[9px] tracking-[0.15em] uppercase text-text-muted mb-1">
            Comment
          </label>
          <textarea
            value={form.comment}
            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            rows={2}
            className="w-full bg-bg-primary border border-border-primary px-2.5 py-1.5 text-xs text-text-primary outline-none focus:border-gold-primary/50 resize-none transition-colors"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isVerified}
              onChange={(e) => setForm((f) => ({ ...f, isVerified: e.target.checked }))}
              className="accent-gold-primary"
            />
            <span className="text-xs text-text-muted">Verified purchase</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              <Check size={11} /> {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase border border-border-primary text-text-muted hover:text-text-secondary transition-colors"
            >
              <X size={11} /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-border-primary last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm text-text-primary font-medium">{review.customerName}</span>
          {review.isVerified && (
            <span className="text-[9px] tracking-[0.1em] uppercase text-green-400">Verified</span>
          )}
          <span className="text-xs text-text-muted">
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}
          </span>
        </div>
        <div className="flex gap-0.5 mb-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={11}
              className={i <= review.rating ? "text-gold-primary fill-gold-primary" : "text-text-muted/40"}
            />
          ))}
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">{review.comment}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0 mt-0.5">
        <button
          onClick={() => setEditing(true)}
          className="text-text-muted hover:text-gold-primary transition-colors"
          title="Edit"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(review.id)}
          className="text-text-muted hover:text-red-400 transition-colors"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default function AdminReviewsPanel({ productId, productName, reviews: initialReviews }: Props) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customerName: "", rating: 5, comment: "", isVerified: true });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName.trim() || !form.comment.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productId }),
      });
      if (!res.ok) throw new Error("Failed");
      const created = await res.json();
      setReviews((prev) => [created, ...prev]);
      setForm({ customerName: "", rating: 5, comment: "", isVerified: true });
      setShowForm(false);
      router.refresh();
    } catch {
      alert("Failed to add review");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      router.refresh();
    }
  }

  function handleUpdate(updated: Review) {
    setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    router.refresh();
  }

  return (
    <div className="mt-8 glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl text-text-primary" style={{ letterSpacing: "0.05em" }}>
            Reviews
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} for {productName}
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 text-[10px] tracking-[0.15em] uppercase bg-gold-primary/10 border border-gold-primary/25 text-gold-primary hover:bg-gold-primary/20 transition-colors"
        >
          <Plus size={12} /> Add Review
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-6 p-4 border border-border-primary space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-text-muted mb-1.5">
                Customer Name
              </label>
              <input
                value={form.customerName}
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                className="w-full bg-bg-primary border border-border-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-gold-primary/50 transition-colors"
                placeholder="Jane D."
                required
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-text-muted mb-1.5">
                Rating
              </label>
              <StarPicker value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
            </div>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-text-muted mb-1.5">
              Comment
            </label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              className="w-full bg-bg-primary border border-border-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-gold-primary/50 resize-none transition-colors"
              rows={3}
              placeholder="Review text…"
              required
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isVerified}
              onChange={(e) => setForm((f) => ({ ...f, isVerified: e.target.checked }))}
              className="accent-gold-primary"
            />
            <span className="text-xs text-text-muted">Verified purchase</span>
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-[10px] tracking-[0.15em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {loading ? "Saving…" : "Add Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2 text-[10px] tracking-[0.15em] uppercase border border-border-primary text-text-muted hover:text-text-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-text-muted py-4">No reviews yet.</p>
      ) : (
        <div>
          {reviews.map((r) => (
            <ReviewRow
              key={r.id}
              review={r}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
