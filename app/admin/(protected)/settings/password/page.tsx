import { verifySession } from "@/lib/auth/dal";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default async function AdminChangePasswordPage() {
  await verifySession();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Change Password</h1>
        <p className="mt-1 text-sm text-neutral-500">
          You&apos;ll be signed out after changing your password and need to log in again.
        </p>
      </div>

      <div className="max-w-md rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
