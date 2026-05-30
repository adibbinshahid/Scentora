"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Delete failed.");
      setLoading(false);
      setConfirming(false);
    }
  }

  if (error) {
    return (
      <span className="text-[10px] text-red-400 max-w-[160px] leading-tight">{error}</span>
    );
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-text-muted">Delete &ldquo;{name}&rdquo;?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-[10px] tracking-[0.1em] uppercase text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
        >
          {loading ? "…" : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-[10px] tracking-[0.1em] uppercase text-text-muted hover:text-text-secondary transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-text-muted hover:text-red-400 transition-colors"
    >
      <Trash2 size={11} /> Delete
    </button>
  );
}
