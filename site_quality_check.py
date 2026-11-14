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
        self.headings = []
        self.canonicals = []
        self.in_title = False
        self.title = ""
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])
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
    if len(parser.headings) != 1:
        warnings.append(f"{path.name}: expected one h1, found {len(parser.headings)}")
    if len(parser.canonicals) != 1:
        warnings.append(f"{path.name}: expected one canonical URL, found {len(parser.canonicals)}")
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
        if not (ROOT / target).is_file():
            errors.append(f"{path.name}: missing local target {url}")
        elif parts.fragment and target.endswith(".html") and parts.fragment not in pages.get(target, Page()).ids:
            # Fragment validation happens in a second pass below.
            pass

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
            warnings.append(f"{name}: missing anchor {url}")

sitemap = ROOT / "sitemap.xml"
if sitemap.is_file():
    try:
        tree = ET.parse(sitemap)
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = [el.text for el in tree.findall(".//sm:loc", ns) if el.text]
        if len(urls) != len(set(urls)):
            errors.append("sitemap.xml: duplicate URLs")
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

print(f"Checked {len(pages)} HTML pages, {len(errors)} errors, {len(warnings)} warnings.")
for issue in warnings:
    print("WARNING:", issue)
for issue in errors:
    print("ERROR:", issue)
sys.exit(1 if errors else 0)
