import type { Metadata } from "next";
import type { ReactNode } from "react";
import { verifySession } from "@/lib/auth/dal";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin | Gedo Salon",
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const session = await verifySession();

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
