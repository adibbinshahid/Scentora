import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminReadOnlyGuard from "@/components/admin/AdminReadOnlyGuard";

export const metadata = { title: "Admin" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as any)?.role as string | undefined;

  if (!session?.user || !["ADMIN", "SUPER_ADMIN", "ADMIN_VIEW"].includes(role ?? "")) {
    redirect("/login?callbackUrl=/admin");
  }

  const isReadOnly = role === "ADMIN_VIEW";

  return (
    <>
      {/* Mobile gate */}
      <div className="lg:hidden min-h-screen bg-bg-primary flex flex-col items-center justify-center px-8 text-center gap-6">
        <div className="w-14 h-14 rounded-full bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center mx-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-primary">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
          </svg>
        </div>
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-gold-primary mb-3">Desktop Required</p>
          <p className="text-text-secondary text-sm leading-relaxed">
            The admin panel is optimised for desktop. Please visit on a laptop or desktop computer for the full experience.
          </p>
        </div>
        <a href="/" className="text-[10px] tracking-[0.2em] uppercase text-text-muted hover:text-text-secondary transition-colors">
          ← Back to Site
        </a>
      </div>

      {/* Desktop admin */}
      <div className="hidden lg:flex min-h-screen bg-bg-primary">
        <AdminSidebar />
        <div className="flex-1 min-w-0 ml-60 flex flex-col">
          {isReadOnly && (
            <div className="px-6 py-2 border-b border-amber-900/40 bg-amber-950/30 flex items-center gap-2">
              <span className="text-amber-500/80 text-[10px] tracking-[0.2em] uppercase">
                Demo View — explore freely, saving is disabled
              </span>
            </div>
          )}
          <AdminReadOnlyGuard isReadOnly={isReadOnly}>
            <main className="flex-1 p-6 lg:p-8">{children}</main>
          </AdminReadOnlyGuard>
        </div>
      </div>
    </>
  );
}
