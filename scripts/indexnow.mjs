// Tells search engines that support IndexNow (Bing, which also feeds
// DuckDuckGo and Yahoo; Yandex; Seznam; Naver) that juasoh.com's pages
// changed, so they recrawl them now instead of on their own schedule.
// Google does not take part in IndexNow; use Search Console for Google.
//
//   npm run indexnow     (after a deploy is live)
//
// It reads the URLs from the live sitemap, so run it after the deploy has
// finished. The key file public/<KEY>.txt proves the site owns this key.
const HOST = "juasoh.com";
const KEY = "a98d7e4ee1b1de4c75822f84eb4c55e6";

const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error("No URLs found in the live sitemap.");

const keyCheck = await fetch(`https://${HOST}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  throw new Error(`The key file https://${HOST}/${KEY}.txt is not live yet; deploy first.`);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
// 200 = accepted, 202 = accepted and the key is being verified.
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}
urlList.forEach((u) => console.log(`  ${u}`));
