DealLens AI — urgent marketplace selector repair (14 October 2026)

CAUSE: the previous global-market.js had malformed market entries, so marketplace labels and generated links were invalid.

UPLOAD TO THE SAME GITHUB PAGES FOLDER AS guide-wireless-headphones.html:
1. global-market.js (REPLACE old version)
2. affiliate-config.js (add or replace)
Do NOT upload the folder itself. Do NOT replace guide pages, sitemap, robots.txt or site CSS.

AFTER GITHUB PAGES DEPLOYS:
1. Open guide-wireless-headphones.html?v=fix20261014 and hard-refresh (Ctrl+F5).
2. Select United States. The View current offers link should be https://www.amazon.com/s?k=wireless+headphones&tag=deallensai-20
3. Select United Kingdom. The link should point to https://www.amazon.co.uk/s?k=wireless+headphones with NO tag.
4. If old malformed labels remain, wait for deployment and clear cache, then confirm global-market.js is in the SAME directory as the guide HTML files.

This does not confirm final Amazon Associates approval, registered websites, tax setup or payment readiness.
