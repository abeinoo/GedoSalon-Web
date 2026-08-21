import { verifySession } from "@/lib/auth/dal";
import SocialLinkForm from "@/components/admin/SocialLinkForm";

export default async function NewSocialLinkPage() {
  await verifySession();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Add Social Link</h1>
      </div>
      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <SocialLinkForm />
      </div>
    </div>
  );
}
