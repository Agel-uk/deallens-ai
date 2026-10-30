# US shopper guide quality checklist

Use this checklist when editing any DealLens AI guide.

## Search intent and utility
- The H1 and introduction answer a specific US buyer's decision.
- Add a short use-case comparison table with constraints, not unverified product rankings.
- Explain compatibility, warranties, returns, shipping and recurring costs where applicable.
- Provide a practical checkout checklist.
- Link to relevant existing guides and the decision tool using root-relative or validated site-relative paths.

## Accuracy and trust
- Never imply hands-on testing unless it occurred.
- Never invent prices, availability, seller ratings, affiliate approval or test results.
- Distinguish illustrative scores from observed measurements.
- Clearly disclose qualifying affiliate relationships.

## Technical acceptance
- One canonical URL matching the actual deployed page.
- Unique title, meta description and H1.
- Indexable production page; previews and duplicate drafts excluded from sitemap.
- Structured data must reflect visible content.
- Verify page and internal links return HTTP 200 in production.
- Confirm responsive navigation and keyboard access.

## Measurement
- Confirm GA4 is configured and receiving events before interpreting performance.
- Track guide views, decision-tool usage, and outbound clicks without storing personal data.
- Use Search Console impressions and clicks to prioritize guide revisions.

## Sitemap incident (30 October 2026)
Search Console reports both submitted sitemaps as Couldn't fetch with zero discovered pages. The repository XML appears syntactically valid. Diagnose live HTTP fetch and deployment mapping before modifying sitemap content or repeatedly resubmitting.
