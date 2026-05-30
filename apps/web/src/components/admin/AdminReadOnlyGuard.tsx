"use client";

import { useEffect, useState } from "react";
import { X, Lock } from "lucide-react";

export default function AdminReadOnlyGuard({
  isReadOnly,
  children,
}: {
  isReadOnly: boolean;
  children: React.ReactNode;
}) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isReadOnly) return;

    const originalFetch = window.fetch;

    window.fetch = async (input, init) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.toString()
          : (input as Request).url;

      const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();

      if (url.includes("/api/admin") && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        setShowModal(true);
        return new Response(JSON.stringify({ error: "Read-only demo mode" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [isReadOnly]);

  return (
    <>
      {children}

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative z-10 w-full max-w-sm bg-bg-secondary border border-border-primary p-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-950/60 border border-amber-700/40 mx-auto mb-5">
              <Lock size={20} className="text-amber-400" strokeWidth={1.5} />
            </div>

            <h2 className="text-sm tracking-[0.2em] uppercase text-text-primary mb-3">
              Demo View Only
            </h2>
            <p className="text-sm text-text-muted leading-relaxed mb-6">
              You are exploring the admin panel in read-only mode. No changes can be saved. Contact the site owner for full access.
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 text-[11px] tracking-[0.25em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors"
            >
              Got It
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
