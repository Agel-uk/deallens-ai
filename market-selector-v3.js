/* DealLens market selector — fixed 2026-10-14. No geo-redirects or invented tags. */
(function () {
  'use strict';
  const markets = [
    {code:'US', name:'United States', currency:'USD', host:'www.amazon.com'},
    {code:'UK', name:'United Kingdom', currency:'GBP', host:'www.amazon.co.uk'},
    {code:'DE', name:'Germany', currency:'EUR', host:'www.amazon.de'},
    {code:'CA', name:'Canada', currency:'CAD', host:'www.amazon.ca'},
    {code:'FR', name:'France', currency:'EUR', host:'www.amazon.fr'},
    {code:'AU', name:'Australia', currency:'AUD', host:'www.amazon.com.au'},
    {code:'JP', name:'Japan', currency:'JPY', host:'www.amazon.co.jp'},
    {code:'IT', name:'Italy', currency:'EUR', host:'www.amazon.it'},
    {code:'ES', name:'Spain', currency:'EUR', host:'www.amazon.es'},
    {code:'AE', name:'United Arab Emirates', currency:'AED', host:'www.amazon.ae'},
    {code:'SA', name:'Saudi Arabia', currency:'SAR', host:'www.amazon.sa'},
    {code:'IN', name:'India', currency:'INR', host:'www.amazon.in'},
    {code:'NL', name:'Netherlands', currency:'EUR', host:'www.amazon.nl'},
    {code:'SE', name:'Sweden', currency:'SEK', host:'www.amazon.se'},
    {code:'PL', name:'Poland', currency:'PLN', host:'www.amazon.pl'},
    {code:'SG', name:'Singapore', currency:'SGD', host:'www.amazon.sg'}
  ];
  const key = 'deallens_market';
  const getCode = () => {
    try { const code = localStorage.getItem(key); return markets.some(m=>m.code===code) ? code : 'US'; }
    catch (_) { return 'US'; }
  };
  const find = () => markets.find(m=>m.code===getCode()) || markets[0];
  const tagFor = m => m.code === 'US' ? 'deallensai-20' : null;
  const offerUrl = (m, query) => {
    const u = new URL('https://' + m.host + '/s');
    u.searchParams.set('k', query);
    if (tagFor(m)) u.searchParams.set('tag', tagFor(m));
    return u.href;
  };
  function update() {
    const m = find();
    document.querySelectorAll('.global-market-choice').forEach(select => { select.value = m.code; });
    document.querySelectorAll('.global-market-status').forEach(p => {
      p.textContent = 'Marketplace: ' + m.name + ' (' + m.currency + ') · ' + (tagFor(m) ? 'US affiliate link' : 'No affiliate tracking enabled');
    });
    document.querySelectorAll('a.offer-link[data-query]').forEach(a => {
      a.href = offerUrl(m, a.getAttribute('data-query'));
      a.target = '_blank';
      a.rel = tagFor(m) ? 'sponsored nofollow noopener' : 'noopener noreferrer';
    });
    document.querySelectorAll('.affiliate-us-disclosure').forEach(p => {
      p.textContent = tagFor(m)
        ? '(paid link) As an Amazon Associate I earn from qualifying purchases.'
        : 'This marketplace link has no affiliate tracking enabled.';
    });
  }
  function init() {
    const offers = document.querySelectorAll('a.offer-link[data-query]');
    if (!offers.length) return;
    // Remove any stale or duplicated selector panels before installing the working selector.
    document.querySelectorAll('.global-market-panel').forEach(el => el.remove());
    const section = document.createElement('section');
    section.className = 'panel global-market-panel';
    const heading = document.createElement('h2');
    heading.textContent = 'Choose your shopping market';
    const label = document.createElement('label');
    label.textContent = 'Country / marketplace: ';
    const select = document.createElement('select');
    select.className = 'global-market-choice';
    select.setAttribute('aria-label', 'Choose shopping country');
    markets.forEach(m => {
      const option = document.createElement('option');
      option.value = m.code;
      option.textContent = m.name + ' — ' + m.currency;
      select.appendChild(option);
    });
    label.appendChild(select);
    const status = document.createElement('p');
    status.className = 'global-market-status';
    const note = document.createElement('p');
    note.className = 'small';
    note.textContent = 'Retailer prices, availability, shipping and returns may vary by country. US links use the DealLens Amazon Associates tracking ID; other countries are not tracked.';
    section.append(heading, label, status, note);
    const anchor = offers[0].closest('aside') || offers[0].parentElement;
    anchor.parentNode.insertBefore(section, anchor);
    select.addEventListener('change', () => {
      try { localStorage.setItem(key, select.value); } catch (_) {}
      // Still update when browser storage is blocked.
      if (getCode() !== select.value) {
        const m = markets.find(m=>m.code===select.value) || markets[0];
        document.querySelectorAll('.global-market-status').forEach(p => p.textContent='Marketplace: '+m.name+' ('+m.currency+') · '+(tagFor(m)?'US affiliate link':'No affiliate tracking enabled'));
        document.querySelectorAll('a.offer-link[data-query]').forEach(a => { a.href=offerUrl(m,a.getAttribute('data-query')); a.rel=tagFor(m)?'sponsored nofollow noopener':'noopener noreferrer'; });
        document.querySelectorAll('.affiliate-us-disclosure').forEach(p => p.textContent=tagFor(m)?'(paid link) As an Amazon Associate I earn from qualifying purchases.':'This marketplace link has no affiliate tracking enabled.');
      } else update();
    });
    update();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
