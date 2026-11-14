#!/usr/bin/env python3
"""Static, offline quality checks for the published GitHub Pages site."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
DOMAIN = "agel-uk.github.io"
errors = []
warnings = []

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.ids = set()
        self.duplicate_ids = set()
        self.descriptions = []
        self.images_missing_alt = 0
        self.main_count = 0
        self.headings = []
        self.canonicals = []
        self.in_title = False
        self.title = ""
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            if a["id"] in self.ids:
                self.duplicate_ids.add(a["id"])
            self.ids.add(a["id"])
        if tag == "main":
            self.main_count += 1
        if tag == "img" and not a.get("alt") and "alt" not in a:
            self.images_missing_alt += 1
        if tag == "meta" and a.get("name", "").lower() == "description":
            self.descriptions.append(a.get("content", ""))
        if tag in ("a", "link", "script", "img"):
            key = "href" if tag in ("a", "link") else "src"
            if a.get(key):
                self.links.append((tag, a[key]))
        if tag == "link" and a.get("rel") == "canonical":
            self.canonicals.append(a.get("href", ""))
        if tag == "h1":
            self.headings.append("h1")
        if tag == "title":
            self.in_title = True
    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
    def handle_data(self, data):
        if self.in_title:
            self.title += data

pages = {}
for path in sorted(ROOT.glob("*.html")):
    parser = Page()
    try:
        parser.feed(path.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"{path.name}: HTML parser error: {exc}")
        continue
    pages[path.name] = parser
    if not parser.title.strip():
        warnings.append(f"{path.name}: missing title")
    if len(parser.descriptions) != 1 or not parser.descriptions[0].strip():
        warnings.append(f"{path.name}: missing or duplicate meta description")
    if parser.duplicate_ids:
        errors.append(f"{path.name}: duplicate HTML ids: {sorted(parser.duplicate_ids)}")
    if parser.images_missing_alt:
        warnings.append(f"{path.name}: {parser.images_missing_alt} images missing alt text")
    if parser.main_count != 1:
        warnings.append(f"{path.name}: expected one main landmark, found {parser.main_count}")
    if len(parser.headings) != 1:
        warnings.append(f"{path.name}: expected one h1, found {len(parser.headings)}")
    if len(parser.canonicals) != 1:
        warnings.append(f"{path.name}: expected one canonical URL, found {len(parser.canonicals)}")
    elif parser.canonicals[0]:
        canonical = urlsplit(parser.canonicals[0])
        expected_path = "/" if path.name == "index.html" else "/" + path.name
        if canonical.scheme != "https" or canonical.netloc.lower() != DOMAIN or canonical.path != expected_path or canonical.query or canonical.fragment:
            warnings.append(f"{path.name}: canonical URL differs from expected https://{DOMAIN}{expected_path}")
    for tag, url in parser.links:
        parts = urlsplit(url)
        if parts.scheme in ("mailto", "tel", "javascript", "data") or url.startswith("//"):
            continue
        if parts.scheme and parts.scheme not in ("http", "https"):
            continue
        if parts.netloc and parts.netloc.lower() != DOMAIN:
            continue
        if parts.netloc:
            target = unquote(parts.path.lstrip("/")) or "index.html"
        else:
            target = unquote(parts.path) or path.name
        if target.endswith("/") or target == "":
            target += "index.html"
        if ".." in Path(target).parts:
            errors.append(f"{path.name}: unsafe local path {url}")
            continue
        if not (ROOT / target).is_file():
            errors.append(f"{path.name}: missing local target {url}")

for name, parser in pages.items():
    for tag, url in parser.links:
        parts = urlsplit(url)
        if not parts.fragment or parts.scheme not in ("", "https", "http"):
            continue
        if parts.netloc and parts.netloc.lower() != DOMAIN:
            continue
        target = unquote(parts.path.lstrip("/")) if parts.netloc else unquote(parts.path)
        target = target or name
        if target == "/" or target.endswith("/"):
            target = "index.html"
        if target in pages and parts.fragment not in pages[target].ids:
            errors.append(f"{name}: broken internal anchor {url}")

sitemap = ROOT / "sitemap.xml"
if sitemap.is_file():
    try:
        tree = ET.parse(sitemap)
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = [el.text for el in tree.findall(".//sm:loc", ns) if el.text]
        if len(urls) != len(set(urls)):
            errors.append("sitemap.xml: duplicate URLs")
        if not urls:
            errors.append("sitemap.xml: no page URLs")
        sitemap_paths = set()
        for url in urls:
            parsed = urlsplit(url)
            sitemap_paths.add(unquote(parsed.path.lstrip("/")) or "index.html")
        for guide in sorted(ROOT.glob("guide-*.html")):
            if guide.name not in sitemap_paths:
                errors.append(f"sitemap.xml: missing buying guide {guide.name}")
        for required in ("index.html", "amazon.html", "decision-lab.html", "us-shopping-checklist.html"):
            if (ROOT / required).is_file() and required not in sitemap_paths:
                errors.append(f"sitemap.xml: missing important page {required}")
        for url in urls:
            parsed = urlsplit(url)
            page_name = unquote(parsed.path.lstrip("/")) or "index.html"
            if page_name in pages:
                declared = pages[page_name].canonicals
                if len(declared) == 1 and declared[0] != url:
                    errors.append(f"sitemap.xml: {page_name} canonical {declared[0]} differs from sitemap URL {url}")
            if parsed.scheme != "https" or parsed.query or parsed.fragment:
                errors.append(f"sitemap.xml: noncanonical URL form {url}")
        for url in urls:
            p = urlsplit(url)
            if p.netloc.lower() != DOMAIN:
                errors.append(f"sitemap.xml: unexpected domain {url}")
            target = unquote(p.path.lstrip("/")) or "index.html"
            if not (ROOT / target).is_file():
                errors.append(f"sitemap.xml: missing page {url}")
    except ET.ParseError as exc:
        errors.append(f"sitemap.xml: invalid XML: {exc}")
else:
    errors.append("sitemap.xml: missing")

robots = ROOT / "robots.txt"
if not robots.is_file():
    warnings.append("robots.txt: missing")
elif "https://agel-uk.github.io/sitemap.xml" not in robots.read_text(encoding="utf-8"):
    warnings.append("robots.txt: missing expected sitemap URL")

# Check that guide-card comparison links use supported, specialized criteria.
import re
lab_js = ROOT / "decision-lab.js"
lab_html = ROOT / "decision-lab.html"
library = ROOT / "amazon.html"
if all(p.is_file() for p in (lab_js, lab_html, library)):
    js = lab_js.read_text(encoding="utf-8")
    html = lab_html.read_text(encoding="utf-8")
    cards = library.read_text(encoding="utf-8")
    categories = set(re.findall(r'<option value="([a-z]+)">', html))
    defined = set(re.findall(r"([a-z]+):\[", js.split("const criteria=", 1)[1].split(";const $=", 1)[0])) if "const criteria=" in js else set()
    expected = {
        "guide-wireless-headphones.html": "headphones",
        "guide-power-banks.html": "powerbanks",
        "guide-robot-vacuums.html": "vacuums",
        "guide-running-shoes.html": "shoes",
        "guide-smart-watches.html": "watches",
        "guide-air-fryers.html": "airfryers",
        "guide-laptops.html": "laptops",
        "guide-office-chairs.html": "chairs",
        "guide-coffee-makers.html": "coffeemakers",
        "guide-coffee-machines.html": "espresso",
        "guide-monitors.html": "monitors",
        "guide-carry-on-luggage.html": "luggage",
        "guide-cordless-drills.html": "drills",
        "guide-mesh-wifi.html": "mesh",
        "guide-portable-ssds.html": "ssds",
        "guide-tablets.html": "tablets",
    }
    guide_cards = re.findall(r'<article\b[^>]*class="card"[^>]*data-category="[^"]+"[^>]*>[\s\S]*?</article>', cards)
    found_guides = {}
    for card in guide_cards:
        guide_links = re.findall(r'href="(guide-[^"?#]+\.html)"', card)
        compare_links = re.findall(r'href="decision-lab\.html\?category=([a-z]+)"', card)
        for guide in guide_links:
            if guide in found_guides:
                errors.append(f"amazon.html: duplicate guide card {guide}")
            found_guides[guide] = compare_links
    for guide, category in expected.items():
        if category not in categories:
            errors.append(f"decision-lab.html: missing category {category}")
        if category not in defined:
            errors.append(f"decision-lab.js: missing criteria {category}")
        if guide not in found_guides:
            errors.append(f"amazon.html: missing guide card {guide}")
        elif found_guides[guide] != [category]:
            errors.append(f"amazon.html: {guide} must link to category {category}; found {found_guides[guide]}")
    for guide in set(found_guides) - set(expected):
        warnings.append(f"amazon.html: untracked guide card {guide}")
    if len(found_guides) != len(expected):
        errors.append(f"amazon.html: expected {len(expected)} unique guide cards, found {len(found_guides)}")

    homepage = ROOT / "index.html"
    if homepage.is_file():
        homepage_html = homepage.read_text(encoding="utf-8")
        home_cards = re.findall(r'<article\b[^>]*class="guide-card"[^>]*>[\s\S]*?</article>', homepage_html)
        home_found = {}
        for card in home_cards:
            guide_links = re.findall(r'href="(guide-[^"?#]+\.html)"', card)
            comparison_links = re.findall(r'href="decision-lab\.html\?category=([a-z]+)"', card)
            unique_guides = set(guide_links)
            if len(unique_guides) != 1:
                errors.append(f"index.html: guide card should reference one guide; found {sorted(unique_guides)}")
                continue
            guide = next(iter(unique_guides))
            if guide in home_found:
                errors.append(f"index.html: duplicate guide card {guide}")
            home_found[guide] = comparison_links
        for guide, category in expected.items():
            if home_found.get(guide) != [category]:
                errors.append(f"index.html: {guide} missing or incorrect comparison shortcut (expected {category})")
        if len(home_cards) != len(expected):
            errors.append(f"index.html: expected {len(expected)} guide cards, found {len(home_cards)}")

else:
    warnings.append("Decision Lab integration check skipped: files missing")

# Guard the interactive shopping tool and its discoverability.
calculator = ROOT / "total-cost-calculator.html"
if not calculator.is_file():
    errors.append("total-cost-calculator.html: original shopping calculator missing")
else:
    calculator_html = calculator.read_text(encoding="utf-8")
    for field in ("price", "tax", "shipping", "extras", "monthly", "years", "total"):
        if f'id="{field}"' not in calculator_html:
            errors.append(f"total-cost-calculator.html: missing interactive field {field}")
    if 'aria-live="polite"' not in calculator_html:
        warnings.append("total-cost-calculator.html: missing accessible live result")
    if 'total-cost-calculator.html' not in (ROOT / "index.html").read_text(encoding="utf-8"):
        errors.append("index.html: total cost calculator is not linked")
    if 'total-cost-calculator.html' not in (ROOT / "sitemap.xml").read_text(encoding="utf-8"):
        errors.append("sitemap.xml: total cost calculator is not indexed")

# The homepage search and category filters must be present and wired.
homepage_html = (ROOT / "index.html").read_text(encoding="utf-8")
for marker in ('id="hero-guide-search"', 'id="guide-search"', 'id="guide-category"', 'data-filter-category="all"', "function searchFor(query)"):
    if marker not in homepage_html:
        errors.append(f"index.html: missing interactive search feature {marker}")

print(f"Checked {len(pages)} HTML pages, {len(errors)} errors, {len(warnings)} warnings.")
for issue in warnings:
    print("WARNING:", issue)
for issue in errors:
    print("ERROR:", issue)
sys.exit(1 if errors else 0)
