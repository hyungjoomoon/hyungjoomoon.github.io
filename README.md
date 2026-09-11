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
- `feed.xml`: the publication RSS feed reads the same publication data. `feed_id` and `feed_date` preserve existing feed entries and their original posting dates; these identifiers do not create local paper pages.
- `_data/news.json`: news in newest-first order.
- `_data/research.yml`: research directions and related publication IDs.
- `_data/people.yml`: role, name, degree, portrait, and short research interests for each member; future members remain explicit placeholders.
- `pages/members.html`: one column of compact, uniform member cards, without profile links or biographies. `/people/` and former profile URLs redirect to Members at `/members/`.
- `_config.yml`: lab identity, contact email, profile links, and the shared `pi_portrait` path.
- `assets/css/main.css` and `assets/js/main.js`: design and progressive interactions.

## First-draft content notes

Research content, publication statuses, dates, and contact information are carried over from the original homepage. The latent communications direction and the 2026 PI portrait were supplied in the redesign feedback. The four research areas are ordered as AI-native wireless, latent communications for edge intelligence, wireless digital twins, and non-terrestrial networks. WAISL, DGIST affiliation, and the PI role follow the redesign brief. A DGIST email, department, office, formal appointment title/date, and specific recruitment availability were not provided and have not been invented. Detailed personal biographies and education histories are not displayed.

Publication history includes pre-WAISL work. The original homepage's final citations are retained in the publication data. Paper titles, arrows, research links, and feed links open `paper_url` directly. Individual paper pages and their legacy redirects have been removed. The two conference papers are also retained.

Geist font files are distributed under the SIL Open Font License; see `assets/fonts/OFL.txt` and https://github.com/vercel/geist-font. Original theme license remains in `LICENSE`.
