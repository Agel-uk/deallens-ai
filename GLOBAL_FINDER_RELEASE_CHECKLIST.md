# DealLens AI Global — release acceptance and revenue gate

Status: **PRE-RELEASE / NOT APPROVED FOR MERGE** (2026-10-21).
Branch: `feature/global-product-finder-v1`; draft PR #34.
Existing production pages, AdSense, sitemap, robots and affiliate tracking are unchanged.

## What the preview actually does
- Nine country/currency selections and localized Amazon *search* destinations.
- Seven categories, linked to seven existing buying guides.
- Positive budget validation, use-dependent ordering of a four-item shopping checklist.
- Optional manual comparison of up to two user-supplied products; within-budget candidates first, then user-supplied feature score, then lower price.
- No live product catalog, AI inference, payment processing, account, user tracking, verified stock or pricing, or commission-tagged links.

## Acceptance matrix (must be performed in actual browsers before merge)
1. Chrome desktop and Safari iPhone, plus Android Chrome: load the standalone preview and inspect navigation, 320px viewport, labels, keyboard focus and scrolling.
2. For each of nine countries: submit with category laptops; verify currency formatting and that the retailer search link uses the matching country domain. Verify all nine external destinations manually.
3. For each of seven categories: verify four checklist items and that the buying-guide link resolves.
4. For each use type: verify checklist order changes and is consistent with the stated heuristic.
5. Budget: 0, negative, empty, nonnumeric, huge value, and normal value; confirm invalid values block results.
6. Candidates: none, one, two; price below/at/above budget; zero price; empty/negative/invalid price; unknown feature score; XSS-like name. Confirm name renders as text, not markup, and over-budget candidates cannot rank ahead of eligible candidates.
7. Repeat submit and change country/category: verify results and links update, with no stale content.
8. Confirm browser console has no errors and there are no third-party network requests except when the user clicks an external retailer link.
9. Confirm preview has noindex and is not linked from live navigation or sitemap before launch.
10. Confirm affiliate eligibility and applicable country terms *before* adding any tracking IDs. Verify required disclosures and whether direct retailer search linking is permitted.

## Revenue gates
**Gate A — eligible monetization:** Verify Amazon Associates US program status, tracking IDs, eligible link format, disclosures, and attribution through the actual account. An untagged retailer search link does not produce affiliate commission. No earnings are guaranteed.
**Gate B — product value:** The finder must provide better-than-generic guidance, ideally independently sourced product data or comparison; current manually entered candidates are a usability pilot, not a production recommendation engine.
**Gate C — funnel measurement:** After obtaining appropriate consent, measure finder starts, completed comparisons, guide clicks, outbound retailer clicks, and actual attributed orders; never equate outbound clicks with sales.
**Gate D — economics:** Track acquisition cost, conversion to purchase, net commission, provider/API cost and content maintenance. Expand countries only after at least one market demonstrates reliable demand and attribution.
**Gate E — compliance:** Privacy, affiliate disclosures, country-specific legal obligations, accessibility, product claims and API data licenses reviewed.

## Launch decision
Do not merge or publish as a monetization-ready global product until the above checks pass. Keep the existing site operating. If testing is blocked, document the blocked checks rather than marking them passed.
