import NavbarServer from "@/components/NavbarServer";
import FooterServer from "@/components/FooterServer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Scentora Perfumes.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarServer />
      {children}
      <FooterServer />
    </>
  );
}
