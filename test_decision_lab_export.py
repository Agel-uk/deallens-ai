#!/usr/bin/env python3
"""Regression guard for the local Decision Lab CSV export."""
from pathlib import Path
import sys

js = Path(__file__).with_name("decision-lab.js").read_text(encoding="utf-8")
html = Path(__file__).with_name("decision-lab.html").read_text(encoding="utf-8")
checks = {
    "export button exists": 'id="export"' in html,
    "export click handler exists": "$('export').addEventListener('click',exportCsv)" in js,
    "CSV row delimiter is CRLF": r"join('\r\n')" in js,
    "UTF-8 BOM is present": r"'\uFEFF'" in js,
    "formula injection check": r"/^[\s]*[=+@-]/" in js,
    "CSV double quotes escaped": """replace(/"/g,'""')""" in js,
    "spreadsheet MIME type": "text/csv;charset=utf-8" in js,
    "download name": "deallens-comparison.csv" in js,
}
for name, ok in checks.items():
    print(("PASS" if ok else "FAIL") + ": " + name)
sys.exit(0 if all(checks.values()) else 1)
