# DealLens AI — AdSense pre-review (10 October 2026)

This is a source-file review, not an AdSense policy approval or live-site test.
Google's October 8 message confirms non-approval but does not specify the exact policy violation.

## Confirmed from supplied ZIP
- 16 buying-guide HTML files; homepage advertised 12. Corrected homepage count to 16.
- ads.txt includes publisher pub-7972247725431909; verify that the deployed root URL serves this exact file.
- Privacy, contact, terms, editorial policy and FAQ pages are present.
- No broken relative HTML links were found by the static href scan; this does not test external URLs or JS navigation.
- Terms lacked description/canonical; markets lacked canonical. Added these tags.
- Some category pages are very short (under ~120 visible words), and several guides are ~400–800 words. Word count is not an AdSense approval criterion; assess original value and usefulness, not length alone.
- Contact page routes technical issues to GitHub and does not provide a direct email contact. Consider adding a monitored contact method if available.
- Dashboard/earnings pages have minimal visible content and missing SEO metadata. Consider whether these pages are intended to be public or indexed; avoid implying earnings or merchant services are active.

## Before reapplying
1. Review every guide for independent, useful advice and claims supported by actual research; do not invent hands-on testing.
2. Verify deployed pages, mobile layout, links, HTTP statuses, robots.txt, sitemap.xml and ads.txt.
3. Review account-specific AdSense policy center details for the actual rejection reason.
4. Resubmit only after fixes are deployed and verified.

## Changes made
- index.html: corrected displayed guide count.
- terms.html: added canonical and meta description.
- markets.html: added canonical.
No affiliate tracking IDs, AdSense IDs, ads.txt values, or commercial claims were altered.
