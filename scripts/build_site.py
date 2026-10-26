#!/usr/bin/env python3
"""Build the research site with Python's standard library. No runtime framework.

Core page bodies live in src/pages; gallery pages retain their existing bodies.
Run --check to verify committed HTML matches the editable sources.
"""
from pathlib import Path
from html import escape
import argparse
import json
import re

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://blakedyer.github.io/"
PAGES = {
    "index": ("Earth history in rocks and landscapes", "Research on sedimentary records, sea-level history, carbonate geochemistry, and the carbon cycle at the University of Victoria. Seeking graduate students.", "home"),
    "research": ("Research", "How do sediments preserve and distort environmental change? Explore our work on sea level, geological clocks, and Earth’s carbon cycle.", "research"),
    "fieldwork": ("Fieldwork", "Explore field stories, digital outcrops, the Cook Islands expedition, a geographic field atlas, and searchable field photographs.", "fieldwork"),
    "team": ("People", "Meet Blake Dyer’s research group and alumni at the University of Victoria, working across field geology, geochemistry, and quantitative Earth history.", "team"),
    "publications": ("Publications", "Research papers, summaries, software, and data resources from Earth History at the University of Victoria.", "publications"),
    "join": ("Join us", "Graduate research opportunities in coastal landscapes, carbonate chemistry, geological time, and quantitative Earth history with Blake Dyer at UVic.", "join"),
    "partnerships": ("Partnerships & support", "Discuss research collaboration, public science, and support for students and Earth-history research at the University of Victoria.", "partnerships"),
    "te-rotonui": ("Explore Te Rotonui", "A guided introduction to the Te Rotonui digital outcrop on Mitiaro, with field observations, 3D animations, and links to the Cook Islands expedition record.", "fieldwork"),
}
NAV = [("research.html", "Research", "research"), ("fieldwork.html", "Fieldwork", "fieldwork"), ("team.html", "People", "team"), ("publications.html", "Publications", "publications"), ("join.html", "Join us", "join")]


def navigation(page):
    links = []
    for href, title, key in NAV:
        attrs = ' aria-current="page"' if key == page else ""
        if key == "join":
            attrs += ' class="nav-join"'
        links.append(f'<a href="{href}"{attrs}>{title}</a>')
    return '\n        '.join(links)


def header(page):
    return f'''<header class="site-header">
    <div class="nav-shell">
      <a class="site-mark" href="index.html">Earth History <span>@ UVic</span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu" data-nav-toggle hidden>Menu</button>
      <nav class="site-nav" id="site-menu" data-nav-menu aria-label="Main navigation">
        {navigation(page)}
      </nav>
    </div>
  </header>'''


def footer():
    return '''<footer class="site-footer">
    <div class="footer-shell">
      <div><a class="footer-brand" href="index.html">Earth History @ UVic</a><p class="footer-copy">Blake Dyer’s research group<br>School of Earth and Ocean Sciences<br>University of Victoria</p><a href="mailto:blakedyer@uvic.ca">blakedyer@uvic.ca</a></div>
      <nav class="footer-links" aria-label="Research and contact"><a href="research.html">Research</a><a href="fieldwork.html">Fieldwork</a><a href="team.html">People</a><a href="publications.html">Publications</a><a href="join.html">Join us</a><a href="partnerships.html">Partnerships &amp; support</a></nav>
      <nav class="footer-links" aria-label="Further resources"><a href="https://www.hiseas.org/">HiSEAS</a><a href="https://eos-courses.readthedocs.io/en/latest/">Teaching</a><a href="https://blakedyer.github.io/curriculum_atlas/">Curriculum Atlas</a><a href="https://blakedyer.github.io/seos_curriculum/">Curriculum Work</a><a href="cv.pdf">CV</a><a href="https://scholar.google.com/citations?user=zW0HJFsAAAAJ&amp;hl=en">Google Scholar</a><a href="https://orcid.org/0000-0002-0277-366X">ORCID</a><a href="https://github.com/blakedyer">GitHub</a></nav>
    </div>
  </footer>'''


def person_markup(person):
    p = {k: escape(str(v), quote=True) for k, v in person.items() if isinstance(v, str)}
    destination = f'<p class="person-destination">{p["destination"]}</p>' if p.get("destination") else ""
    links = ''.join(f'<a href="{escape(url, quote=True)}">{escape(label)}</a>' for label, url in person["links"])
    return f'''<article class="person-profile" id="{p['id']}"><img src="{p['image']}" alt="{p['name']}" width="320" height="320" loading="lazy"><div><h3>{p['name']}</h3><p class="profile-role">{p['role']}</p>{destination}<p>{p['bio']}</p><div class="link-row">{links}</div></div></article>'''


def slugify(value):
    return re.sub(r"[^a-z0-9]+", "-", value.lower().replace("&", "and")).strip("-")


def publication_markup(p):
    key = f"publication-{p['year']}-{slugify(p['title'])}"
    labels = {"sea-level": "Sea level", "carbon-cycle": "Carbon cycle", "stratigraphy": "Stratigraphy", "methods": "Methods", "ice-sheets": "Ice sheets"}
    tags = ''.join(f'<li class="tag">{labels[t]}</li>' for t in p['tags'])
    resources = ''.join(f'<a href="{escape(r["url"], quote=True)}">{escape(r["label"])}</a>' for r in p.get('resources', []))
    if p.get('doi'):
        resources = f'<a href="https://doi.org/{escape(p["doi"])}">Journal / DOI</a>' + resources
    return f'''<article id="{key}" class="paper-card publication-entry" data-tags="{' '.join(p['tags'])}" data-publication-id="{key}" tabindex="-1" aria-labelledby="{key}-title"><div class="paper-card__top"><a class="paper-link" href="{escape(p['link'])}" target="_blank" rel="noopener">PDF</a></div><h3 class="paper-title" id="{key}-title"><a href="{escape(p['link'])}" target="_blank" rel="noopener">{escape(p['title'])}</a></h3><p class="paper-authors">{escape(p['authors'])}</p><p class="paper-journal">{escape(p['journal'])}</p><div class="link-row paper-resources">{resources}</div><details class="paper-detail"><summary>What this paper adds</summary><p class="paper-summary">{escape(p['summary'])}</p><ul class="tag-list">{tags}</ul></details></article>'''


def publications_markup(publications):
    years = sorted({p['year'] for p in publications}, reverse=True)
    return '\n'.join(f'''<section class="publication-year-group" data-year="{year}"><div class="publication-year-marker"><h2><span>{year}</span></h2></div><div class="publication-year-items">{''.join(publication_markup(p) for p in publications if p['year'] == year)}</div></section>''' for year in years)


def album_markup(album):
    return f'''<article class="album-card expedition-card"><a class="album-card__image" href="{escape(album['link'])}"><img src="{escape(album['image'])}" alt="{escape(album['title'])} field album" loading="lazy"></a><div class="album-card__body"><h3><a href="{escape(album['link'])}">{escape(album['title'])}</a></h3><p class="album-card__meta">{album['count']} photographs</p></div></article>'''


def build():
    layout = (ROOT / 'src/layout.html').read_text()
    people = json.loads((ROOT / 'src/people.json').read_text())
    content = json.loads((ROOT / 'src/content.json').read_text())
    gallery_text = (ROOT / 'gallery-data.js').read_text().split('=', 1)[1].lstrip()
    galleries, _ = json.JSONDecoder().raw_decode(gallery_text)
    fragments = {
        'current_people': '\n'.join(person_markup(p) for p in people if p['group'] == 'current'),
        'alumni_people': '\n'.join(person_markup(p) for p in people if p['group'] == 'alumni'),
        'album_grid': '\n'.join(album_markup(a) for a in galleries['albums']),
        'publication_grid': publications_markup(content['publications']),
    }
    outputs = {'content.js': 'window.EARTH_HISTORY = ' + json.dumps(content, indent=2, ensure_ascii=False) + ';\n'}
    for slug, (title, description, page) in PAGES.items():
        body = (ROOT / f'src/pages/{slug}.html').read_text()
        for key, value in fragments.items():
            body = body.replace('{{' + key + '}}', value)
        scripts = '<script defer src="content.js"></script>'
        if slug == 'fieldwork':
            scripts += '\n  <script defer src="gallery-data.js"></script>'
        values = dict(title=escape(title), description=escape(description), canonical=BASE + ('' if slug == 'index' else slug + '.html'), page=page, body=body, header=header(page), footer=footer(), scripts=scripts)
        html = layout
        for key, value in values.items():
            html = html.replace('{{' + key + '}}', value)
        outputs[slug + '.html'] = html
    # Keep established album URLs and bodies, updating only the common shell.
    for path in ROOT.glob('*.html'):
        if path.name in outputs or path.name in {'nav.html', 'footer.html'}:
            continue
        html = path.read_text()
        if 'class="site-header"' not in html:
            continue
        page_match = re.search(r'data-page="([^"]+)"', html)
        page = page_match.group(1) if page_match else ''
        page = 'fieldwork' if page == 'gallery' else page
        html = re.sub(r'<header class="site-header">.*?</header>', lambda _: header(page), html, count=1, flags=re.S)
        html = re.sub(r'<footer class="site-footer">.*?</footer>', lambda _: footer(), html, count=1, flags=re.S)
        if 'href="revision.css"' not in html:
            html = html.replace('<link rel="stylesheet" href="theme.css">', '<link rel="stylesheet" href="theme.css">\n  <link rel="stylesheet" href="revision.css">')
        if 'src="revision.js"' not in html:
            html = html.replace('</head>', '  <script defer src="revision.js"></script>\n</head>')
        outputs[path.name] = html
    outputs['nav.html'] = '<nav aria-label="Main navigation">' + navigation('') + '</nav>\n'
    outputs['footer.html'] = footer() + '\n'
    routes = sorted(set(['cv.pdf'] + [slug + '.html' for slug in PAGES] + [a['link'] for a in galleries['albums']]))
    outputs['sitemap.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>{BASE}{escape(route)}</loc></url>\n' for route in [''] + routes if route != 'index.html') + '</urlset>\n'
    return outputs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    changed = []
    for name, text in build().items():
        path = ROOT / name
        if not path.exists() or path.read_text() != text:
            changed.append(name)
            if not args.check:
                path.write_text(text)
    if args.check and changed:
        raise SystemExit('Generated files need rebuilding: ' + ', '.join(changed))
    print(('Checked' if args.check else 'Built') + ' research site' + (': ' + ', '.join(changed) if changed else ' (up to date)'))


if __name__ == '__main__':
    main()
