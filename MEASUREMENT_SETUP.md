# DealLens AI — Revenue measurement setup

## What is implemented
The main site, US buyer page, tools and all 16 canonical buying guides load `analytics.js`. It **does not send analytics data by default**. Once a real GA4 web-stream Measurement ID is entered in the single `GA4_MEASUREMENT_ID` constant in `analytics.js`, visitors see an optional consent choice. Only visitors who choose **Allow analytics** load the GA4 library through this feature. Declining means no GA4 library is loaded by this feature. Consent is saved locally; visitors can withdraw it via `privacy.html`.

With consent, the code sends:
- Automatic GA4 page views for measured visitors.
- `buyer_path_click`: source page and destination (Decision Lab, ownership cost, US shopping).
- `retailer_outbound_click`: source page, Amazon hostname, whether a tracking tag is present. No search keywords or affiliate tag values.
- `retailer_search_submit`: Amazon search submission and marketplace hostname, without the search query.

**Important:** Counts reflect only consenting visitors. Ad blockers, browser settings and navigations can reduce event delivery. These are interactions, not sales.

## Activation
1. Create a GA4 property and web data stream for the **actual** published `https://agel-uk.github.io/deallens-ai/` site. Obtain its genuine `G-...` Measurement ID. No ID has been invented or activated.
2. Edit `analytics.js`: set `GA4_MEASUREMENT_ID` to the genuine value and publish the file. Do not put secrets or API keys in this public repository.
3. Verify the consent prompt in a clean browser. Choose Decline and confirm the GA4 network script is absent; choose Allow in another clean browser and verify page view and event data in GA4 Realtime/DebugView. The existing advertising script is separate from this feature and must be handled under its own policy/consent requirements.
4. Build GA4 reports by event name, `source_page` and `destination`; register custom dimensions where needed. Evaluate measured outbound-click rate as `retailer_outbound_click / guide views`, comparing equivalent consented sessions or users. Do not treat this ratio as a purchase conversion rate.
5. Use Search Console for organic impressions, clicks and search queries; compare its landing pages with GA4 measured behavior. Search Console and GA4 counts need not match.
6. **Sales and commissions cannot be measured by static-site clicks.** Confirm affiliate program enrollment/approval and use the official Amazon Associates / other merchant reports for ordered items, shipped items, attributed commissions, returns and payments. Do not infer these from link tags.
7. **Ad revenue** requires an approved ad network and its official revenue reports. Existing AdSense code or a pending review is not approval. Reconcile merchant/ad earnings with received payments separately.

## Weekly performance table
| Metric | Source | Status |
|---|---|---|
| Organic impressions and clicks | Search Console | Connect/review official account |
| Consented page views | GA4 | Pending real Measurement ID |
| Guide → comparison clicks | GA4 `buyer_path_click` | Pending ID and consent |
| Amazon outbound clicks | GA4 `retailer_outbound_click` / `retailer_search_submit` | Pending ID and consent |
| Actual purchases | Affiliate dashboards | Not observable from website alone |
| Confirmed affiliate commission | Affiliate dashboards | Not observable from website alone |
| Actual advertising revenue | Approved ad network dashboard | Not observable from website alone |
| Money received | Payment statements | Not observable from website alone |

Avoid publishing screenshots or exports with account identifiers or visitor personal data. Review applicable privacy, cookie-consent and regional legal requirements before production analytics activation.
