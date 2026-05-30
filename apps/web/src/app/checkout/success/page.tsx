import { Suspense } from "react";
import NavbarServer from "@/components/NavbarServer";
import FooterServer from "@/components/FooterServer";
import SuccessContent from "./SuccessContent";

export default function CheckoutSuccessPage() {
  return (
    <>
      <NavbarServer />
      <Suspense fallback={<main className="pt-20 min-h-screen" />}>
        <SuccessContent />
      </Suspense>
      <FooterServer />
    </>
  );
}
