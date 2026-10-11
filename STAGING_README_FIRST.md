# DealLens AI Global 2.0 — staging preview only

This ZIP is a **separate staging copy** of the supplied AdSense-remediated project, with a new working `decision-lab.html` feature. It has **not** been uploaded or published.

## How to test
1. Unzip locally and open `decision-lab.html` in a browser.
2. Enter two or three product names, set priorities, ratings, prices and evidence notes.
3. Click Compare products; inspect weighted score, evidence coverage, budget warning, and print view.
4. Test on a phone. The tool runs locally with no API key, server, or data transmission.

## Deployment safety
- **Do not upload this ZIP wholesale to the live GitHub Pages root during AdSense review.**
- Staging HTML pages have `noindex,nofollow` to discourage indexing if accidentally hosted. Remove these directives only from intended public pages at final launch.
- Existing AdSense script, `ads.txt`, affiliate settings, and editorial pages are retained as supplied, not validated against your live account.
- No real-time pricing or AI backend is claimed.
- A staged review and full regression test are needed before any production release.

## Score formula
Score = 100 × sum(priority × user rating) / (5 × sum(priority of rated criteria)); evidence coverage = 100 × rated priority weight / total priority weight. Zero-weight priorities do not contribute. The score reflects the visitor's own inputs, not verified DealLens product testing.
