"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import CartDrawer from "@/components/CartDrawer";
import FloatingAssistant from "@/components/FloatingAssistant";
import FloatingDemoLinks from "@/components/FloatingDemoLinks";
import QuickAddModal from "@/components/QuickAddModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <CartDrawer />
        <QuickAddModal />
        {!pathname.startsWith("/admin") && <FloatingAssistant />}
        {!pathname.startsWith("/admin") && <FloatingDemoLinks />}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1A1A1A",
              color: "#F9F7F2",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
            },
          }}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
