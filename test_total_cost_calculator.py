#!/usr/bin/env python3
"""Functional regression test for the US total cost calculator."""
from html.parser import HTMLParser
from pathlib import Path
import subprocess
import sys

class Scripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.active = False
        self.blocks = []
    def handle_starttag(self, tag, attrs):
        if tag == "script" and "src" not in dict(attrs):
            self.active = True
            self.blocks.append("")
    def handle_data(self, data):
        if self.active:
            self.blocks[-1] += data
    def handle_endtag(self, tag):
        if tag == "script":
            self.active = False

page = Path(__file__).with_name("total-cost-calculator.html")
parser = Scripts()
parser.feed(page.read_text(encoding="utf-8"))
if len(parser.blocks) != 1:
    sys.exit("Expected one inline calculator script")
script = parser.blocks[0]
harness = r"""
const assert = require('node:assert/strict');
const vm = require('node:vm');
const ids=['price','tax','shipping','extras','monthly','years','total','out-price','out-tax','out-extras','out-recurring','out-monthly'];
const el=Object.fromEntries(ids.map(id=>[id,{value:'0',textContent:'',listeners:{},addEventListener(name,fn){this.listeners[name]=fn}}]));
const document={getElementById(id){assert.ok(el[id],id);return el[id]}};
vm.runInNewContext(SCRIPT,{document,Intl,Number,Math,Object});
function set(values){for(const [id,value] of Object.entries(values)){el[id].value=String(value)}el.price.listeners.input()}
set({price:120,tax:8,shipping:10,extras:20,monthly:5,years:2});
assert.equal(el.total.textContent,'$279.60');
assert.equal(el['out-tax'].textContent,'$9.60');
assert.equal(el['out-recurring'].textContent,'$120.00');
assert.equal(el['out-monthly'].textContent,'$11.65');
set({price:-10,tax:1000,shipping:-5,extras:0,monthly:0,years:1});
assert.equal(el.total.textContent,'$0.00');
set({price:250,tax:0,shipping:0,extras:0,monthly:12,years:3});
assert.equal(el.total.textContent,'$682.00');
console.log('Calculator functional tests passed');
""".replace("SCRIPT",repr(script))
result = subprocess.run(["node", "-e", harness], capture_output=True, text=True)
print(result.stdout, end="")
if result.returncode:
    print(result.stderr, file=sys.stderr)
sys.exit(result.returncode)
