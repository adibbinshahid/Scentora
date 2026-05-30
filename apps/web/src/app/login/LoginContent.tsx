"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";
  const isAdminLogin = callbackUrl.startsWith("/admin");

  const [isMobile, setIsMobile] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  useEffect(() => {
    if (searchParams.get("error") === "CredentialsSignin") {
      setError("Invalid email or password.");
    }
  }, [searchParams]);

  if (isAdminLogin && isMobile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center mx-auto">
          <Monitor size={26} className="text-gold-primary" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-gold-primary mb-3">Desktop Required</p>
          <p className="text-text-secondary text-sm leading-relaxed">
            The admin panel is optimised for desktop. Please visit on a laptop or desktop computer for the full experience.
          </p>
        </div>
        <Link href="/" className="text-[10px] tracking-[0.2em] uppercase text-text-muted hover:text-text-secondary transition-colors">
          ← Back to Site
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-text-muted hover:text-gold-primary transition-colors"
      >
        <ArrowLeft size={13} />
        Home
      </Link>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.12) 0%, transparent 60%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png" alt="Scentora" width={160} height={80}
              className="object-contain mx-auto"
              style={{ mixBlendMode: "screen", filter: "drop-shadow(0 0 6px rgba(201,168,76,0.30))" }}
              priority
            />
          </Link>
          <p className="text-text-muted text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="glass-panel p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Email or Username">
              <input
                type="text" required autoComplete="username"
                autoCapitalize="none" autoCorrect="off" spellCheck={false}
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="w-full bg-bg-tertiary border border-border-primary text-text-primary text-sm px-4 py-3 placeholder:text-text-muted outline-none focus:border-border-gold transition-colors"
              />
            </Field>

            <Field label="Password">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} required
                  autoComplete="current-password"
                  autoCapitalize="none" autoCorrect="off" spellCheck={false}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bg-tertiary border border-border-primary text-text-primary text-sm px-4 py-3 pr-11 placeholder:text-text-muted outline-none focus:border-border-gold transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>

            {error && <p className="text-red-400 text-xs tracking-wide">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-[11px] tracking-[0.25em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? "Signing in…" : "Sign In"}
              {!loading && <ArrowRight size={13} />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border-primary text-center">
            <p className="text-sm text-text-muted">
              No account?{" "}
              <Link href="/register" className="text-gold-primary hover:text-gold-light transition-colors">Create one</Link>
            </p>
          </div>
        </div>

        <div className="text-center text-[10px] text-text-muted mt-6 leading-relaxed space-y-1">
          <p>Customer demo: <span className="text-text-secondary">customer@gmail.com</span> / <span className="text-text-secondary">customer123</span></p>
          <p>Admin (read-only): <span className="text-text-secondary">adminview</span> / <span className="text-text-secondary">adminview</span></p>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-2">{label}</label>
      {children}
    </div>
  );
}
