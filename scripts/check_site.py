#!/usr/bin/env python3
"""Check generated site links, assets, landmarks, and no-JavaScript content."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json

from build_site import ROOT, PAGES, build


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
    pages = {name: Page(text) for name, text in build().items()
             if name.endswith('.html') and name not in {'nav.html', 'footer.html'}}
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
        if name.removesuffix('.html') in PAGES:
            for tag in ['h1', 'main', 'title']:
                if page.tags.count(tag) != 1:
                    errors.append(f'{name}: expected one {tag}')
    content = json.loads((ROOT / 'src/content.json').read_text())
    expected = len(content['publications'])
    actual = sum(key.startswith('publication-') and not key.endswith('-title')
                 for key in pages['publications.html'].ids if key not in {'publication-grid', 'publication-overview'})
    if actual != expected:
        errors.append(f'Publications fallback: expected {expected} papers, found {actual}')
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'Checked {len(pages)} pages: local links, anchors, assets, image descriptions, core landmarks, and {expected} static publications.')


if __name__ == '__main__':
    main()
