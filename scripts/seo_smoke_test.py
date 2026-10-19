#!/usr/bin/env python3
"""Static smoke checks for the five Search Console affected pages."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGES = ("guide-power-banks.html", "guide-air-fryers.html", "guide-running-shoes.html", "decision-lab.html", "shopping-hub.html", "amazon.html", "ar.html", "us-shopping.html", "ownership-cost.html")

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.h1 = 0
        self.links = []
        self.ids = set()
        self.canonical = []
        self.robots = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "h1": self.h1 += 1
        if "id" in attrs: self.ids.add(attrs["id"])
        if tag in ("a", "script", "link") and (tag == "a" or attrs.get("rel") == "stylesheet" or tag == "script"):
            url = attrs.get("href") or attrs.get("src")
            if url: self.links.append(url)
        if tag == "link" and attrs.get("rel") == "canonical": self.canonical.append(attrs.get("href", ""))
        if tag == "meta" and attrs.get("name", "").lower() == "robots": self.robots.append(attrs.get("content", ""))

errors = []
for filename in PAGES:
    content = (ROOT / filename).read_text(encoding="utf-8")
    p = PageParser()
    p.feed(content)
    if not re.search(r"<html\b", content, re.I): errors.append(f"{filename}: missing html element")
    if p.h1 != 1: errors.append(f"{filename}: expected one h1, found {p.h1}")
    expected = f"https://agel-uk.github.io/deallens-ai/{filename}"
    if p.canonical != [expected]: errors.append(f"{filename}: canonical incorrect")
    if not any("index" in x and "noindex" not in x for x in p.robots): errors.append(f"{filename}: indexing meta missing")
    for url in p.links:
        if url.startswith(("http:", "https:", "mailto:", "#", "tel:", "data:")): continue
        target = url.split("?", 1)[0].split("#", 1)[0]
        if target and not (ROOT / target).is_file(): errors.append(f"{filename}: missing local reference {url}")

lab = PageParser()
lab.feed((ROOT / "decision-lab.html").read_text(encoding="utf-8"))
js = (ROOT / "decision-lab.js").read_text(encoding="utf-8")
for element_id in set(re.findall(r"\$\('([^']+)'\)", js)):
    if element_id not in lab.ids: errors.append(f"decision-lab.html: missing JS element {element_id}")
if errors:
    print("\n".join(errors))
    sys.exit(1)
print("PASS: nine pages, local links, canonicals and Decision Lab element IDs")
