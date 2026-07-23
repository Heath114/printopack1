// Product groups, sourced from the content store (db/seed.json baseline, or the live published
// snapshot on a Cloudflare build). The page shape is preserved so products.astro and the
// /products/[slug] route need no change. `filters` is a fixed browse taxonomy (structural).
import { collection } from '../lib/content';

export type Bi = { en: string; ar: string };

export const filters: { key: string; label: Bi }[] = [
  { key: "all", label: { en: "All products", ar: "كل المنتجات" } },
  { key: "snacks", label: { en: "Snacks & Nuts", ar: "الوجبات الخفيفة والمكسّرات" } },
  { key: "confectionery", label: { en: "Confectionery", ar: "الحلويات" } },
  { key: "bakery", label: { en: "Bakery & Breads", ar: "المخابز والخبز" } },
  { key: "staples", label: { en: "Pantry Staples", ar: "المؤن الأساسية" } },
  { key: "beverage", label: { en: "Bottles & Liquids", ar: "القوارير والسوائل" } },
  { key: "chilled", label: { en: "Frozen & Chilled", ar: "المجمّدة والمبرّدة" } },
  { key: "specialty", label: { en: "Specialty", ar: "منتجات خاصة" } },
];

export const categories = collection('productGroups').map((r) => ({
  slug: r.slug,
  group: r.filter,
  img: r.image,
  name: { en: r.name, ar: r.nameAr },
  desc: { en: r.description, ar: r.descriptionAr },
}));
