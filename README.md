# WAISL — Wireless AI Systems Lab

The WAISL homepage at DGIST. A custom, responsive Jekyll site for GitHub Pages, using self-hosted Geist Sans and Geist Mono. Body text uses weight 300.

## Preview

```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1
```

Open http://127.0.0.1:4000. Build with `bundle exec jekyll build`.

Google Analytics uses the existing GA4 measurement ID in `_config.yml` (`google_analytics`). The shared layout loads the [Google tag](https://developers.google.com/tag-platform/gtagjs) only in production builds, so normal local previews do not record visits. Build production output with `JEKYLL_ENV=production bundle exec jekyll build`; GitHub Pages uses the production environment.

## Content

- `_data/publications.json`: publication records, authors, citations, statuses, and links. `venue_short` supplies compact journal names in research-area related work. `featured: true` selects homepage papers. `preprint: true` adds a paper to the Preprints filter independently of its submission status; `paper_url` supplies its direct link.
- Records with `type: "progress"` omit `year`: their displayed year and year filter follow the current year in Asia/Seoul, refreshed when the page loads. When a paper is published, change its type to `journal` or `conference`, set its status to `Published`, and supply its publication `year`.
- `feed.xml`: the publication RSS feed reads the same publication data. `feed_id` and `feed_date` preserve existing feed entries and their original posting dates; these identifiers do not create local paper pages.
- `_data/news.json`: news in newest-first order.
- `_data/research.yml`: research directions and related publication IDs.
- `_data/people.yml`: role, name, degree, portrait, and short research interests for each member; future members remain explicit placeholders.
- `pages/members.html`: one column of compact, uniform member cards, without profile links or biographies. `/people/` and former profile URLs redirect to Members at `/members/`.
- `_config.yml`: lab identity, contact email, and profile links.
- `assets/css/main.css` and `assets/js/main.js`: design and progressive interactions.

## Content notes

Research content and publication records originated from the previous homepage and incorporate subsequent updates from the PI. The latent communications direction and the 2026 PI portrait were supplied in the redesign feedback. The four research areas are ordered as AI-native wireless, latent communications for edge intelligence, wireless digital twins, and non-terrestrial networks. WAISL, the DGIST EECS affiliation, the PI title, and the DGIST email follow the PI's updates. An office location, formal appointment date, and specific recruitment availability have not been provided. The homepage opens with the lab overview and Channel2World illustration; PI information is shown on the Members page.

Publication history includes pre-WAISL work. The original homepage's final citations are retained in the publication data. Paper titles, arrows, research links, and feed links open `paper_url` directly. Individual paper pages and their legacy redirects have been removed. The two conference papers are also retained.

Geist font files are distributed under the SIL Open Font License; see `assets/fonts/OFL.txt` and https://github.com/vercel/geist-font. Original theme license remains in `LICENSE`.
