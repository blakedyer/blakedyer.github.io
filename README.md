# Earth History @ UVic

A static research-group website. Committed HTML is served directly by GitHub Pages.

## Edit and preview

Edit core page bodies in `src/pages/`, shared structure in `src/layout.html`,
people in `src/people.json`, and publications in `src/content.json`.
Shared navigation and footer markup are defined in `scripts/build_site.py`.
Gallery content remains in `gallery-data.js` and the existing album pages.

```sh
python3 scripts/build_site.py
python3 scripts/check_site.py
python3 -m http.server 8786 --bind 127.0.0.1
```

Open <http://127.0.0.1:8786/>. Refresh after edits and rebuilding.
The build uses only Python's standard library. `theme.css` / `theme.js` retain
the existing gallery and publication features; `revision.css` / `revision.js`
provide the revised layouts, navigation refinements, and guided field experience.

The October 2026 feedback preview is also running as the temporary local user
service `earth-history-preview.service`. Stop it with
`systemctl --user stop earth-history-preview.service` when review is finished.

## Review focus

The first implementation connects the homepage, research, people, recruitment,
fieldwork, publications, and a new partnerships page. A guided Te Rotonui page
embeds the two existing 3D animations, explains the evidence, and links to the
full site record. Atlas browsing and photo search use the existing public portals.

Useful next editorial decisions are the balance among research themes, the
recruitment and mentoring language, which additional field stories deserve
guided treatment, and how specific the partnership invitation should become.
Start dates, funded openings, and an institutional giving destination remain
items to add when confirmed. Free-camera 3D controls and a full embedded atlas
are not part of this first implementation.

## Before committing

```sh
python3 scripts/build_site.py --check
python3 scripts/check_site.py
node --check theme.js
node --check revision.js
git diff --check
```

Commit both source and generated files. The deployment workflow checks that
they agree. Pushing `master` deploys the site; local commits do not.

## Content and media

- Keep current roles, alumni destinations, and research opportunities current.
- Public recruitment text describes research directions; funding and start dates
  should only be advertised when confirmed.
- Core pages include readable content without JavaScript. Filters, galleries,
  and guided tabs enhance the static pages.
- Cook Islands photographs already published in this repository are documented
  in `assets/images/cook-islands/SOURCES.json`.
- Te Rotonui animations stream from the existing public field-media host only
  after a visitor selects a view. The full portal remains the detailed record.
- Keep private proposals and unpublished data outside this repository.
