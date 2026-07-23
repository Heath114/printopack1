// News posts, sourced from the content store (db/seed.json baseline, or the live published
// snapshot on a Cloudflare build). The page shape is preserved so news.astro needs no change.
import { collection, displayDate } from '../lib/content';

export type Bi = { en: string; ar: string };
export type Post = { date: string; img: string; cat: Bi; title: Bi; link?: string };

export const category: Bi = { en: "General Information", ar: "معلومات عامة" };

export const posts: Post[] = collection('news').map((r) => ({
  date: displayDate(r.date),
  img: r.image,
  cat: { en: r.category || category.en, ar: r.categoryAr || category.ar },
  title: { en: r.title, ar: r.titleAr },
  link: r.link || undefined,
}));
