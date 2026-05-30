"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (next.length < 4) {
      toast.error("Password must be at least 4 characters.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Password changed. Use it on next login.");
      setCurrent(""); setNext(""); setConfirm("");
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Failed.");
    }
  }

  const input = "w-full bg-bg-primary border border-border-primary text-text-primary text-sm px-3 py-2.5 outline-none focus:border-border-gold transition-colors pr-10";

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="font-display text-3xl text-text-primary" style={{ letterSpacing: "0.05em" }}>Settings</h1>
        <p className="text-sm text-text-muted mt-1">Admin account settings</p>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-5 pb-2 border-b border-border-primary">
          <Lock size={14} className="text-gold-primary" />
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-gold-primary">Change Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
                className={input}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                required
                className={input}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className={input.replace("pr-10", "")}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-2 py-2.5 text-[11px] tracking-[0.2em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            {saving ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
