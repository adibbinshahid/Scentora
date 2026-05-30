"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Account created but sign-in failed. Please log in.");
      router.push("/login");
    } else {
      router.push("/account");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.12) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Scentora"
              width={160}
              height={80}
              className="object-contain mx-auto"
              style={{ mixBlendMode: "screen", filter: "drop-shadow(0 0 6px rgba(201,168,76,0.30))" }}
              priority
            />
          </Link>
          <p className="text-text-muted text-sm mt-2">Create your account</p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Full Name">
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-bg-tertiary border border-border-primary text-text-primary text-sm px-4 py-3 placeholder:text-text-muted outline-none focus:border-border-gold transition-colors"
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-bg-tertiary border border-border-primary text-text-primary text-sm px-4 py-3 placeholder:text-text-muted outline-none focus:border-border-gold transition-colors"
              />
            </Field>

            <Field label="Password">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  className="w-full bg-bg-tertiary border border-border-primary text-text-primary text-sm px-4 py-3 pr-11 placeholder:text-text-muted outline-none focus:border-border-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password strength hints */}
              {(passwordFocused || password.length > 0) && (
                <div className="mt-2 space-y-1">
                  {PASSWORD_RULES.map(({ label, test }) => {
                    const passed = test(password);
                    return (
                      <div key={label} className="flex items-center gap-2">
                        <Check
                          size={11}
                          className={passed ? "text-green-400" : "text-text-muted"}
                        />
                        <span
                          className={`text-[11px] ${passed ? "text-green-400" : "text-text-muted"}`}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Field>

            {error && (
              <p className="text-red-400 text-xs tracking-wide">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-[11px] tracking-[0.25em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account…" : "Create Account"}
              {!loading && <ArrowRight size={13} />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border-primary">
            <p className="text-sm text-text-muted text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-gold-primary hover:text-gold-light transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-text-muted mt-6 leading-relaxed">
          By creating an account you agree to our{" "}
          <a href="/terms" className="underline underline-offset-2 hover:text-text-secondary">
            Terms of Service
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.2em] uppercase text-text-secondary mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
