import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import SocialLinkForm from "@/components/admin/SocialLinkForm";

export default async function EditSocialLinkPage({ params }: { params: Promise<{ id: string }> }) {
  await verifySession();
  const { id } = await params;
  const socialLink = await prisma.socialLink.findUnique({ where: { id } });

  if (!socialLink) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Social Link</h1>
      </div>
      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <SocialLinkForm socialLink={socialLink} />
      </div>
    </div>
  );
}
