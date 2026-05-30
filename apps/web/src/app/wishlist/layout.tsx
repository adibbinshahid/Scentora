import NavbarServer from "@/components/NavbarServer";
import FooterServer from "@/components/FooterServer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarServer />
      {children}
      <FooterServer />
    </>
  );
}
