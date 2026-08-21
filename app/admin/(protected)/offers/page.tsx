import Link from "next/link";
import Image from "next/image";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import OfferRowActions from "@/components/admin/OfferRowActions";

export default async function AdminOffersPage() {
  await verifySession();
  const offers = await prisma.offer.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Offers</h1>
          <p className="mt-1 text-sm text-neutral-500">{offers.length} total</p>
        </div>
        <Link
          href="/admin/offers/new"
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800"
        >
          + ADD OFFER
        </Link>
      </div>

      {offers.length === 0 ? (
        <EmptyState
          title="No offers yet"
          description="Add your first offer so it can appear on the public homepage."
          actionLabel="Add Offer"
          actionHref="/admin/offers/new"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs tracking-widest text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-medium">OFFER</th>
                <th className="px-5 py-3 font-medium">DISCOUNT</th>
                <th className="px-5 py-3 font-medium">DATES</th>
                <th className="px-5 py-3 font-medium">ORDER</th>
                <th className="px-5 py-3 font-medium">STATUS</th>
                <th className="px-5 py-3 font-medium text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {offers.map((offer) => (
                <tr key={offer.id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                        <Image src={offer.image} alt={offer.title} fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="font-medium text-neutral-900">{offer.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{offer.discount}</td>
                  <td className="px-5 py-3 text-neutral-600">
                    {offer.startDate || offer.endDate
                      ? `${offer.startDate?.toLocaleDateString("en-GB") ?? "—"} → ${offer.endDate?.toLocaleDateString("en-GB") ?? "—"}`
                      : "—"}
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{offer.displayOrder}</td>
                  <td className="px-5 py-3">
                    <StatusBadge active={offer.isActive} />
                  </td>
                  <td className="px-5 py-3">
                    <OfferRowActions id={offer.id} title={offer.title} isActive={offer.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
