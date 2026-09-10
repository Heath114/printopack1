// Exercises the importer's pure helpers against the client's OWN live content, including the two
// Arabic posts whose hashtag-block titles are on the site right now.
import { normalise, pickTitle, trimTitle, isGeneric, readMeta, decodeEntities } from './li-import.js';

let fail = 0;
const ok = (cond, label, got) => {
  if (!cond) fail++;
  console.log(`${cond ? 'ok  ' : 'FAIL'}  ${label}${cond ? '' : `\n        got: ${JSON.stringify(got)}`}`);
};
const section = (t) => console.log(`\n--- ${t} ---`);

section('their real Arabic post: hashtag-only headline');
// Verbatim from the live database.
const honeyHead = '#اليوم_العالمي_للعسل #برنتوباك #جودة #تغليف_مرن #حياة_أحلى #عسل_طبيعي #worldhoneyday #printopack #quality #flexiblepackaging #sweeterlife #naturalhoney';
const honeyBody = 'اللهم أجعل حياتك أحلى من العسل! 😉🍯\nفي برنتوباك، نهتم بتغليف عسلك المفضل بأجود المواد.';
const honeyTitle = pickTitle(honeyHead, honeyBody);
ok(!honeyTitle.includes('#'), 'no hashtag survives into the title', honeyTitle);
ok(honeyTitle.startsWith('اللهم أجعل حياتك'), 'falls through to the first line of Arabic prose', honeyTitle);
console.log(`        title: ${honeyTitle}`);

section('their second Arabic post');
const foodHead = '#سعودي_فود_للتصنيع #سعودي_فود #برنتوباك #تعبئة_وتغليف #صناعات_غذائية #حلول_التغليف';
const foodBody = 'شركاؤكم في الارتقاء بجودة منتجاتكم الغذائية من خلال حلول تغليف متطورة.';
const foodTitle = pickTitle(foodHead, foodBody);
ok(!foodTitle.includes('#'), 'no hashtag survives', foodTitle);
ok(foodTitle.startsWith('شركاؤكم'), 'Arabic prose becomes the title', foodTitle);
console.log(`        title: ${foodTitle}`);

section('mixed: hashtags trailing real Arabic prose');
const mixed = pickTitle('افتتاح خط الإنتاج الجديد #برنتوباك #جودة', 'body text');
ok(mixed === 'افتتاح خط الإنتاج الجديد', 'trailing hashtags stripped, prose kept', mixed);

section('Arabic-aware trimming');
const longAr = 'ا'.repeat(60) + ' ' + 'ب'.repeat(200);
ok(trimTitle(longAr).length <= 121, 'long Arabic title is cut to heading length', trimTitle(longAr).length);
ok(trimTitle('عنوان عربي،').endsWith('عربي'), 'Arabic comma trimmed from the end', trimTitle('عنوان عربي،'));
ok(trimTitle('عنوان عربي؛') === 'عنوان عربي', 'Arabic semicolon trimmed', trimTitle('عنوان عربي؛'));
ok(trimTitle('Short one') === 'Short one', 'short titles untouched', trimTitle('Short one'));

section('boilerplate LinkedIn writes when a post has no words');
for (const g of ['Printopack posted on LinkedIn', 'Printopack posted a video on LinkedIn',
                 'Post by Printopack', 'Printopack | LinkedIn', 'LinkedIn Login, Sign in | LinkedIn', '']) {
  ok(isGeneric(g), `treated as boilerplate: ${JSON.stringify(g)}`, g);
}
for (const real of ['Top 10 Packaging Companies in Saudi Arabia', 'اللهم أجعل حياتك أحلى من العسل',
                    'We joined the Syria Expo 2026']) {
  ok(!isGeneric(real), `treated as real content: ${JSON.stringify(real.slice(0, 34))}`, real);
}

section('a post that is only hashtags and nothing else');
ok(pickTitle('#برنتوباك #جودة', '') === '', 'yields no title rather than a wall of hashtags', pickTitle('#برنتوباك #جودة', ''));

section('URL handling');
const good = 'https://www.linkedin.com/posts/saudimodernpackaging_activity-6854368777556025344-UTlc';
ok(normalise(good).url === good, 'a clean post URL passes through', normalise(good));
ok(normalise(good + '?utm_source=share&trk=x').url === good, 'tracking parameters stripped', normalise(good + '?utm_source=share'));
ok(normalise('http://www.linkedin.com/posts/a').url.startsWith('https://'), 'http upgraded to https', normalise('http://www.linkedin.com/posts/a'));
ok(!!normalise('https://sa.linkedin.com/posts/a').url, 'country subdomain accepted', normalise('https://sa.linkedin.com/posts/a'));
ok(!!normalise('https://www.linkedin.com/feed/update/urn:li:activity:123').url, 'feed/update form accepted', normalise('https://www.linkedin.com/feed/update/urn:li:activity:123'));
ok(!!normalise('https://lnkd.in/abc').shortLink, 'short link routed to the resolver', normalise('https://lnkd.in/abc'));

section('URL handling: what must be refused');
for (const bad of ['https://www.linkedin.com/company/saudimodernpackaging',
                   'https://www.linkedin.com/in/nasser-nabil-35440380/',
                   'https://example.com/posts/x',
                   'https://evil.com/linkedin.com/posts/x',
                   'https://linkedin.com.evil.com/posts/x',
                   'file:///etc/passwd',
                   'http://169.254.169.254/latest/meta-data/',
                   'not a url',
                   '']) {
  const r = normalise(bad);
  ok(!!r.error && !r.url, `refused: ${JSON.stringify(bad.slice(0, 46))}`, r);
}

section('meta tags: values containing an apostrophe');
// Regression: the old character class stopped at whichever quote came first, so a LinkedIn
// article summary arrived as 68 characters of a 160-character sentence, with no error.
const withApostrophe = `<meta property="og:description" content="the packaging industry's negative impact on the environment" />`;
ok(readMeta(withApostrophe, 'og:description').endsWith('environment'), 'apostrophe does not truncate the value', readMeta(withApostrophe, 'og:description'));
ok(readMeta(`<meta content='single quoted "inner" value' property='og:title'>`, 'og:title') === 'single quoted "inner" value', 'content before property, single quotes', readMeta(`<meta content='single quoted "inner" value' property='og:title'>`, 'og:title'));
ok(readMeta('<meta property="og:title" content="plain">', 'og:title') === 'plain', 'ordinary case still works', readMeta('<meta property="og:title" content="plain">', 'og:title'));
ok(readMeta('<html></html>', 'og:title') === '', 'missing tag yields empty string', readMeta('<html></html>', 'og:title'));

section('entity decoding');
ok(decodeEntities('a &amp; b &quot;c&quot; &#39;d&#39;') === `a & b "c" 'd'`, 'named and numeric entities', decodeEntities('a &amp; b &quot;c&quot; &#39;d&#39;'));
ok(decodeEntities('&#x627;&#x644;&#x639;&#x631;&#x628;&#x64A;&#x629;') === 'العربية', 'hex entities decode to Arabic', decodeEntities('&#x627;&#x644;&#x639;&#x631;&#x628;&#x64A;&#x629;'));

console.log(`\n${fail === 0 ? 'ALL PASS' : fail + ' FAILURE(S)'}`);
process.exit(fail ? 1 : 0);
