"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";
import type { Metadata } from "next";

export default function ProfilePage() {
  const { data: session, update } = useSession();

  const [name, setName] = useState(session?.user?.name ?? "");
  const [nameLoading, setNameLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setNameLoading(true);
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setNameLoading(false);
    if (res.ok) {
      await update({ name });
      toast.success("Name updated.");
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Update failed.");
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwLoading(true);
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setPwLoading(false);
    if (res.ok) {
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password changed.");
    } else {
      const d = await res.json().catch(() => ({}));
      setPwError(d.error ?? "Failed to change password.");
    }
  }

  return (
    <div className="space-y-10 max-w-lg">
      {/* Name */}
      <section>
        <h2
          className="font-display text-2xl text-text-primary mb-6"
          style={{ letterSpacing: "0.05em" }}
        >
          Personal Details
        </h2>
        <form onSubmit={saveName} className="space-y-5">
          <Field label="Full Name">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-bg-tertiary border border-border-primary text-text-primary text-sm px-4 py-3 outline-none focus:border-border-gold transition-colors"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              disabled
              value={session?.user?.email ?? ""}
              className="w-full bg-bg-tertiary border border-border-primary text-text-muted text-sm px-4 py-3 cursor-not-allowed opacity-60"
            />
            <p className="text-[10px] text-text-muted mt-1.5">Email cannot be changed.</p>
          </Field>
          <button
            type="submit"
            disabled={nameLoading}
            className="flex items-center gap-2 px-6 py-3 text-[11px] tracking-[0.2em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            {nameLoading ? "Saving…" : "Save Changes"}
            {!nameLoading && <Check size={12} />}
          </button>
        </form>
      </section>

      <div className="border-t border-border-primary" />

      {/* Password */}
      <section>
        <h2
          className="font-display text-2xl text-text-primary mb-6"
          style={{ letterSpacing: "0.05em" }}
        >
          Change Password
        </h2>
        <form onSubmit={savePassword} className="space-y-5">
          <Field label="Current Password">
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-bg-tertiary border border-border-primary text-text-primary text-sm px-4 py-3 outline-none focus:border-border-gold transition-colors"
            />
          </Field>
          <Field label="New Password">
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full bg-bg-tertiary border border-border-primary text-text-primary text-sm px-4 py-3 outline-none focus:border-border-gold transition-colors"
            />
          </Field>
          {pwError && <p className="text-red-400 text-xs">{pwError}</p>}
          <button
            type="submit"
            disabled={pwLoading}
            className="flex items-center gap-2 px-6 py-3 text-[11px] tracking-[0.2em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            {pwLoading ? "Updating…" : "Update Password"}
            {!pwLoading && <ArrowRight size={12} />}
          </button>
        </form>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
