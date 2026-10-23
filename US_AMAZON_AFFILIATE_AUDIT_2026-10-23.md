# DealLens AI — Amazon US affiliate link audit (2026-10-23)

Scope: static source inspection on development branch; **not** live click testing or confirmation of Amazon account approval.

## Verified in source
- Amazon Associates US tracking ID is `deallensai-20` in `affiliate-config.js` and the inline search handler in `index.html`; matches the user's Associates report.
- `app.js` constructs Amazon search links via URL API with `k` and conditional `tag` parameters. It escapes user text before rendering HTML and marks tagged offer anchors `rel="sponsored nofollow noopener"`.
- `index.html` builds its own search links via inline JS; this duplicates marketplace configuration. Its active inline tags are US and AE only, while `affiliate-config.js` also lists UK and CA. **Action:** unify routing in a separate, tested change; do not assume any marketplace approval.
- The new `global-finder-preview.html` intentionally uses untagged Amazon searches, so it will not generate Associates commissions in its current state.
- `amazon.html` includes `affiliate-config.js` and `app.js`; guide pages use the app's `.offer-link[data-query]` flow where present.
- The homepage and guide index already included general affiliate disclosures. On this branch, the exact Amazon identification sentence `As an Amazon Associate I earn from qualifying purchases.` has now been added to those pages.

## Risk and follow-up
1. **P1:** Account review/eligibility status still unverified. A StoreID, clicks, and dashboard access are not evidence of final acceptance. Verify Amazon Associates account messages.
2. **P1:** Browser-check the actual generated Amazon.com URL includes `tag=deallensai-20` on existing approved-use links; do not self-click repeatedly or make test purchases.
3. **P1:** Confirm disclosures are clear and close to links in deployed HTML; review US FTC requirements and current Amazon policy. Do not treat this static audit as legal compliance certification.
4. **P2:** Consolidate market-to-tag routing (homepage inline configuration vs `affiliate-config.js`) with a single source of truth, and ensure nonverified markets are not presented as approved.
5. **P2:** Verify real site origin and whether guide links resolve under the GitHub Pages project path. Inspect live HTTP and browser console.
6. **P2:** Assess whether browser-local outbound click storage in `app.js` is necessary, transparent, and consistent with privacy disclosures. It is **not** aggregate analytics and cannot attribute the 24 Amazon clicks.
7. **P2:** Payment onboarding incomplete in user-provided Amazon dashboard; finish before payout.
8. **P3:** Consider tracking IDs per approved content section for aggregate performance only, not per visitor, consistent with Amazon rules.

## Amazon report supplied by account holder
Sep 22–Oct 21 2026, US tracking ID: 24 clicks, 0 ordered items, 0 shipped, $0 earnings. This is not proof that visitors were physically in the US or that all clicks originated on DealLens.

## Deployment
Changes are committed **only to feature/global-product-finder-v1**, not production `main`. No approval or real-browser test claimed.
