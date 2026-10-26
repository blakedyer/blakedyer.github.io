# Earth History @ UVic

A static research-group website. Committed HTML is served directly by GitHub Pages.

## Edit and preview

Edit the root HTML files directly: `index.html`, `team.html`, and
`fieldwork.html` contain the targeted updates. Publications are in `content.js`;
gallery content remains in `gallery-data.js` and the existing album pages.
There is no build step. Shared styling and interactions are in `theme.css`
and `theme.js`.

```sh
python3 scripts/check_site.py
python3 -m http.server 8786 --bind 127.0.0.1
```

Open <http://127.0.0.1:8786/>. Refresh after edits.

The October 2026 feedback preview is also running as the temporary local user
service `earth-history-preview.service`. Stop it with
`systemctl --user stop earth-history-preview.service` when review is finished.

## Smaller revision scope — October 26, 2026

This replaces the overhaul plan. The user wants a targeted update to the original
site, with concise, approachable writing and its existing identity intact.
The visual and structural baseline is commit `4c34bd0`, before the two local
overhaul commits (`5256c73` and `defb79b`). Those experiments remain recoverable.
The local preview now uses that original presentation with the targeted updates
below. The extra pages, layout overrides, and build system from the overhaul
have been removed. Corrected publication metadata and link checks are retained.

### Preserve first

Keep the original photographic hero, Earth History @ UVic title, asymmetric
image panels, group portraits, typography, colors, navigation, publication
timeline, and visible field albums. Preserve the original diversity statement
verbatim in the homepage's Join the Group section, visible without expanding
anything. Concision should remove repetition, not group values or personality.

### First pass: three existing pages

| Location | Limited change |
| --- | --- |
| Team | Move Miranda Reid and Stacey Edmonsond into alumni using the existing profile design. Record Miranda's PhD candidacy at the University of Waterloo and Stacey's McDonnell Center for the Space Sciences Postdoctoral Fellowship at Washington University in St. Louis. Preserve other profiles and links. |
| Home: Join the Group | Add a clear invitation for prospective graduate students and the existing email contact. Keep the people-centered heading, portraits, and full diversity statement. Separate the invitation from the statement for easier scanning; do not invent funded openings or start dates. |
| Home: What We Do | Lightly edit existing research descriptions using the Discovery Grant's broad ideas: reading connected coastal landscapes, understanding how sediments preserve or alter environmental signals, and testing when geological clocks are reliable. Retain the breadth of the group's climate, carbon-cycle, and quantitative work. Avoid importing the proposal's objectives or detailed work packages. |
| Field Photos | Keep the hero and album grid. Add one compact resource section using the existing visual language: Cook Islands field portal, field atlas, and searchable photos. Provide clearly labeled links to the existing tools, with one short explanation each. |
| Cook Islands resource | Add one sentence explaining Blake's HiSEAS collaboration and a direct HiSEAS link beside the expedition material. Offer daily narratives and 3D reconstructions through the portal rather than duplicating them. |
| Existing contact area | Add a brief invitation to research, nonprofit, and philanthropic conversations. Let the science and existing evidence explain the work's value; no new donor page or campaign. |

Reviewers should still find papers and the research overview immediately;
prospective students should see both the invitation and the group's values;
potential partners should understand the work and have a clear contact route.
These audiences do not require separate landing pages.

### Writing and scope rules

- Edit sentences in place. Prefer one or two sentences for new explanatory
  blocks and remove repeated ideas across headings and body text.
- Preserve distinctive factual descriptions and the full diversity statement.
  A word-count target must never override meaning.
- Use existing photographs, profiles, and the publication timeline to support
  a quick visit. Do not replace them with a new visual system or generic slogans.
- No new top-level pages, navigation restructuring, wholesale biography
  rewrites, publication-layout changes, or site-wide CSS redesign in this pass.
- Retain verified role and publication metadata corrections and useful checks
  from the experiments where they do not alter the original presentation.

### Optional later addition

After the smaller update is reviewed, consider one compact field experience
inside the existing Field Photos page: either a short 3D rotation or a
photograph-to-mesh comparison. It must demonstrate a specific aspect of the
science, work accessibly, load on demand, and link to the full portal. The new
Te Rotonui page, full embedded portals, multiple daily-story features, separate
recruitment/partnership pages, and broader redesign are outside this pass.

### Implementation and review

The original presentation has been restored and the small content and link
updates applied. Review the result against the original site on desktop and
mobile, checking that the diversity statement, portraits, timeline, albums,
and navigation remain intact. Validate roles, links, keyboard access, and layout.
Provide a local preview; do not push.

## Before committing

```sh
python3 scripts/check_site.py
node --check content.js
node --check gallery-data.js
node --check theme.js
git diff --check
```

Pushing `master` deploys the site; local commits do not.

## Content and media

- Keep current roles, alumni destinations, and research opportunities current.
- Public recruitment text describes research directions; funding and start dates
  should only be advertised when confirmed.
- Home, Team, and the field-resource links are readable without JavaScript.
  The original publication timeline, filters, and galleries use JavaScript.
- Cook Islands photographs already published in this repository are documented
  in `assets/images/cook-islands/SOURCES.json`.
- Daily narratives, maps, photo search, and 3D reconstructions stay in the
  existing public portals, linked from Field Photos.
- Keep private proposals and unpublished data outside this repository.
