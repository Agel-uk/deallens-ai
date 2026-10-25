# US Amazon Associates verification and monetization launch gate

**Status: account approval not verified. Do not assume that an Associate tracking ID is active.**

1. Sign in at https://affiliate-program.amazon.com/home and verify this is the Amazon.com (US) program.
2. Review Account Settings and any application review notices. A functioning dashboard or ID is not evidence of final approval.
3. Review Reports for clicks, ordered items, qualifying shipped purchases, commission and tracking-ID attribution.
4. Review registered websites, payment details and tax interview. Do not put private account credentials, tax identifiers or payout information in the repository.
5. Use SiteStripe or Associates Central to generate a valid US link; verify its tracking ID and the permitted link format. The previously configured identifier is `deallensai-20`, **not independently verified as eligible**.
6. Check original editorial content, recent updates, disclosure, and Amazon program rules. Three qualifying sales in the initial 180 days are required for application review; self-purchases do not qualify.
7. Only after confirmation, replace preview untagged search destinations with properly generated and permitted affiliate links. Do not append tracking tags blindly to every market or promise revenue.
8. Track actual outbound clicks and Amazon-reported qualifying purchases separately. Avoid tracking personal data without required notices/consent.
9. Before any production launch, complete the browser/device test matrix in GLOBAL_FINDER_RELEASE_CHECKLIST.md and review the resulting PR. Production main must remain unchanged until approved.

References:
- https://affiliate-program.amazon.com/help/node/topic/G8TW5AE9XL2VX9VM
- https://affiliate-program.amazon.com/help/node/topic/G6253GFSARDQENZR
- https://affiliate-program.amazon.com/help/node/topic/GJMMT7G4C8K4Y3AY
- https://affiliate-program.amazon.com/help/node/topic/GMVSBL86R9337EB6

**Business priority:** US audience first; conversion to qualifying purchases matters more than raw page views. Other markets are secondary until US attribution is verified.
