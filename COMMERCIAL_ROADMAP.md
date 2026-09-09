# DealLens AI — Commercial Roadmap

This version adds the revenue/payout center UI. It does not fake balances or payment connections.

## Revenue channels
1. Affiliate commissions
2. DealLens Pro subscriptions
3. Merchant sponsored placements
4. Later: premium AI seller tools

## Payout architecture
The public static site must never contain bank passwords, card PINs, or secret API keys. A production backend should receive provider webhooks and maintain the earnings ledger. Payout onboarding should use the provider's hosted/OAuth flow.

## Important hosting note
GitHub Pages is static hosting. Keep it as the public prototype/landing layer while the commercial backend is developed on a suitable backend host. Do not put secrets in this repository.
