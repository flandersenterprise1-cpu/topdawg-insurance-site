# Background images

The marketing site references four background images by local path. Until you
drop the real files here, those sections fall back to elegant solid-dark
backgrounds (nothing breaks — no broken-image icons).

To restore the original photographic backgrounds, save these four files into
this folder with **exactly these names**:

| Save as (in this folder)   | Original Manus CDN source |
|----------------------------|---------------------------|
| `hero-bg.webp`             | https://d2xsxph8kpxj0f.cloudfront.net/310519663473234294/b4v5QRDW88dLJmbeyiAzmk/hero-bg-PCHPiyhf5DNjZRW7rGbYPL.webp |
| `platform-section-bg.webp` | https://d2xsxph8kpxj0f.cloudfront.net/310519663473234294/b4v5QRDW88dLJmbeyiAzmk/platform-section-bg-g3omcTXygzVKZknQzpLzj5.webp |
| `claims-section.webp`      | https://d2xsxph8kpxj0f.cloudfront.net/310519663473234294/b4v5QRDW88dLJmbeyiAzmk/claims-section-3uCavKePkq3cEeRTB6RLXh.webp |
| `agents-section.webp`      | https://d2xsxph8kpxj0f.cloudfront.net/310519663473234294/b4v5QRDW88dLJmbeyiAzmk/agents-section-VDA9KNtCTEtbAgniEcLG7T.webp |

### How to grab them

While those Manus CDN links still work, open each URL in your browser →
right-click → **Save Image As…** → save into this folder with the name from
the left column. Commit them, and the Deploy workflow will publish them.

You can also swap in your own imagery later — just keep the same file names, or
update the paths at the top of `HeroSection.tsx`, `PlatformSection.tsx`,
`ClaimsSection.tsx`, and `AgentsSection.tsx`.
