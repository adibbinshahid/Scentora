import NavbarServer from "@/components/NavbarServer";
import FooterServer from "@/components/FooterServer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Scentora Perfumes.",
};

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    body: `By accessing or purchasing from Scentora Perfumes, you agree to be bound by these Terms of Service. If you do not agree to any part of these terms, you may not use our services.`,
  },
  {
    title: "Orders & Payment",
    body: `All prices are listed in USD and include applicable taxes. We accept major credit cards and other payment methods displayed at checkout, processed securely via Stripe. We reserve the right to refuse or cancel orders at our discretion, including cases of suspected fraud.`,
  },
  {
    title: "Shipping & Delivery",
    body: `Estimated delivery times are provided at checkout and are not guaranteed. We are not liable for delays caused by shipping carriers, customs, or events outside our control. Risk of loss passes to you upon delivery.`,
  },
  {
    title: "Returns & Refunds",
    body: `Unopened products may be returned within 30 days of delivery for a full refund. Opened fragrances are non-returnable due to the nature of the product. To initiate a return, contact us at demo@demo.com with your order number.`,
  },
  {
    title: "Intellectual Property",
    body: `All content on this site — including product images, descriptions, logos, and design — is the property of Scentora Perfumes and protected by copyright law. You may not reproduce or distribute any content without prior written permission.`,
  },
  {
    title: "Limitation of Liability",
    body: `Scentora Perfumes shall not be liable for indirect, incidental, or consequential damages arising from your use of our products or services. Our total liability for any claim shall not exceed the amount paid for the order in question.`,
  },
  {
    title: "Governing Law",
    body: `These terms are governed by the laws of the jurisdiction in which Scentora Perfumes is registered. Any disputes shall be resolved through binding arbitration or the courts of that jurisdiction.`,
  },
  {
    title: "Changes to Terms",
    body: `We reserve the right to modify these terms at any time. Continued use of our services after changes are posted constitutes acceptance. We recommend reviewing this page periodically.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <NavbarServer />
      <main className="min-h-screen pt-28 pb-24 px-4 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-14 text-center">
            <p className="text-[9px] tracking-[0.35em] uppercase text-gold-primary mb-4">Legal</p>
            <h1 className="font-display font-light text-4xl text-text-primary mb-4" style={{ letterSpacing: "0.06em" }}>
              Terms of Service
            </h1>
            <p className="text-[11px] text-text-muted">Last updated: May 2025</p>
            <div className="mt-6 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.35), transparent)" }} />
          </div>

          {/* Intro */}
          <p className="text-[13px] text-text-secondary leading-relaxed mb-12">
            Please read these terms carefully before using Scentora Perfumes. These terms govern your access to and use of our website and services.
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
              Questions about these terms? Email us at{" "}
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
