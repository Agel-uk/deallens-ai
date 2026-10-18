
/*
 * DealLens AI — Global Amazon Market Selector
 * Supports 16 marketplaces.
 * Affiliate markets: US, AE, UK, CA.
 * No automatic geographic redirects.
 * No invented affiliate tracking IDs.
 */
(function () {
  'use strict';

  const markets = [
    { code: 'US', name: 'United States', currency: 'USD', host: 'www.amazon.com' },
    { code: 'UK', name: 'United Kingdom', currency: 'GBP', host: 'www.amazon.co.uk' },
    { code: 'DE', name: 'Germany', currency: 'EUR', host: 'www.amazon.de' },
    { code: 'CA', name: 'Canada', currency: 'CAD', host: 'www.amazon.ca' },
    { code: 'FR', name: 'France', currency: 'EUR', host: 'www.amazon.fr' },
    { code: 'AU', name: 'Australia', currency: 'AUD', host: 'www.amazon.com.au' },
    { code: 'JP', name: 'Japan', currency: 'JPY', host: 'www.amazon.co.jp' },
    { code: 'IT', name: 'Italy', currency: 'EUR', host: 'www.amazon.it' },
    { code: 'ES', name: 'Spain', currency: 'EUR', host: 'www.amazon.es' },
    { code: 'AE', name: 'United Arab Emirates', currency: 'AED', host: 'www.amazon.ae' },
    { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', host: 'www.amazon.sa' },
    { code: 'IN', name: 'India', currency: 'INR', host: 'www.amazon.in' },
    { code: 'NL', name: 'Netherlands', currency: 'EUR', host: 'www.amazon.nl' },
    { code: 'SE', name: 'Sweden', currency: 'SEK', host: 'www.amazon.se' },
    { code: 'PL', name: 'Poland', currency: 'PLN', host: 'www.amazon.pl' },
    { code: 'SG', name: 'Singapore', currency: 'SGD', host: 'www.amazon.sg' }
  ];

  const STORAGE_KEY = 'deallens_market';

  // Approved public tracking IDs.
  // The external affiliate-config.js file can override these.
  const DEFAULT_TAGS = Object.freeze({
    US: 'deallensai-20',
    AE: 'deallensai-21',
    UK: 'deallensaiuk-21',
    CA: 'deallensaica-20'
  });

  const marketMap = new Map(
    markets.map(market => [market.code, market])
  );

  let currentCode = 'US';

  function getMarket(code) {
    return marketMap.get(code) || marketMap.get('US');
  }

  function readStoredMarket() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return marketMap.has(stored) ? stored : 'US';
    } catch (error) {
      return 'US';
    }
  }

  function saveMarket(code) {
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch (error) {
      // Selection still works without browser storage.
    }
  }

  function getAffiliateTag(market) {
    const configured = window.DEALLENS_AFFILIATE_TAGS;

    const tags = (
      configured &&
      typeof configured === 'object'
    ) ? configured : DEFAULT_TAGS;

    const tag = tags[market.code];

    if (typeof tag !== 'string') {
      return null;
    }

    const cleanTag = tag.trim();

    // Allow only a simple Amazon Associates tracking ID.
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(cleanTag)) {
      return null;
    }

    return cleanTag;
  }

  function buildOfferUrl(market, query) {
    const url = new URL(
      'https://' + market.host + '/s'
    );

    url.searchParams.set('k', query);

    const affiliateTag = getAffiliateTag(market);

    if (affiliateTag) {
      url.searchParams.set('tag', affiliateTag);
    }

    return url.href;
  }

  function updateOfferLinks(market) {
    const affiliateTag = getAffiliateTag(market);

    document.querySelectorAll(
      'a.offer-link[data-query]'
    ).forEach(link => {
      const query = link.getAttribute('data-query');

      if (!query || !query.trim()) {
        return;
      }

      link.href = buildOfferUrl(market, query);
      link.target = '_blank';

      link.rel = affiliateTag
        ? 'sponsored nofollow noopener noreferrer'
        : 'noopener noreferrer';
    });
  }

  function updateDisclosures(market) {
    const affiliateTag = getAffiliateTag(market);

    document.querySelectorAll(
      '.affiliate-us-disclosure'
    ).forEach(element => {
      element.textContent = affiliateTag
        ? '(paid link) As an Amazon Associate I earn from qualifying purchases.'
        : 'This marketplace link has no affiliate tracking enabled.';
    });
  }

  function updateStatus(market) {
    const affiliateTag = getAffiliateTag(market);

    document.querySelectorAll(
      '.global-market-status'
    ).forEach(element => {
      element.textContent =
        'Marketplace: ' +
        market.name +
        ' (' +
        market.currency +
        ') · ' +
        (
          affiliateTag
            ? 'Affiliate link enabled'
            : 'No affiliate tracking enabled'
        );
    });
  }

  function updateSelectors(market) {
    document.querySelectorAll(
      '.global-market-choice'
    ).forEach(select => {
      if (select.value !== market.code) {
        select.value = market.code;
      }
    });
  }

  function update() {
    const market = getMarket(currentCode);

    updateSelectors(market);
    updateStatus(market);
    updateOfferLinks(market);
    updateDisclosures(market);
  }

  function setMarket(code) {
    const market = getMarket(code);

    currentCode = market.code;

    saveMarket(currentCode);

    update();
  }

  function createMarketPanel() {
    const section = document.createElement('section');
    section.className = 'panel global-market-panel';

    const heading = document.createElement('h2');
    heading.textContent = 'Choose your shopping market';

    const label = document.createElement('label');
    label.textContent = 'Country / marketplace: ';

    const select = document.createElement('select');
    select.className = 'global-market-choice';

    select.setAttribute(
      'aria-label',
      'Choose shopping country'
    );

    markets.forEach(market => {
      const option = document.createElement('option');

      option.value = market.code;
      option.textContent =
        market.name + ' — ' + market.currency;

      select.appendChild(option);
    });

    label.appendChild(select);

    const status = document.createElement('p');
    status.className = 'global-market-status';
    status.setAttribute('aria-live', 'polite');

    const note = document.createElement('p');
    note.className = 'small';

    note.textContent =
      'Retailer prices, availability, shipping and returns may vary by country. ' +
      'DealLens uses Amazon Associates tracking links for the US, UAE, UK and Canada. ' +
      'Other marketplace links are not affiliate-tracked.';

    section.append(
      heading,
      label,
      status,
      note
    );

    select.addEventListener('change', function () {
      setMarket(this.value);
    });

    return section;
  }

  function init() {
    const offers = document.querySelectorAll(
      'a.offer-link[data-query]'
    );

    if (!offers.length) {
      return;
    }

    currentCode = readStoredMarket();

    // Prevent duplicate market selector panels.
    document.querySelectorAll(
      '.global-market-panel'
    ).forEach(panel => panel.remove());

    const panel = createMarketPanel();

    const firstOffer = offers[0];

    const anchor =
      firstOffer.closest('aside') ||
      firstOffer.parentElement;

    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(panel, anchor);
    }

    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
