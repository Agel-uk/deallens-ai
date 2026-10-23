/* DealLens AI — public Amazon Associates tracking IDs.
   A configured ID is not proof of approval or eligibility. */
window.DEALLENS_AFFILIATE_TAGS = {
  US: "deallensai-20",
  AE: "deallensai-21",
  UK: "deallensaiuk-21",
  CA: "deallensaica-20"
};
/* Preserve current homepage routing: US and AE are enabled in the existing
   site code. UK/CA IDs remain stored but are NOT activated pending verification. */
window.DEALLENS_ENABLED_AFFILIATE_MARKETS = { US: true, AE: true };
window.DEALLENS_ACTIVE_AFFILIATE_TAGS = Object.fromEntries(
  Object.entries(window.DEALLENS_AFFILIATE_TAGS).filter(
    ([code, tag]) => window.DEALLENS_ENABLED_AFFILIATE_MARKETS[code] === true && typeof tag === "string" && tag.trim()
  )
);
