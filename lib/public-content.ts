import "server-only";

import { prisma } from "@/lib/db";

export async function getActiveAbout() {
  const about = await prisma.aboutContent.findUnique({ where: { id: "main" } });
  return about?.isActive ? about : null;
}

export async function getActiveServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getActiveOffers() {
  return prisma.offer.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getHero() {
  return prisma.heroContent.findUnique({ where: { id: "hero" } });
}

export async function getBusinessInfo() {
  return prisma.businessInfo.findUnique({ where: { id: "main" } });
}

export async function getFooterSettings() {
  return prisma.footerSettings.findUnique({ where: { id: "main" } });
}

export async function getSeoSettings() {
  return prisma.seoSettings.findUnique({ where: { id: "main" } });
}

export async function getActiveSocialLinks() {
  return prisma.socialLink.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getActiveOpeningHours() {
  return prisma.openingHours.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getActiveBranches() {
  return prisma.branch.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getActiveBarbers() {
  return prisma.barber.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getActiveGalleryImages() {
  return prisma.galleryImage.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });
}
