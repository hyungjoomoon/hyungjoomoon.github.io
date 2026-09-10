# WAISL — Wireless AI Systems Lab

The WAISL homepage at DGIST. A custom, responsive Jekyll site for GitHub Pages, using self-hosted Geist Sans and Geist Mono. Body text uses weight 300.

## Preview

```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1
```

Open http://127.0.0.1:4000. Build with `bundle exec jekyll build`.

## Content

- `_data/publications.json`: publication records, authors, citations, statuses, and links. `venue_short` supplies compact journal names in research-area related work. `featured: true` selects homepage papers. `preprint: true` adds a paper to the Preprints filter independently of its submission status; `paper_url` supplies its direct link.
- `_posts/`: legacy paper URLs redirect straight to the external paper using `_layouts/post.html`; no paper detail pages are displayed.
- `_data/news.json`: news in newest-first order.
- `_data/research.yml`: research directions and related publication IDs.
- `_data/people.yml`: role, name, degree, portrait, and short research interests for each member; future members remain explicit placeholders.
- `pages/people.html`: one column of compact, uniform member cards, without profile links or biographies. Former profile URLs redirect to People.
- `_config.yml`: lab identity, contact email, profile links, and the shared `pi_portrait` path.
- `assets/css/main.css` and `assets/js/main.js`: design and progressive interactions.

## First-draft content notes

Research content, publication statuses, dates, and contact information are carried over from the original homepage. The latent communications direction and the 2026 PI portrait were supplied in the redesign feedback. The four research areas are ordered as AI-native wireless, latent communications for edge intelligence, wireless digital twins, and non-terrestrial networks. WAISL, DGIST affiliation, and the PI role follow the redesign brief. A DGIST email, department, office, formal appointment title/date, and specific recruitment availability were not provided and have not been invented. Detailed personal biographies and education histories are not displayed.

Publication history includes pre-WAISL work. The original homepage's final citations take precedence over older post metadata. Paper titles, arrows, research links, and feed links open `paper_url` directly. Legacy paper URLs redirect to that same destination and are excluded from the sitemap. The two conference papers are also retained.

Geist font files are distributed under the SIL Open Font License; see `assets/fonts/OFL.txt` and https://github.com/vercel/geist-font. Original theme license remains in `LICENSE`.
