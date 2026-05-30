import NavbarServer from "@/components/NavbarServer";
import FooterServer from "@/components/FooterServer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Scentora collects, uses, and protects your personal information.",
};

const SECTIONS = [
  {
    title: "Information We Collect",
    body: `When you place an order or create an account, we collect your name, email address, shipping address, and payment information. We also collect browsing data (pages visited, products viewed) through cookies to improve your shopping experience.`,
  },
  {
    title: "How We Use Your Information",
    body: `Your information is used to process orders, send shipping updates, and personalise your experience. With your consent, we may send you fragrance recommendations and exclusive offers. We never sell your personal data to third parties.`,
  },
  {
    title: "Cookies",
    body: `We use essential cookies to keep your cart and session active, and optional analytics cookies to understand how visitors use our site. You can disable non-essential cookies in your browser settings at any time.`,
  },
  {
    title: "Data Security",
    body: `All payment transactions are encrypted via SSL. We store passwords in hashed form and restrict access to personal data to employees who need it to fulfil your orders.`,
  },
  {
    title: "Third-Party Services",
    body: `We use Stripe for payment processing and selected shipping carriers to fulfil orders. These services have their own privacy policies and only receive the data necessary to complete your transaction.`,
  },
  {
    title: "Your Rights",
    body: `You may request access to, correction of, or deletion of your personal data at any time by emailing us. If you are in the EU or UK, you have additional rights under GDPR including the right to data portability and the right to object to processing.`,
  },
  {
    title: "Changes to This Policy",
    body: `We may update this policy periodically. We will notify registered customers of material changes by email. Continued use of our site after changes constitutes acceptance of the updated policy.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <NavbarServer />
      <main className="min-h-screen pt-28 pb-24 px-4 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-14 text-center">
            <p className="text-[9px] tracking-[0.35em] uppercase text-gold-primary mb-4">Legal</p>
            <h1 className="font-display font-light text-4xl text-text-primary mb-4" style={{ letterSpacing: "0.06em" }}>
              Privacy Policy
            </h1>
            <p className="text-[11px] text-text-muted">Last updated: May 2025</p>
            <div className="mt-6 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.35), transparent)" }} />
          </div>

          {/* Intro */}
          <p className="text-[13px] text-text-secondary leading-relaxed mb-12">
            At Scentora Perfumes, your privacy matters. This policy explains what personal information we collect, how we use it, and the choices you have.
          </p>

          {/* Sections */}
          <div className="space-y-10">
            {SECTIONS.map(({ title, body }, i) => (
              <div key={i}>
                <h2 className="font-display text-[17px] text-text-primary mb-3" style={{ letterSpacing: "0.04em" }}>
                  {title}
                </h2>
                <p className="text-[13px] text-text-secondary leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div
            className="mt-16 p-7 rounded-2xl"
            style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}
          >
            <p className="text-[12px] text-text-muted leading-relaxed">
              Questions about this policy? Contact our privacy team at{" "}
              <a href="mailto:demo@demo.com" className="text-gold-primary hover:text-gold-light transition-colors">
                demo@demo.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <FooterServer />
    </>
  );
}
