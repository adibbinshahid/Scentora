import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import NavbarServer from "@/components/NavbarServer";
import FooterServer from "@/components/FooterServer";
import AccountSidebar from "@/components/account/AccountSidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  return (
    <>
      <NavbarServer />
      <main className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Page title */}
          <div className="mb-10 pb-6 border-b border-border-primary">
            <span className="block text-[10px] tracking-[0.4em] uppercase text-gold-primary mb-2">
              Your Account
            </span>
            <h1
              className="font-display font-light text-4xl text-text-primary"
              style={{ letterSpacing: "0.06em" }}
            >
              My Scentora
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            <AccountSidebar />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </main>
      <FooterServer />
    </>
  );
}
