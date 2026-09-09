# DealLens AI — Global Affiliate Integration V4

## Goal
Use approved affiliate networks globally while keeping credentials and payout details out of GitHub Pages.

## Providers
- Amazon Associates: retailer-specific programs and tracking IDs.
- impact.com: global brand/affiliate marketplace and reporting.
- Awin: global advertiser network with payment methods based on bank location/currency.

## Secure architecture
Browser (GitHub Pages) → DealLens backend → provider APIs/tracking links → provider reporting → earnings ledger.

Never put affiliate secrets, API keys, bank IBANs, passwords, or payment credentials in public JavaScript.

## UAE bank payout
The bank details are entered by the account owner inside the provider's secure payment settings. DealLens should store only non-sensitive payout status/reference data needed for reporting.

## Current state
The public site is still intentionally demo-safe: prices and earnings are not represented as live data until provider accounts are approved and connected.
