import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import HeroForm from "@/components/admin/HeroForm";

export default async function AdminHeroPage() {
  await verifySession();
  const hero = await prisma.heroContent.findUnique({ where: { id: "hero" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Homepage</h1>
        <p className="mt-1 text-sm text-neutral-500">The hero banner shown at the top of the public homepage.</p>
      </div>

      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <HeroForm hero={hero} />
      </div>
    </div>
  );
}
