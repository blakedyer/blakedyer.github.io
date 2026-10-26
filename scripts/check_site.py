#!/usr/bin/env python3
"""Check the static site's links, assets, landmarks, and publication PDFs."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids, self.links, self.assets, self.tags, self.images = [], [], [], [], []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append(tag)
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
        if tag in {'img', 'script', 'source'} and attrs.get('src'):
            self.assets.append(attrs['src'])
        if tag == 'link' and attrs.get('href'):
            self.assets.append(attrs['href'])
        if tag == 'img':
            self.images.append(attrs)


def main():
    pages = {path.name: Page(path.read_text()) for path in ROOT.glob('*.html')
             if re.search(r'<script defer src="theme\.js(?:\?[^"]+)?"></script>', path.read_text())}
    errors = []
    filter_fragments = {'all', 'sea-level', 'carbon-cycle', 'stratigraphy', 'methods', 'ice-sheets'}
    for name, page in pages.items():
        for key, count in Counter(page.ids).items():
            if count > 1:
                errors.append(f'{name}: duplicate id {key}')
        for image in page.images:
            if 'alt' not in image:
                errors.append(f'{name}: missing image alternative text for {image.get("src")}')
        for link in page.links + page.assets:
            url = urlsplit(link)
            if url.scheme or url.netloc:
                continue
            target = unquote(url.path) or name
            if target.startswith('/'):
                target = target[1:] or 'index.html'
            if not (ROOT / target).is_file():
                errors.append(f'{name}: missing file {target}')
            if url.fragment and target in pages:
                valid_filter = target == 'publications.html' and url.fragment in filter_fragments
                if unquote(url.fragment) not in pages[target].ids and not valid_filter:
                    errors.append(f'{name}: missing anchor {target}#{url.fragment}')
        for tag in ['h1', 'main', 'title']:
            if page.tags.count(tag) != 1:
                errors.append(f'{name}: expected one {tag}')
    content = json.loads((ROOT / 'content.js').read_text().split('=', 1)[1].strip().removesuffix(';'))
    expected = len(content['publications'])
    for publication in content['publications']:
        link = publication['link']
        if not urlsplit(link).scheme and not (ROOT / link).is_file():
            errors.append(f'Publications: missing PDF {link}')
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'Checked {len(pages)} pages: local links, anchors, assets, image descriptions, core landmarks, and {expected} publication PDFs.')


if __name__ == '__main__':
    main()
