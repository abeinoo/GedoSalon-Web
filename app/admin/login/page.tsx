import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { siteContent } from "@/lib/content";
import { getAuthenticatedUser } from "@/lib/auth/dal";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | Gedo Salon",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ passwordChanged?: string }>;
}) {
  // DB-backed check (not just JWT-signature-valid) — safe to redirect on,
  // unlike Proxy's optimistic check. See proxy.ts for why that distinction
  // matters here specifically.
  const user = await getAuthenticatedUser();
  if (user) {
    redirect("/admin");
  }

  const { passwordChanged } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Image
            src={siteContent.brand.logo}
            alt={siteContent.brand.name}
            width={96}
            height={96}
            priority
            className="h-20 w-20 object-contain"
          />
          <h1 className="mt-4 text-lg font-bold tracking-widest text-white">ADMIN PANEL</h1>
          <p className="mt-1 text-sm text-white/50">Sign in to manage Gedo Salon content.</p>
        </div>

        {passwordChanged === "1" && (
          <p role="status" className="mt-6 rounded-md border border-green-400/30 bg-green-400/10 px-4 py-2.5 text-center text-sm text-green-300">
            Your password was changed. Please log in again with your new password.
          </p>
        )}

        <LoginForm />
      </div>
    </div>
  );
}
