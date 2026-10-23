# Amazon affiliate routing consolidation — 2026-10-23

## Change summary
- `affiliate-config.js` is the central source for known tracking IDs and explicitly active markets.
- `index.html` now loads `affiliate-config.js` before its search handler and reads `window.DEALLENS_ACTIVE_AFFILIATE_TAGS`.
- `app.js` uses the same active map for guide offers, so UK/CA tags in the known-ID map are not automatically activated.
- Active markets remain US (`deallensai-20`) and AE (`deallensai-21`), matching the homepage's prior behavior. Activation does **not** establish program approval.
- The global product finder preview remains untagged.

## Static source assertions: 10/10 passed
1. Active map is defined.
2. US tag is configured.
3. AE tag is configured.
4. Only US and AE are marked active.
5. Homepage loads config before inline use.
6. Homepage reads active map.
7. Buying-guide app reads active map.
8. Guide index loads config before app.
9. Homepage no longer hardcodes an independent tag map.
10. Buying-guide app no longer reads every known ID as active.

## Still required before merge
- Real browser tests for US/AE/UK/CA generated search links and correct `tag` parameters.
- Confirm all pages using `app.js` load `affiliate-config.js` first; check other entrypoints before release.
- Verify Amazon Associates program acceptance, eligible websites and current disclosure policy.
- Test mobile navigation and keyboard use.
- Keep AdSense production review uninterrupted.

**Release decision:** NOT READY TO MERGE. Static assertions are not browser QA.
