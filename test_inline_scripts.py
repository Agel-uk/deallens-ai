#!/usr/bin/env python3
"""Check inline JavaScript blocks in all root HTML files with Node.js."""
from html.parser import HTMLParser
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent

class InlineScripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.active = False
        self.blocks = []
    def handle_starttag(self, tag, attrs):
        if tag != "script":
            return
        attributes = dict(attrs)
        self.active = not attributes.get("src") and attributes.get("type", "text/javascript") in ("text/javascript", "module", "")
    def handle_endtag(self, tag):
        if tag == "script":
            self.active = False
    def handle_data(self, data):
        if self.active and data.strip():
            self.blocks.append(data)

checked = 0
failures = 0
for path in sorted(ROOT.glob("*.html")):
    parser = InlineScripts()
    parser.feed(path.read_text(encoding="utf-8"))
    for index, source in enumerate(parser.blocks, 1):
        checked += 1
        result = subprocess.run(["node", "--check", "-"], input=source, text=True, capture_output=True)
        if result.returncode:
            failures += 1
            print(f"FAIL {path.name}: inline script {index}\n{result.stderr}")
print(f"Checked {checked} inline JavaScript blocks; {failures} syntax failures")
sys.exit(1 if failures else 0)
