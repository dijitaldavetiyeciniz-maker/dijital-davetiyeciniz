# Template System Audit Report

## 1. Executive Summary & Statistics

| Metric | Value |
|--------|-------|
| **TOTAL_TEMPLATE_IDS** | 198 (75 base presets + 123 color variants) |
| **UNIQUE_DESIGNS (A)** | 48 |
| **RELATED_DESIGNS (B)** | 23 |
| **NEAR_DUPLICATES (C)** | 4 |
| **COLOR/STYLE_VARIANTS (D)** | 123 |
| **LAYOUT_COMPONENT_COUNT** | 52 |
| **UNIQUE_LAYOUT_FAMILIES** | 48 |
| **OPENING_ANIMATION_COUNT** | 41 |
| **UNIQUE_OPENING_FAMILIES** | 30 |

### Key Findings:
- **STRONGEST_CATEGORIES**: Lüks (19), Doğal (14), Çocuk (13)
- **WEAKEST_CATEGORIES**: Minimal (1), Kurumsal (1), Kültürel (2)
- **MOST_REPEATED_LAYOUT_FAMILY**: `botanical-frame` (used 6 times)
- **MOST_REPEATED_OPENING_FAMILY**: `envelope` (used 24 times)

---

## 2. Detailed Template Classification Matrix

This table lists all 75 base templates along with their nested color variants.

| Template ID | Classification | Layout Family | Similar To | Reason / Description |
|-------------|----------------|---------------|------------|----------------------|
| `parisian-black-tie` | A — Unique | `french-haute-couture` | — | Unique composition & style signature |
| `grand-opera-ballroom` | A — Unique | `art-deco-theater` | — | Unique composition & style signature |
| `moonlit-secret-garden` | A — Unique | `constellation-night` | — | Unique composition & style signature |
| `vogue-wedding-editorial` | A — Unique | `fashion-magazine` | — | Unique composition & style signature |
| `mediterranean-ceramic-garden` | A — Unique | `botanical-ceramic` | — | Unique composition & style signature |
| `ottoman-illumination` | A — Unique | `oriental-lace` | — | Unique composition & style signature |
| `coastal-sunset` | A — Unique | `full-bleed-photo` | — | Unique composition & style signature |
| `aurora-glass` | A — Unique | `modern-architecture` | — | Unique composition & style signature |
| `fine-art-botanical-watercolor` | A — Unique | `botanical-frame` | — | Unique composition & style signature |
| `film-premiere-night` | A — Unique | `cinematic-poster` | — | Unique composition & style signature |
| `minimal-swiss-gallery` | A — Unique | `swiss-grid` | — | Unique composition & style signature |
| `royal-palace-invitation` | A — Unique | `royal-letter` | — | Unique composition & style signature |
| `henna-palace-night` | A — Unique | `henna-velvet` | — | Unique composition & style signature |
| `prince-ceremony` | A — Unique | `royal-circumcision` | — | Unique composition & style signature |
| `storybook-babyshower` | A — Unique | `storybook-kids` | — | Unique composition & style signature |
| `storybook-birthday` | C — Near Duplicate | `storybook-kids` | `storybook-babyshower` | Same layout (storybook-kids) with highly similar styling (fonts/colors/opening matches) |
| `future-summit` | A — Unique | `modern-event` | — | Unique composition & style signature |
| `cinematic-poster` | C — Near Duplicate | `cinematic-poster` | `film-premiere-night` | Same layout (cinematic-poster) with highly similar styling (fonts/colors/opening matches) |
| `red-carpet` | D — Variant | `cinematic-poster` | `cinematic-poster` | Direct color variant of parent theme |
| `gold-premiere` | D — Variant | `cinematic-poster` | `cinematic-poster` | Direct color variant of parent theme |
| `royal-letter` | B — Related | `royal-letter` | `royal-palace-invitation` | Shares layout (royal-letter) but uses a different visual theme/configuration |
| `royal-gold` | D — Variant | `royal-letter` | `royal-letter` | Direct color variant of parent theme |
| `royal-blue-gold` | D — Variant | `royal-letter` | `royal-letter` | Direct color variant of parent theme |
| `polaroid-story` | A — Unique | `polaroid-story` | — | Unique composition & style signature |
| `vintage-rose` | D — Variant | `polaroid-story` | `polaroid-story` | Direct color variant of parent theme |
| `olive-wood` | D — Variant | `polaroid-story` | `polaroid-story` | Direct color variant of parent theme |
| `constellation-night` | B — Related | `constellation-night` | `moonlit-secret-garden` | Shares layout (constellation-night) but uses a different visual theme/configuration |
| `midnight-cyan` | D — Variant | `constellation-night` | `constellation-night` | Direct color variant of parent theme |
| `starlight-gold` | D — Variant | `constellation-night` | `constellation-night` | Direct color variant of parent theme |
| `clouds-above` | A — Unique | `kids-thematic` | — | Unique composition & style signature |
| `clouds-above-var-1` | D — Variant | `kids-thematic` | `clouds-above` | Direct color variant of parent theme |
| `clouds-above-var-2` | D — Variant | `kids-thematic` | `clouds-above` | Direct color variant of parent theme |
| `little-racer` | B — Related | `kids-thematic` | `clouds-above` | Shares layout (kids-thematic) but uses a different visual theme/configuration |
| `little-racer-var-1` | D — Variant | `kids-thematic` | `little-racer` | Direct color variant of parent theme |
| `little-racer-var-2` | D — Variant | `kids-thematic` | `little-racer` | Direct color variant of parent theme |
| `blue-bear` | C — Near Duplicate | `kids-thematic` | `clouds-above` | Same layout (kids-thematic) with highly similar styling (fonts/colors/opening matches) |
| `blue-bear-var-1` | D — Variant | `kids-thematic` | `blue-bear` | Direct color variant of parent theme |
| `blue-bear-var-2` | D — Variant | `kids-thematic` | `blue-bear` | Direct color variant of parent theme |
| `pink-princess` | C — Near Duplicate | `kids-thematic` | `clouds-above` | Same layout (kids-thematic) with highly similar styling (fonts/colors/opening matches) |
| `pink-princess-var-1` | D — Variant | `kids-thematic` | `pink-princess` | Direct color variant of parent theme |
| `pink-princess-var-2` | D — Variant | `kids-thematic` | `pink-princess` | Direct color variant of parent theme |
| `velvet-henna` | A — Unique | `velvet-curtain` | — | Unique composition & style signature |
| `velvet-henna-var-1` | D — Variant | `velvet-curtain` | `velvet-henna` | Direct color variant of parent theme |
| `velvet-henna-var-2` | D — Variant | `velvet-curtain` | `velvet-henna` | Direct color variant of parent theme |
| `henna-velvet-bordo` | D — Variant | `velvet-curtain` | `velvet-henna` | Direct color variant of parent theme |
| `nazar-circumcision` | B — Related | `botanical-ceramic` | `mediterranean-ceramic-garden` | Shares layout (botanical-ceramic) but uses a different visual theme/configuration |
| `nazar-circumcision-var-1` | D — Variant | `botanical-ceramic` | `nazar-circumcision` | Direct color variant of parent theme |
| `nazar-circumcision-var-2` | D — Variant | `botanical-ceramic` | `nazar-circumcision` | Direct color variant of parent theme |
| `folded-tassel-linen` | A — Unique | `fabric-press` | — | Unique composition & style signature |
| `folded-tassel-linen-var-1` | D — Variant | `fabric-press` | `folded-tassel-linen` | Direct color variant of parent theme |
| `folded-tassel-linen-var-2` | D — Variant | `fabric-press` | `folded-tassel-linen` | Direct color variant of parent theme |
| `photo-luxury-emerald` | A — Unique | `photo-luxury` | — | Unique composition & style signature |
| `photo-luxury-emerald-var-1` | D — Variant | `photo-luxury` | `photo-luxury-emerald` | Direct color variant of parent theme |
| `photo-luxury-emerald-var-2` | D — Variant | `photo-luxury` | `photo-luxury-emerald` | Direct color variant of parent theme |
| `botanical-garden` | B — Related | `botanical-frame` | `fine-art-botanical-watercolor` | Shares layout (botanical-frame) but uses a different visual theme/configuration |
| `botanical-garden-var-1` | D — Variant | `botanical-frame` | `botanical-garden` | Direct color variant of parent theme |
| `botanical-garden-var-2` | D — Variant | `botanical-frame` | `botanical-garden` | Direct color variant of parent theme |
| `baby-girl-butterfly` | D — Variant | `botanical-frame` | `botanical-garden` | Direct color variant of parent theme |
| `giant-monogram-classic` | A — Unique | `monogram-media` | — | Unique composition & style signature |
| `giant-monogram-classic-var-1` | D — Variant | `monogram-media` | `giant-monogram-classic` | Direct color variant of parent theme |
| `giant-monogram-classic-var-2` | D — Variant | `monogram-media` | `giant-monogram-classic` | Direct color variant of parent theme |
| `modern-tech-event` | B — Related | `modern-event` | `future-summit` | Shares layout (modern-event) but uses a different visual theme/configuration |
| `modern-tech-event-var-1` | D — Variant | `modern-event` | `modern-tech-event` | Direct color variant of parent theme |
| `modern-tech-event-var-2` | D — Variant | `modern-event` | `modern-tech-event` | Direct color variant of parent theme |
| `graduation-ceremony` | B — Related | `modern-event` | `future-summit` | Shares layout (modern-event) but uses a different visual theme/configuration |
| `graduation-ceremony-var-1` | D — Variant | `modern-event` | `graduation-ceremony` | Direct color variant of parent theme |
| `graduation-ceremony-var-2` | D — Variant | `modern-event` | `graduation-ceremony` | Direct color variant of parent theme |
| `royal-black-tie` | A — Unique | `gala-night` | — | Unique composition & style signature |
| `royal-black-tie-var-1` | D — Variant | `gala-night` | `royal-black-tie` | Direct color variant of parent theme |
| `royal-black-tie-var-2` | D — Variant | `gala-night` | `royal-black-tie` | Direct color variant of parent theme |
| `rose-gold-romance` | B — Related | `botanical-frame` | `fine-art-botanical-watercolor` | Shares layout (botanical-frame) but uses a different visual theme/configuration |
| `rose-gold-romance-var-1` | D — Variant | `botanical-frame` | `rose-gold-romance` | Direct color variant of parent theme |
| `rose-gold-romance-var-2` | D — Variant | `botanical-frame` | `rose-gold-romance` | Direct color variant of parent theme |
| `parisian-ivory` | A — Unique | `parisian-apartment` | — | Unique composition & style signature |
| `parisian-ivory-var-1` | D — Variant | `parisian-apartment` | `parisian-ivory` | Direct color variant of parent theme |
| `parisian-ivory-var-2` | D — Variant | `parisian-apartment` | `parisian-ivory` | Direct color variant of parent theme |
| `bohemian-kraft-wedding` | A — Unique | `story-timeline` | — | Unique composition & style signature |
| `bohemian-kraft-wedding-var-1` | D — Variant | `story-timeline` | `bohemian-kraft-wedding` | Direct color variant of parent theme |
| `bohemian-kraft-wedding-var-2` | D — Variant | `story-timeline` | `bohemian-kraft-wedding` | Direct color variant of parent theme |
| `minimal-white-wedding` | B — Related | `swiss-grid` | `minimal-swiss-gallery` | Shares layout (swiss-grid) but uses a different visual theme/configuration |
| `minimal-white-wedding-var-1` | D — Variant | `swiss-grid` | `minimal-white-wedding` | Direct color variant of parent theme |
| `minimal-white-wedding-var-2` | D — Variant | `swiss-grid` | `minimal-white-wedding` | Direct color variant of parent theme |
| `luxury-marble-gold` | A — Unique | `marble-column` | — | Unique composition & style signature |
| `luxury-marble-gold-var-1` | D — Variant | `marble-column` | `luxury-marble-gold` | Direct color variant of parent theme |
| `luxury-marble-gold-var-2` | D — Variant | `marble-column` | `luxury-marble-gold` | Direct color variant of parent theme |
| `moonlight-wedding` | B — Related | `constellation-night` | `moonlit-secret-garden` | Shares layout (constellation-night) but uses a different visual theme/configuration |
| `moonlight-wedding-var-1` | D — Variant | `constellation-night` | `moonlight-wedding` | Direct color variant of parent theme |
| `moonlight-wedding-var-2` | D — Variant | `constellation-night` | `moonlight-wedding` | Direct color variant of parent theme |
| `garden-of-roses` | B — Related | `botanical-frame` | `fine-art-botanical-watercolor` | Shares layout (botanical-frame) but uses a different visual theme/configuration |
| `garden-of-roses-var-1` | D — Variant | `botanical-frame` | `garden-of-roses` | Direct color variant of parent theme |
| `garden-of-roses-var-2` | D — Variant | `botanical-frame` | `garden-of-roses` | Direct color variant of parent theme |
| `champagne-reception` | A — Unique | `cocktail-menu` | — | Unique composition & style signature |
| `champagne-reception-var-1` | D — Variant | `cocktail-menu` | `champagne-reception` | Direct color variant of parent theme |
| `champagne-reception-var-2` | D — Variant | `cocktail-menu` | `champagne-reception` | Direct color variant of parent theme |
| `classic-ivory-wedding` | A — Unique | `full-bleed` | — | Unique composition & style signature |
| `classic-ivory-wedding-var-1` | D — Variant | `full-bleed` | `classic-ivory-wedding` | Direct color variant of parent theme |
| `classic-ivory-wedding-var-2` | D — Variant | `full-bleed` | `classic-ivory-wedding` | Direct color variant of parent theme |
| `velvet-burgundy-night` | B — Related | `constellation-night` | `moonlit-secret-garden` | Shares layout (constellation-night) but uses a different visual theme/configuration |
| `velvet-burgundy-night-var-1` | D — Variant | `constellation-night` | `velvet-burgundy-night` | Direct color variant of parent theme |
| `velvet-burgundy-night-var-2` | D — Variant | `constellation-night` | `velvet-burgundy-night` | Direct color variant of parent theme |
| `wax-seal-royal` | B — Related | `royal-letter` | `royal-palace-invitation` | Shares layout (royal-letter) but uses a different visual theme/configuration |
| `wax-seal-royal-var-1` | D — Variant | `royal-letter` | `wax-seal-royal` | Direct color variant of parent theme |
| `wax-seal-royal-var-2` | D — Variant | `royal-letter` | `wax-seal-royal` | Direct color variant of parent theme |
| `henna-traditional` | A — Unique | `henna-tray` | — | Unique composition & style signature |
| `henna-traditional-var-1` | D — Variant | `henna-tray` | `henna-traditional` | Direct color variant of parent theme |
| `henna-traditional-var-2` | D — Variant | `henna-tray` | `henna-traditional` | Direct color variant of parent theme |
| `henna-candle` | A — Unique | `candle-corridor` | — | Unique composition & style signature |
| `henna-candle-var-1` | D — Variant | `candle-corridor` | `henna-candle` | Direct color variant of parent theme |
| `henna-candle-var-2` | D — Variant | `candle-corridor` | `henna-candle` | Direct color variant of parent theme |
| `henna-lace` | B — Related | `oriental-lace` | `ottoman-illumination` | Shares layout (oriental-lace) but uses a different visual theme/configuration |
| `henna-lace-var-1` | D — Variant | `oriental-lace` | `henna-lace` | Direct color variant of parent theme |
| `henna-lace-var-2` | D — Variant | `oriental-lace` | `henna-lace` | Direct color variant of parent theme |
| `henna-luxury-red` | A — Unique | `black-gala` | — | Unique composition & style signature |
| `henna-luxury-red-var-1` | D — Variant | `black-gala` | `henna-luxury-red` | Direct color variant of parent theme |
| `henna-luxury-red-var-2` | D — Variant | `black-gala` | `henna-luxury-red` | Direct color variant of parent theme |
| `circumcision-royal` | A — Unique | `prince-throne-room` | — | Unique composition & style signature |
| `circumcision-royal-var-1` | D — Variant | `prince-throne-room` | `circumcision-royal` | Direct color variant of parent theme |
| `circumcision-royal-var-2` | D — Variant | `prince-throne-room` | `circumcision-royal` | Direct color variant of parent theme |
| `circumcision-nazar` | A — Unique | `nazar-dome` | — | Unique composition & style signature |
| `circumcision-nazar-var-1` | D — Variant | `nazar-dome` | `circumcision-nazar` | Direct color variant of parent theme |
| `circumcision-nazar-var-2` | D — Variant | `nazar-dome` | `circumcision-nazar` | Direct color variant of parent theme |
| `circumcision-velvet` | A — Unique | `velvet-theater` | — | Unique composition & style signature |
| `circumcision-velvet-var-1` | D — Variant | `velvet-theater` | `circumcision-velvet` | Direct color variant of parent theme |
| `circumcision-velvet-var-2` | D — Variant | `velvet-theater` | `circumcision-velvet` | Direct color variant of parent theme |
| `circumcision-ottoman` | A — Unique | `ottoman-garden` | — | Unique composition & style signature |
| `circumcision-ottoman-var-1` | D — Variant | `ottoman-garden` | `circumcision-ottoman` | Direct color variant of parent theme |
| `circumcision-ottoman-var-2` | D — Variant | `ottoman-garden` | `circumcision-ottoman` | Direct color variant of parent theme |
| `circumcision-crown` | A — Unique | `crown-crest` | — | Unique composition & style signature |
| `circumcision-crown-var-1` | D — Variant | `crown-crest` | `circumcision-crown` | Direct color variant of parent theme |
| `circumcision-crown-var-2` | D — Variant | `crown-crest` | `circumcision-crown` | Direct color variant of parent theme |
| `circumcision-modern` | A — Unique | `modern-geometric-monogram` | — | Unique composition & style signature |
| `circumcision-modern-var-1` | D — Variant | `modern-geometric-monogram` | `circumcision-modern` | Direct color variant of parent theme |
| `circumcision-modern-var-2` | D — Variant | `modern-geometric-monogram` | `circumcision-modern` | Direct color variant of parent theme |
| `baby-girl-princess` | A — Unique | `fashion-editorial` | — | Unique composition & style signature |
| `baby-girl-princess-var-1` | D — Variant | `fashion-editorial` | `baby-girl-princess` | Direct color variant of parent theme |
| `baby-girl-princess-var-2` | D — Variant | `fashion-editorial` | `baby-girl-princess` | Direct color variant of parent theme |
| `baby-girl-fashion` | D — Variant | `fashion-editorial` | `baby-girl-princess` | Direct color variant of parent theme |
| `baby-girl-crown` | A — Unique | `crown-jewel-box` | — | Unique composition & style signature |
| `baby-girl-crown-var-1` | D — Variant | `crown-jewel-box` | `baby-girl-crown` | Direct color variant of parent theme |
| `baby-girl-crown-var-2` | D — Variant | `crown-jewel-box` | `baby-girl-crown` | Direct color variant of parent theme |
| `baby-girl-toy` | D — Variant | `crown-jewel-box` | `baby-girl-crown` | Direct color variant of parent theme |
| `baby-girl-clouds` | A — Unique | `storybook` | — | Unique composition & style signature |
| `baby-girl-clouds-var-1` | D — Variant | `storybook` | `baby-girl-clouds` | Direct color variant of parent theme |
| `baby-girl-clouds-var-2` | D — Variant | `storybook` | `baby-girl-clouds` | Direct color variant of parent theme |
| `baby-boy-racer` | B — Related | `kids-thematic` | `clouds-above` | Shares layout (kids-thematic) but uses a different visual theme/configuration |
| `baby-boy-racer-var-1` | D — Variant | `kids-thematic` | `baby-boy-racer` | Direct color variant of parent theme |
| `baby-boy-racer-var-2` | D — Variant | `kids-thematic` | `baby-boy-racer` | Direct color variant of parent theme |
| `baby-boy-bear` | D — Variant | `kids-thematic` | `baby-boy-racer` | Direct color variant of parent theme |
| `baby-boy-safari` | D — Variant | `kids-thematic` | `baby-boy-racer` | Direct color variant of parent theme |
| `baby-boy-sailor` | D — Variant | `kids-thematic` | `baby-boy-racer` | Direct color variant of parent theme |
| `baby-boy-clouds` | A — Unique | `hot-air-balloon` | — | Unique composition & style signature |
| `baby-boy-clouds-var-1` | D — Variant | `hot-air-balloon` | `baby-boy-clouds` | Direct color variant of parent theme |
| `baby-boy-clouds-var-2` | D — Variant | `hot-air-balloon` | `baby-boy-clouds` | Direct color variant of parent theme |
| `baby-boy-space` | B — Related | `kids-thematic` | `clouds-above` | Shares layout (kids-thematic) but uses a different visual theme/configuration |
| `baby-boy-space-var-1` | D — Variant | `kids-thematic` | `baby-boy-space` | Direct color variant of parent theme |
| `baby-boy-space-var-2` | D — Variant | `kids-thematic` | `baby-boy-space` | Direct color variant of parent theme |
| `engagement-blush` | A — Unique | `engagement-table` | — | Unique composition & style signature |
| `engagement-blush-var-1` | D — Variant | `engagement-table` | `engagement-blush` | Direct color variant of parent theme |
| `engagement-blush-var-2` | D — Variant | `engagement-table` | `engagement-blush` | Direct color variant of parent theme |
| `engagement-emerald` | A — Unique | `emerald-elegance` | — | Unique composition & style signature |
| `engagement-emerald-var-1` | D — Variant | `emerald-elegance` | `engagement-emerald` | Direct color variant of parent theme |
| `engagement-emerald-var-2` | D — Variant | `emerald-elegance` | `engagement-emerald` | Direct color variant of parent theme |
| `engagement-minimal` | A — Unique | `minimal-ceremony` | — | Unique composition & style signature |
| `engagement-minimal-var-1` | D — Variant | `minimal-ceremony` | `engagement-minimal` | Direct color variant of parent theme |
| `engagement-minimal-var-2` | D — Variant | `minimal-ceremony` | `engagement-minimal` | Direct color variant of parent theme |
| `engagement-family` | A — Unique | `floral-family` | — | Unique composition & style signature |
| `engagement-family-var-1` | D — Variant | `floral-family` | `engagement-family` | Direct color variant of parent theme |
| `engagement-family-var-2` | D — Variant | `floral-family` | `engagement-family` | Direct color variant of parent theme |
| `engagement-gold-frame` | A — Unique | `gold-frame-gallery` | — | Unique composition & style signature |
| `engagement-gold-frame-var-1` | D — Variant | `gold-frame-gallery` | `engagement-gold-frame` | Direct color variant of parent theme |
| `engagement-gold-frame-var-2` | D — Variant | `gold-frame-gallery` | `engagement-gold-frame` | Direct color variant of parent theme |
| `engagement-lavender` | A — Unique | `lavender-garden` | — | Unique composition & style signature |
| `engagement-lavender-var-1` | D — Variant | `lavender-garden` | `engagement-lavender` | Direct color variant of parent theme |
| `engagement-lavender-var-2` | D — Variant | `lavender-garden` | `engagement-lavender` | Direct color variant of parent theme |
| `modern-architecture` | B — Related | `modern-architecture` | `aurora-glass` | Shares layout (modern-architecture) but uses a different visual theme/configuration |
| `modern-architecture-var-1` | D — Variant | `modern-architecture` | `modern-architecture` | Direct color variant of parent theme |
| `modern-architecture-var-2` | D — Variant | `modern-architecture` | `modern-architecture` | Direct color variant of parent theme |
| `botanical-ceramic` | B — Related | `botanical-frame` | `fine-art-botanical-watercolor` | Shares layout (botanical-frame) but uses a different visual theme/configuration |
| `botanical-ceramic-var-1` | D — Variant | `botanical-frame` | `botanical-ceramic` | Direct color variant of parent theme |
| `botanical-ceramic-var-2` | D — Variant | `botanical-frame` | `botanical-ceramic` | Direct color variant of parent theme |
| `luxury-hotel` | B — Related | `photo-luxury` | `photo-luxury-emerald` | Shares layout (photo-luxury) but uses a different visual theme/configuration |
| `luxury-hotel-var-1` | D — Variant | `photo-luxury` | `luxury-hotel` | Direct color variant of parent theme |
| `luxury-hotel-var-2` | D — Variant | `photo-luxury` | `luxury-hotel` | Direct color variant of parent theme |
| `destination-boarding-pass` | B — Related | `full-bleed` | `classic-ivory-wedding` | Shares layout (full-bleed) but uses a different visual theme/configuration |
| `destination-boarding-pass-var-1` | D — Variant | `full-bleed` | `destination-boarding-pass` | Direct color variant of parent theme |
| `destination-boarding-pass-var-2` | D — Variant | `full-bleed` | `destination-boarding-pass` | Direct color variant of parent theme |
| `fashion-magazine` | B — Related | `full-bleed` | `classic-ivory-wedding` | Shares layout (full-bleed) but uses a different visual theme/configuration |
| `fashion-magazine-var-1` | D — Variant | `full-bleed` | `fashion-magazine` | Direct color variant of parent theme |
| `fashion-magazine-var-2` | D — Variant | `full-bleed` | `fashion-magazine` | Direct color variant of parent theme |
| `art-deco-theater` | B — Related | `full-bleed` | `classic-ivory-wedding` | Shares layout (full-bleed) but uses a different visual theme/configuration |
| `art-deco-theater-var-1` | D — Variant | `full-bleed` | `art-deco-theater` | Direct color variant of parent theme |
| `art-deco-theater-var-2` | D — Variant | `full-bleed` | `art-deco-theater` | Direct color variant of parent theme |
| `mediterranean-garden` | B — Related | `botanical-frame` | `fine-art-botanical-watercolor` | Shares layout (botanical-frame) but uses a different visual theme/configuration |
| `mediterranean-garden-var-1` | D — Variant | `botanical-frame` | `mediterranean-garden` | Direct color variant of parent theme |
| `mediterranean-garden-var-2` | D — Variant | `botanical-frame` | `mediterranean-garden` | Direct color variant of parent theme |
| `minimal-typographic` | A — Unique | `minimal-paper` | — | Unique composition & style signature |
| `minimal-typographic-var-1` | D — Variant | `minimal-paper` | `minimal-typographic` | Direct color variant of parent theme |
| `minimal-typographic-var-2` | D — Variant | `minimal-paper` | `minimal-typographic` | Direct color variant of parent theme |

---

## 3. Opening Animation Audit

Total Animation Components: **41** (38 files + 3 inline)

| Opening Type ID | Description / Concept | Associated Layouts | Status |
|-----------------|-----------------------|--------------------|--------|
| `parisianBlackTie` | Opening animation mapping | `parisian-black-tie` | Active |
| `grandOpera` | Opening animation mapping | `grand-opera-ballroom` | Active |
| `moonlitGarden` | Opening animation mapping | `moonlit-secret-garden` | Active |
| `vogueEditorial` | Opening animation mapping | `vogue-wedding-editorial` | Active |
| `mediterraneanCeramic` | Opening animation mapping | `mediterranean-ceramic-garden` | Active |
| `ottomanIllumination` | Opening animation mapping | `ottoman-illumination` | Active |
| `coastalSunset` | Opening animation mapping | `coastal-sunset` | Active |
| `auroraGlass` | Opening animation mapping | `aurora-glass` | Active |
| `botanicalWatercolor` | Opening animation mapping | `fine-art-botanical-watercolor` | Active |
| `filmPremiere` | Opening animation mapping | `film-premiere-night` | Active |
| `swissGallery` | Opening animation mapping | `minimal-swiss-gallery` | Active |
| `royalPalace` | Opening animation mapping | `royal-palace-invitation` | Active |
| `hennaPalace` | Opening animation mapping | `henna-palace-night` | Active |
| `princeCeremony` | Opening animation mapping | `prince-ceremony` | Active |
| `storybook` | Opening animation mapping | `storybook-babyshower`, `storybook-birthday` | Active |
| `futureSummit` | Opening animation mapping | `future-summit` | Active |
| `envelope` | Opening animation mapping | `cinematic-poster`, `red-carpet`, `gold-premiere` | Active |
| `minimalFade` | Opening animation mapping | `little-racer`, `little-racer-var-1`, `little-racer-var-2` | Active |
| `curtain` | Opening animation mapping | `velvet-henna`, `velvet-henna-var-1`, `velvet-henna-var-2` | Active |
| `royalHall` | Opening animation mapping | `nazar-circumcision`, `nazar-circumcision-var-1`, `nazar-circumcision-var-2` | Active |
| `book` | Opening animation mapping | `folded-tassel-linen`, `folded-tassel-linen-var-1`, `folded-tassel-linen-var-2` | Active |
| `door` | Opening animation mapping | `photo-luxury-emerald`, `photo-luxury-emerald-var-1`, `photo-luxury-emerald-var-2` | Active |
| `elevator` | Opening animation mapping | `modern-tech-event`, `modern-tech-event-var-1`, `modern-tech-event-var-2` | Active |
| `gardenGate` | Opening animation mapping | `bohemian-kraft-wedding`, `bohemian-kraft-wedding-var-1`, `bohemian-kraft-wedding-var-2` | Active |
| `starryNight` | Opening animation mapping | `moonlight-wedding`, `moonlight-wedding-var-1`, `moonlight-wedding-var-2` | Active |
| `luxuryBox` | Opening animation mapping | `champagne-reception`, `champagne-reception-var-1`, `champagne-reception-var-2` | Active |
| `slide-up` | Opening animation mapping | `modern-architecture`, `modern-architecture-var-1`, `modern-architecture-var-2` | Active |
| `botanicalBlossom` | Opening animation mapping | `botanical-ceramic`, `botanical-ceramic-var-1`, `botanical-ceramic-var-2` | Active |
| `fade-in` | Opening animation mapping | `luxury-hotel`, `luxury-hotel-var-1`, `luxury-hotel-var-2` | Active |
| `slide-left` | Opening animation mapping | `destination-boarding-pass`, `destination-boarding-pass-var-1`, `destination-boarding-pass-var-2` | Active |

---

## 4. Design & Strategy Gaps for Faz B

Based on the audit, here are the target areas to expand:

### MISSING_LAYOUT_FAMILIES
- **Horizontal Journey**: No horizontal layout exists yet.
- **Museum/Art Gallery**: No minimalist frame showcase exist.
- **Tarot/Mystical**: No mystic deck layouts.
- **Architectural Blueprint**: No blueprints or technical grid layouts.
- **Interactive Garden**: No active SVG drawing layouts.
- **Ancient Scroll/Manuscript**: No actual roll/unroll layouts.

### MISSING_VISUAL_LANGUAGES
- **Brutalist / Modernism**: Current designs are heavy on curves, gold leaf, and soft pastels. There are no raw grids or bold typography layouts except Swiss Grid.
- **Cyberpunk / Retro-Future**: No CRT scanlines, neon monospaced font sheets, or interactive terminal designs.
- **Folk / Traditional Miniature**: No actual watercolor miniature art representations.

### UNDERUSED_CATEGORIES
- **Kurumsal (1 ID)**: `future-summit`. Needs conference agendas, speaker lists, registration desks.
- **Minimal (1 ID)**: `minimal-swiss-gallery`. Needs clean spacing, type-first composition.
- **Kültürel (2 IDs)**: Only ottoman-illumination and henna-palace. Needs Seljuk, Cappadocia, Aegean, Mediterranean, and Persian designs.

### OVERUSED_COMBINATIONS
- **Lüks Category + Gold/Emerald/Velvet**: Over-indexing on gold foil, mühür (wax seal), and black/burgundy velvet cards.
- **Doğal Category + Cormorant Garamond/Glow**: Very repetitive serif + script font combinations with soft blurs.

### OPENING_GAPS
- No vertical accordion or folding panel animations.
- No actual scroll unrolling animation.
- No camera capture/deklanşör animation.

### SIGNATURE_MOMENT_GAPS
- Most layout files have basic dikey/vertical flows. There are no scroll-triggered interactive SVG paths, vertical translation elements (like balloons rising), or interactive envelope slide-outs.
