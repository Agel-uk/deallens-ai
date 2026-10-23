# DealLens US Finder — QA record (2026-10-22)

Status: **SOURCE REVIEW COMPLETED; BROWSER QA PENDING**. Branch: `feature/global-product-finder-v1`. Do not merge to `main` on the basis of this document.

## Source-level checks
- [x] US is the default shopping market, with USD budget labeling.
- [x] Seven categories have criterion lists and editorial priority orders.
- [x] Nine shopping markets use untagged Amazon search URL prefixes.
- [x] Budget validation rejects nonpositive and nonfinite numbers; form input also has minimum 1.
- [x] Candidate price is required if a candidate is entered; candidates above budget remain visible but sort after within-budget items.
- [x] Product names are rendered with `textContent` (not HTML injection).
- [x] Retailer links use `noopener noreferrer sponsored` and open a new tab.
- [x] Preview page has `noindex,nofollow` and explicit non-live-pricing/affiliate disclosure.
- [x] Corrected inaccurate copy implying over-budget candidates are hidden.

## Browser test matrix — NOT YET RUN
- [ ] Chrome desktop: US / laptops / work / USD 1000; confirm results and order.
- [ ] Safari iPhone: headphones / travel / USD 200; check layout, keyboard and focus.
- [ ] Chrome Android: vacuums / home / USD 400; check horizontal overflow.
- [ ] Change market to UAE: currency label updates to AED; change back to US.
- [ ] Empty/zero/negative/excessively large budget: reject without showing stale results.
- [ ] Candidate A within budget, B above budget: A first, B still visible.
- [ ] Candidate with name but missing price: clear validation message.
- [ ] Candidate name with HTML-like text: rendered as literal text.
- [ ] All seven buying-guide destinations resolve on deployed preview.
- [ ] All nine Amazon search destinations resolve; no tracking tag appears.
- [ ] Keyboard-only tab and submit, screen-reader labels and mobile accessibility.
- [ ] Check console for JS errors and network for unexpected third-party calls.

## Launch gates
1. Confirm preview URL and conduct actual browser/device QA.
2. Verify every guide file exists at the deployed relative path.
3. Confirm US Amazon Associates approval and permitted disclosures before adding commission tags.
4. Verify AdSense review independently; don't change production monetization setup during review without need.
5. Review privacy/analytics consent requirements before adding event tracking.

No real-browser test or production deployment is claimed here.
