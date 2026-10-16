
"use strict";

// DealLens AI — marketplace search and buying guides.
// Affiliate IDs are configured in affiliate-config.js.
// Only configured and authorized markets receive affiliate tags.

const MARKETS = [
  ["AE", "United Arab Emirates", "AED", "amazon.ae"],
  ["SA", "Saudi Arabia", "SAR", "amazon.sa"],
  ["US", "United States", "USD", "amazon.com"],
  ["CA", "Canada", "CAD", "amazon.ca"],
  ["MX", "Mexico", "MXN", "amazon.com.mx"],
  ["BR", "Brazil", "BRL", "amazon.com.br"],
  ["UK", "United Kingdom", "GBP", "amazon.co.uk"],
  ["DE", "Germany", "EUR", "amazon.de"],
  ["FR", "France", "EUR", "amazon.fr"],
  ["IT", "Italy", "EUR", "amazon.it"],
  ["ES", "Spain", "EUR", "amazon.es"],
  ["NL", "Netherlands", "EUR", "amazon.nl"],
  ["SE", "Sweden", "SEK", "amazon.se"],
  ["PL", "Poland", "PLN", "amazon.pl"],
  ["IN", "India", "INR", "amazon.in"],
  ["JP", "Japan", "JPY", "amazon.co.jp"],
  ["SG", "Singapore", "SGD", "amazon.sg"],
  ["AU", "Australia", "AUD", "amazon.com.au"]
];

const TAGS = window.DEALLENS_AFFILIATE_TAGS || {};

const guides = [
  ["Air Fryers", "air fryer", "guide-air-fryers.html"],
  ["Carry-On Luggage", "carry on luggage", "guide-carry-on-luggage.html"],
  ["Coffee Machines", "espresso machine", "guide-coffee-machines.html"],
  ["Coffee Makers", "coffee maker", "guide-coffee-makers.html"],
  ["Cordless Drills", "cordless drill", "guide-cordless-drills.html"],
  ["Laptops", "laptop computer", "guide-laptops.html"],
  ["Mesh Wi-Fi", "mesh wifi router", "guide-mesh-wifi.html"],
  ["Monitors", "computer monitor", "guide-monitors.html"],
  ["Office Chairs", "office chair", "guide-office-chairs.html"],
  ["Portable SSDs", "portable ssd", "guide-portable-ssds.html"],
  ["Power Banks", "power bank usb c", "guide-power-banks.html"],
  ["Robot Vacuums", "robot vacuum cleaner", "guide-robot-vacuums.html"],
  ["Running Shoes", "running shoes", "guide-running-shoes.html"],
  ["Smart Watches", "smart watch", "guide-smart-watches.html"],
  ["Tablets", "tablet computer", "guide-tablets.html"],
  ["Wireless Headphones", "wireless headphones", "guide-wireless-headphones.html"]
].map(([name, query, guide]) => ({ name, query, guide }));

const $ = id => document.getElementById(id);

const marketSelect = $("market");
const currency = $("currency");
const q = $("q");
const results = $("results");

function marketByCode(code) {
  return MARKETS.find(m => m[0] === code)
    || MARKETS.find(m => m[0] === "US");
}

function preferredMarket() {
  try {
    const saved = localStorage.getItem("deallens_market");

    if (saved && MARKETS.some(m => m[0] === saved)) {
      return saved;
    }
  } catch (_) {}

  return "US";
}

function marketOptions() {
  return MARKETS.map(
    m => `<option value="${m[0]}">${m[1]} — ${m[2]}</option>`
  ).join("");
}

if (marketSelect) {
  marketSelect.innerHTML = marketOptions();
  marketSelect.value = preferredMarket();
}

// Respect the previously selected market on guide pages.
function selectedMarket() {
  return marketByCode(marketSelect?.value || preferredMarket());
}

function hasAffiliateTag() {
  const code = selectedMarket()[0];

  return typeof TAGS[code] === "string"
    && TAGS[code].trim().length > 0;
}

function syncCurrency() {
  const market = selectedMarket();

  if (currency) {
    currency.value = market[2];
  }

  if (marketSelect) {
    try {
      localStorage.setItem("deallens_market", market[0]);
    } catch (_) {}
  }

  const state = $("affiliateState");

  if (state) {
    state.textContent = hasAffiliateTag()
      ? "Paid affiliate links may earn DealLens a commission from qualifying purchases."
      : "Standard retailer links — no DealLens affiliate tracking for this market.";
  }
}

function amazonSearchUrl(query) {
  const market = selectedMarket();

  const url = new URL(`https://www.${market[3]}/s`);

  url.searchParams.set("k", String(query || "").trim());

  const tag = TAGS[market[0]];

  if (typeof tag === "string" && tag.trim()) {
    url.searchParams.set("tag", tag.trim());
  }

  return url.toString();
}

function trackOutbound(query) {
  // Browser-local activity only, not central analytics.
  try {
    const key = "deallens_outbound_clicks";
    const stored = JSON.parse(localStorage.getItem(key) || "[]");

    if (!Array.isArray(stored)) return;

    stored.push({
      query: String(query || ""),
      market: selectedMarket()[0],
      affiliate: hasAffiliateTag(),
      at: new Date().toISOString()
    });

    localStorage.setItem(
      key,
      JSON.stringify(stored.slice(-500))
    );
  } catch (_) {}
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    ch => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch])
  );
}

function affiliateRel() {
  return hasAffiliateTag()
    ? "sponsored nofollow noopener"
    : "nofollow noopener";
}

function offerButton(query) {
  const url = escapeHtml(amazonSearchUrl(query));
  const safeQuery = escapeHtml(query);

  return `
    <a
      class="btn primary"
      rel="${affiliateRel()}"
      target="_blank"
      href="${url}"
      data-query="${safeQuery}"
    >View current offers</a>
  `;
}

function wireOutboundLinks(container) {
  if (!container) return;

  container.querySelectorAll("a[data-query]").forEach(link => {
    if (link.dataset.deallensTracked === "yes") return;

    link.addEventListener("click", () => {
      trackOutbound(link.dataset.query);
    });

    link.dataset.deallensTracked = "yes";
  });
}

function render(items, customQuery = "") {
  if (!results) return;

  const cards = items.map(item => `
    <article class="card">
      <div class="score">DEALLENS BUYING GUIDE</div>

      <h3>${escapeHtml(item.name)}</h3>

      <p>
        Review the buying criteria, then compare
        current products, sellers, delivery and
        prices on the selected marketplace.
      </p>

      <div class="card-actions">
        <a class="btn" href="${escapeHtml(item.guide)}">
          Read guide
        </a>

        ${offerButton(item.query)}
      </div>

      <small>
        ${
          hasAffiliateTag()
            ? "Paid affiliate link. DealLens may earn from qualifying purchases."
            : "No DealLens affiliate tag is active for this market yet."
        }
      </small>
    </article>
  `);

  if (customQuery) {
    cards.unshift(`
      <article class="card">
        <div class="score">MARKETPLACE SEARCH</div>

        <h3>Search: ${escapeHtml(customQuery)}</h3>

        <p>
          Open current retailer results for your exact
          search. DealLens does not display live prices
          or verify individual listings.
        </p>

        <div class="card-actions">
          ${offerButton(customQuery)}
        </div>

        <small>
          ${
            hasAffiliateTag()
              ? "Paid affiliate link. DealLens may earn from qualifying purchases."
              : "Standard retailer link; no DealLens affiliate tag for this market."
          }
        </small>
      </article>
    `);
  }

  results.innerHTML = cards.join("");

  wireOutboundLinks(results);
}

function search() {
  const term = (q?.value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 180);

  if (!term) {
    render(guides);
    return;
  }

  const normalized = term.toLowerCase();

  const matches = guides.filter(item =>
    item.name.toLowerCase().includes(normalized)
    || item.query.toLowerCase().includes(normalized)
  );

  render(matches, term);
}

function refreshGuideOfferLinks() {
  document.querySelectorAll(".offer-link[data-query]")
    .forEach(link => {
      const query = link.dataset.query;

      if (!query) return;

      link.href = amazonSearchUrl(query);
      link.target = "_blank";
      link.rel = affiliateRel();

      if (link.dataset.deallensTracked !== "yes") {
        link.addEventListener("click", () => {
          trackOutbound(link.dataset.query);
        });

        link.dataset.deallensTracked = "yes";
      }
    });
}

$("searchBtn")?.addEventListener("click", search);

q?.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    search();
  }
});

marketSelect?.addEventListener("change", () => {
  syncCurrency();
  search();
  refreshGuideOfferLinks();
});

currency?.addEventListener("change", search);

syncCurrency();
search();

// Product image preview.
const photo = $("photo");
const preview = $("preview");

photo?.addEventListener("change", () => {
  const file = photo.files?.[0];

  if (!file || !preview) return;

  if (preview.dataset.objectUrl) {
    URL.revokeObjectURL(preview.dataset.objectUrl);
  }

  const objectUrl = URL.createObjectURL(file);

  preview.src = objectUrl;
  preview.dataset.objectUrl = objectUrl;
  preview.hidden = false;
});

// Basic listing description generator.
$("listingBtn")?.addEventListener("click", () => {
  const nameField = $("sellName");
  const conditionField = $("condition");
  const listing = $("listing");

  if (!listing) return;

  const name = nameField?.value.trim() || "Product";
  const condition = conditionField?.value || "Not specified";

  listing.textContent =
    `${name}\n` +
    `Condition: ${condition}\n\n` +
    `Suggested title: ${name} — ${condition}\n` +
    `Description: ${name} offered in ${condition.toLowerCase()} condition. ` +
    `Confirm specifications, defects, delivery and warranty before publishing.\n\n` +
    `AI image recognition is not enabled until an approved server-side AI provider is connected.`;
});

// Service worker registration.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

// Read optional search query from URL.
const params = new URLSearchParams(location.search);

if (q && params.get("search")) {
  q.value = params.get("search").slice(0, 180);
  search();
}

// Update marketplace links inside buying guides.
refreshGuideOfferLinks();
