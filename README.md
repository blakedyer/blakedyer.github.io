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

## Revision plan: a short visit first

The site should make sense during a brief visit. Photographs and useful
interactions carry the first explanation; detail is available on demand.

| Surface | Visitor’s next step | Editing rule |
| --- | --- | --- |
| Home | Choose a research interest or join the group | One sentence of purpose, three visual routes, one field experience |
| Research | Find a question and supporting evidence | One short explanation per theme; methods expand on request |
| Fieldwork | Try an experience or find a resource | Lead with the 3D comparison; maps, search, and regional albums follow |
| Te Rotonui | See what a reconstruction adds | Texture-to-mesh slider first; rotation shows the wider geometry |
| Join us | Decide whether to make contact | Fit and email first; admissions, funding, and mentoring in disclosures |
| People | Find a person or an alumni destination | Portrait, role, one-line research focus, links |
| Publications | Find and open a paper | Titles and citations first; summaries expand individually |
| Partnerships | Understand what support enables | People, discovery, access; one contact route |

Each topic has a home. Research explanations belong on Research, alumni
outcomes on People, and mentoring details on Join us. The homepage points to
these rather than repeating them. Avoid introductory sections that merely
restate the next heading. Keep normal paragraphs to one or two sentences.

Interactions must demonstrate something: the comparison exposes the geometric
mesh beneath the photographic texture; the rotation connects a close outcrop
to its wider coastline. Neither autoplays. Both remain useful as still images,
and the comparison works with a keyboard. Publication filters and archive search
are for finding evidence, not decoration.

Start dates, funded openings, and an institutional giving destination can be
added when confirmed. Free-camera 3D controls and a full embedded atlas remain
possible extensions; add them only when they make a specific question easier
to explore. The full portals remain accessible from Fieldwork.

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
  and the model comparison enhance the static pages.
- Cook Islands photographs already published in this repository are documented
  in `assets/images/cook-islands/SOURCES.json`.
- The compact Te Rotonui overview is copied unchanged from the Cook Islands
  report assets and loads on demand. Model renders and video provenance are
  recorded in the asset manifests. The full portal remains the detailed record.
- Keep private proposals and unpublished data outside this repository.
