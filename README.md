# PRESTIGE — launch site

Static site in French and English, with no framework, tracker, cookie or remote
asset. `site/` is the complete GitHub Pages deliverable: publish its contents at
the repository root.

## Rebuild

Everything below runs from `marketing/` (Python 3.12 + Pillow).

```
python build_assets.py          # captures -> images, icons, social card (when a capture changes)
python build_site.py            # preview build: missing facts show as yellow tags
python -m unittest test_site    # links, alt texts, banned words, contrast, weight budgets
python build_site.py --release  # refuses to build while a fact below is missing
```

Preview locally: `cd site && python -m http.server 8790`, then open `http://localhost:8790/`.
`?vh=900` on the home page lays it out as a 900 px tall window (used for full-page screenshots).

## What only you can fill in — `marketing/site_config.py`

| Key | What it is |
|---|---|
| `site_url` | public address, no trailing slash (canonical links, sitemap, social card) |
| `company` | developer/app identity shown on Google Play and in the policy |
| `support_email` | confirmed mailbox for product support |
| `privacy_email` | confirmed mailbox for privacy requests; it may be the same address |
| `play_url` | public Google Play listing; keep blank until it answers successfully |

When `play_url` is blank, the site shows a neutral availability status instead
of a disabled download control and never links to the unavailable Store listing.

The layout is reviewed from a 360 px viewport first. Mobile navigation keeps
44 px targets and keyboard focus inside the open menu; legal-page contents are
collapsed on small screens and remain fully available without JavaScript.
Generated pages fingerprint the CSS and JavaScript URLs so a new GitHub Pages
deployment cannot leave returning visitors on an older interface.

## Google Play Console — where each URL goes

| Play Console field | URL |
|---|---|
| Store listing → Privacy policy | `{site_url}/confidentialite.html` |
| App content → Data safety → Account deletion URL | `{site_url}/suppression-compte.html` |
| Store listing → Website | `{site_url}/` |
| Store listing → Email | your `support_email` |

Check every URL in a private window, signed out, before submitting.

## Screenshots

`raw/NN_name.png` are full 1220×2712 captures (Motorola edge 2025). `build_assets.py` cuts the
status bar and gesture bar (they show the owner's notifications) and the site redraws a clean
one around each screen, coloured from the capture's own top and bottom edge. To add a screen:
drop `NN_name.png` in `raw/`, add one line to `SCREENS` in `build_site.py`, rebuild.
`raw/` stays out of the published site. The portfolio capture has the amount hidden on purpose.

## The phone

CSS only, no image. Proportions of a Motorola edge 2025 (73.1 × 161.2 mm, screen ratio
1220:2712, ≈11 mm corner radius, punch-hole camera, keys on the right edge). Everything is sized
in container units of the device's own width, so it scales from a 160 px thumbnail to a 330 px hero.

## Publishing

GitHub Pages serves this repository over HTTPS. Do not publish `marketing/raw/`,
`*.py` or the parent application repository; publish only the contents of `site/`.
The `.nojekyll` file keeps GitHub Pages in static-file mode.
