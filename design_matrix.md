# Design Matrix — Template Expansion Blueprint

This document defines the visual contracts and design fingerprints for the template expansion. It acts as the source-of-truth for implementation.

## 1. Summary Metrics

- **Existing Unique Designs:** 48
- **Tier 1 (Locked) Planned Unique:** 90
- **Tier 2 (Stretch) Planned Unique:** 34
- **Total Planned Unique Designs:** 124
- **Projected Total Unique Designs:** 172
- **Tier 3 (Rejected/Merged) Ideas:** 16

---

## 2. Fingerprints & Visual Contracts

### TIER 1 — CORE / LOCKED (To reach 120 unique designs minimum target)

| Template ID | Category | Collection | Layout Family | Opening | Signature Moment | Diff Score | Status |
|-------------|----------|------------|---------------|---------|------------------|------------|--------|
| `celestial-kingdom` | Modern | Celestial / Fantasy | `Celestial Map` | `constellationDraw` | scroll-assemble-constellation | **10/10** | `LOCKED` |
| `moon-palace` | Karanlık | Celestial / Fantasy | `Cinematic Scroll` | `eclipseReveal` | scroll-lunar-phases-morph | **10/10** | `LOCKED` |
| `starlight-covenant` | Karanlık | Celestial / Fantasy | `Celestial Map` | `starryNight` | scroll-constellation-monogram | **6/10** | `LOCKED` |
| `eclipse-ceremony` | Karanlık | Celestial / Fantasy | `Cinematic Scroll` | `eclipseReveal` | scroll-eclipse-unfold | **10/10** | `LOCKED` |
| `aurora-dreamscape` | Doğal | Celestial / Fantasy | `Holographic Interface` | `auroraGlass` | scroll-aurora-shift | **7/10** | `LOCKED` |
| `cosmic-garden` | Doğal | Celestial / Fantasy | `Celestial Map` | `moonlitGarden` | scroll-blooming-constellation | **7/10** | `LOCKED` |
| `planetarium-romance` | Modern | Celestial / Fantasy | `Observatory` | `observatoryDome` | scroll-lens-focus-names | **10/10** | `IMPLEMENTED` |
| `enchanted-forest` | Doğal | Fairy Tale | `Pop-up Book` | `flowerBloom` | scroll-bloom-flowers-vines | **10/10** | `LOCKED` |
| `crystal-castle` | Lüks | Fairy Tale | `Pop-up Book` | `crystalShatter` | scroll-shatter-reveal-details | **10/10** | `LOCKED` |
| `secret-fairy-garden` | Doğal | Fairy Tale | `Pop-up Book` | `magicPortal` | scroll-fairy-dust-draw-path | **7/10** | `LOCKED` |
| `storybook-kingdom` | Klasik | Fairy Tale | `Story Chapters` | `origamiUnfold` | scroll-open-storybook-pages | **10/10** | `LOCKED` |
| `midnight-carriage` | Karanlık | Fairy Tale | `Cinematic Scroll` | `curtain` | scroll-carriage-moves | **10/10** | `LOCKED` |
| `floating-lantern-kingdom` | Doğal | Fairy Tale | `Cinematic Scroll` | `floatingLanterns` | scroll-lanterns-float-up | **10/10** | `LOCKED` |
| `enchanted-library` | Klasik | Fairy Tale | `Story Chapters` | `royalParchment` | scroll-bookshelf-reveal-chapters | **10/10** | `LOCKED` |
| `olympus-celebration` | Lüks | Mythological | `Museum Exhibition` | `royalPalace` | scroll-marble-pedestal-rise | **10/10** | `LOCKED` |
| `poseidon-palace` | Karanlık | Mythological | `Underwater Journey` | `curtain` | scroll-underwater-submerge | **10/10** | `LOCKED` |
| `aphrodite-garden` | Doğal | Mythological | `Museum Exhibition` | `botanicalBlossom` | scroll-seafoam-roses-reveal | **7/10** | `LOCKED` |
| `apollo-sun-temple` | Lüks | Mythological | `Museum Exhibition` | `spotlight` | scroll-sunbeams-illuminate-details | **7/10** | `LOCKED` |
| `artemis-moon-garden` | Karanlık | Mythological | `Celestial Map` | `moonlitGarden` | scroll-silver-arrow-trajectory | **7/10** | `LOCKED` |
| `atlantis-ceremony` | Karanlık | Mythological | `Underwater Journey` | `underwaterDive` | scroll-dive-atlantis-ruins | **6/10** | `IMPLEMENTED` |
| `surreal-cloud-palace` | Modern | Surreal / Artistic | `Vertical Spatial Journey` | `cloudBaloon` | scroll-floating-palace-rise | **10/10** | `LOCKED` |
| `infinite-staircase` | Modern | Surreal / Artistic | `Vertical Spatial Journey` | `elevator` | scroll-infinite-staircase-traverse | **10/10** | `LOCKED` |
| `dream-door` | Modern | Surreal / Artistic | `Vertical Spatial Journey` | `door` | scroll-door-opens-zoom | **10/10** | `LOCKED` |
| `mirror-world` | Modern | Surreal / Artistic | `Vertical Spatial Journey` | `mirror` | scroll-broken-mirror-reassemble | **10/10** | `LOCKED` |
| `melting-gold` | Lüks | Surreal / Artistic | `Vertical Spatial Journey` | `spotlight` | scroll-gold-drips-form-borders | **10/10** | `LOCKED` |
| `paper-moon` | Doğal | Surreal / Artistic | `Paper Cut Diorama` | `paperCutReveal` | scroll-shadowbox-depth-shift | **10/10** | `LOCKED` |
| `ink-and-gold` | Lüks | Surreal / Artistic | `Paper Cut Diorama` | `ottomanIllumination` | scroll-kintsugi-fractures-join | **10/10** | `LOCKED` |
| `seljuk-geometry` | Kültürel | Cultural | `Anatolian Grid` | `nazarDome` | scroll-assemble-seljuk-mosaic | **10/10** | `IMPLEMENTED` |
| `moroccan-riad` | Kültürel | Cultural | `Moroccan Riad Layout` | `door` | scroll-open-riad-double-doors | **10/10** | `LOCKED` |
| `persian-garden` | Kültürel | Cultural | `Persian Manuscript` | `ottomanIllumination` | scroll-illuminate-manuscript-colors | **10/10** | `LOCKED` |
| `japanese-zen-garden` | Kültürel | Cultural | `Japanese Shoji Page` | `japaneseShoji` | scroll-slide-shoji-panels | **10/10** | `LOCKED` |
| `turkish-tile-garden` | Kültürel | Cultural | `Anatolian Grid` | `nazarDome` | scroll-glazed-tile-reveal-sparkle | **6/10** | `LOCKED` |
| `cappadocia-sunset-balloon` | Kültürel | Cultural | `Vertical Balloon Journey` | `hotAirBalloonRise` | scroll-balloons-rise-up | **10/10** | `IMPLEMENTED` |
| `bosphorus-mansion` | Kültürel | Cultural | `Cinematic Scroll` | `coastalSunset` | scroll-bridge-ferry-drift | **10/10** | `IMPLEMENTED` |
| `moroccan-riad-henna-night` | Kültürel | Cultural | `Moroccan Henna Pavilion` | `candleLighting` | scroll-open-riad-doors-henna | **8/10** | `IMPLEMENTED` |
| `japanese-folding-screen-sakura` | Kültürel | Cultural | `Japanese Folding Screen` | `japaneseShoji` | scroll-unfold-gold-screen | **10/10** | `IMPLEMENTED` |
| `santorini-sunset-terrace` | Doğal | Destination | `Santorini Blue Split` | `coastalSunset` | scroll-bougainvillea-blooms | **10/10** | `LOCKED` |
| `amalfi-coast-lemons` | Doğal | Destination | `Santorini Blue Split` | `mediterraneanCeramic` | scroll-majolica-tile-reveal | **6/10** | `LOCKED` |
| `tuscany-vineyard-manor` | Doğal | Destination | `Vineyard Story Chapters` | `flowerBloom` | scroll-vineyard-depth-parallax | **10/10** | `LOCKED` |
| `provence-lavender-estate` | Doğal | Destination | `Vineyard Story Chapters` | `sakuraWind` | scroll-lavender-petals-scatter | **7/10** | `LOCKED` |
| `cotswolds-garden-estate` | Doğal | Destination | `English Rose Garden` | `castleGates` | scroll-grow-climbing-ivy | **9/10** | `LOCKED` |
| `swiss-alps-chalet` | Doğal | Destination | `Mountain Elevation Journey` | `castleGates` | scroll-chalet-snow-depth | **10/10** | `LOCKED` |
| `lake-como-grand-hotel` | Lüks | Destination | `Luxury Hotel Editorial` | `royalHall` | scroll-villa-arches-frame | **10/10** | `LOCKED` |
| `venice-canal-palazzo` | Lüks | Destination | `Horizontal Canal Journey` | `curtain` | scroll-gondola-slides-across-screen | **10/10** | `IMPLEMENTED` |
| `paris-eiffel-editorial` | Lüks | Destination | `Fashion Editorial` | `vogueEditorial` | scroll-haussmann-molding-slide | **10/10** | `LOCKED` |
| `cote-d-azur-yacht-club` | Lüks | Destination | `Riviera Yacht Club` | `minimalFade` | scroll-yacht-steers-compass | **9/10** | `LOCKED` |
| `bali-temple-garden` | Doğal | Destination | `Vineyard Story Chapters` | `origamiUnfold` | scroll-temple-gates-part | **7/10** | `LOCKED` |
| `safari-adventure-jungle` | Çocuk | Children | `Kids Adventure Map` | `cloudBalloon` | scroll-safari-jeep-drive-track | **9/10** | `LOCKED` |
| `underwater-kingdom-marine` | Çocuk | Children | `Underwater Journey` | `underwaterDive` | scroll-dive-submarine-ocean | **9/10** | `LOCKED` |
| `dinosaur-expedition-park` | Çocuk | Children | `Dino Excavation Site` | `minimalFade` | scroll-brush-reveals-fossils | **9/10** | `LOCKED` |
| `space-explorer-orbit` | Çocuk | Children | `Space Mission` | `rocketLaunch` | scroll-rocket-launch-orbit | **9/10** | `LOCKED` |
| `woodland-fairy-wonderland` | Çocuk | Children | `Story Chapters` | `storybook` | scroll-grow-fairy-mushrooms | **8/10** | `LOCKED` |
| `candy-kingdom-sweet` | Çocuk | Children | `Candy Conveyor Belt` | `cloudBalloon` | scroll-candy-machine-dispense | **8/10** | `LOCKED` |
| `circus-carnival-tent` | Çocuk | Children | `Theatre Program` | `curtain` | scroll-carousel-horses-rotate | **10/10** | `LOCKED` |
| `pirate-treasure-island` | Çocuk | Children | `Kids Adventure Map` | `treasureMap` | scroll-track-ship-treasure-x | **7/10** | `LOCKED` |
| `princess-garden-castle` | Çocuk | Children | `Princess Pop-up Book` | `storybook` | scroll-castle-towers-elevate | **7/10** | `LOCKED` |
| `little-prince-asteroid` | Çocuk | Children | `Space Mission` | `storybook` | scroll-prince-fly-birds | **8/10** | `LOCKED` |
| `circumcision-ottoman-prince` | Sünnet | Circumcision | `Anatolian Grid` | `ottomanIllumination` | scroll-unroll-ottoman-decree | **8/10** | `LOCKED` |
| `circumcision-modern-prince` | Sünnet | Circumcision | `Minimalist Grid` | `minimalFade` | scroll-minimal-golden-borders | **9/10** | `LOCKED` |
| `circumcision-sailor-captain` | Sünnet | Circumcision | `Horizontal Journey` | `cloudBalloon` | scroll-sailor-ship-sails | **10/10** | `LOCKED` |
| `circumcision-astronaut-boy` | Sünnet | Circumcision | `Space Mission` | `rocketLaunch` | scroll-rocket-launch-orbit | **7/10** | `LOCKED` |
| `circumcision-football-star` | Sünnet | Circumcision | `Horizontal Journey` | `spotlight` | scroll-kick-football-goal | **10/10** | `LOCKED` |
| `circumcision-race-car-champion` | Sünnet | Circumcision | `Horizontal Journey` | `minimalFade` | scroll-racecar-drives-track | **6/10** | `LOCKED` |
| `rooftop-celebration` | Nişan | Engagement / Henna | `Horizontal Journey` | `spotlight` | scroll-citylights-glow-names | **10/10** | `LOCKED` |
| `champagne-editorial` | Nişan | Engagement / Henna | `Fashion Editorial` | `vogueEditorial` | scroll-glasses-bubble-rise | **9/10** | `LOCKED` |
| `paris-apartment-chic` | Nişan | Engagement / Henna | `Fashion Editorial` | `parisianBlackTie` | scroll-iron-railings-fade-in | **6/10** | `LOCKED` |
| `cherry-blossom-engagement` | Nişan | Engagement / Henna | `Horizontal Journey` | `botanicalBlossom` | scroll-sakura-petals-shower | **10/10** | `LOCKED` |
| `mediterranean-terrace-engagement` | Nişan | Engagement / Henna | `Santorini Blue Split` | `mediterraneanCeramic` | scroll-bougainvillea-swirls | **6/10** | `LOCKED` |
| `bohemian-henna-night` | Kına Gecesi | Engagement / Henna | `Vineyard Story Chapters` | `flowerBloom` | scroll-pampas-sway-breeze | **10/10** | `LOCKED` |
| `anatolian-henna-night` | Kına Gecesi | Engagement / Henna | `Persian Manuscript` | `ottomanIllumination` | scroll-illuminate-anatolian-rug | **10/10** | `LOCKED` |
| `ai-summit-corporate` | Kurumsal | Corporate | `Holographic Interface` | `futureSummit` | scroll-animate-circuit-board-drawing | **8/10** | `IMPLEMENTED` |
| `medical-congress-clinical` | Kurumsal | Corporate | `Minimalist Grid` | `minimalFade` | scroll-draw-dna-double-helix | **10/10** | `LOCKED` |
| `startup-demo-day-pitch` | Kurumsal | Corporate | `Holographic Interface` | `futureSummit` | scroll-grow-charts-bar-reveal | **6/10** | `LOCKED` |
| `product-launch-automotive` | Kurumsal | Corporate | `Cinematic Scroll` | `spotlight` | scroll-gauges-spin-speed | **10/10** | `LOCKED` |
| `luxury-brand-launch` | Kurumsal | Corporate | `Fashion Editorial` | `vogueEditorial` | scroll-gold-perfume-drips | **10/10** | `LOCKED` |
| `architecture-conference-blueprint` | Kurumsal | Corporate | `Architectural Blueprint` | `minimalFade` | scroll-draw-building-schematics | **10/10** | `IMPLEMENTED` |
| `investor-night-financial` | Kurumsal | Corporate | `Minimalist Grid` | `royalHall` | scroll-gilded-borders-glow | **10/10** | `LOCKED` |
| `sustainability-summit-eco` | Kurumsal | Corporate | `Minimalist Grid` | `minimalFade` | scroll-reveal-green-globe | **6/10** | `LOCKED` |
| `versailles-gold-lux` | Lüks | Luxury Premium | `Royal Decree` | `royalPalace` | scroll-gold-scroll-unroll | **10/10** | `LOCKED` |
| `gatsby-art-deco-lux` | Lüks | Luxury Premium | `Gatsby Geometry` | `grandOpera` | scroll-art-deco-gates-part | **10/10** | `LOCKED` |
| `venetian-masquerade-lux` | Lüks | Luxury Premium | `Gatsby Geometry` | `curtain` | scroll-venetian-mask-reveal | **6/10** | `LOCKED` |
| `manhattan-black-tie-lux` | Lüks | Luxury Premium | `Gatsby Geometry` | `parisianBlackTie` | scroll-skyline-elevate | **8/10** | `LOCKED` |
| `luxury-perfume-launch-style` | Lüks | Luxury Premium | `Fashion Editorial` | `glassReveal` | scroll-light-beams-refract | **10/10** | `LOCKED` |
| `experimental-time-capsule` | Modern | Experimental | `Horizontal Journey` | `spotlight` | scroll-sandglass-empties | **6/10** | `LOCKED` |
| `experimental-parallel-universe` | Modern | Experimental | `Split Screen Layout` | `door` | scroll-split-panels-converge | **10/10** | `LOCKED` |
| `experimental-infinite-gallery` | Modern | Experimental | `Museum Exhibition` | `minimalFade` | scroll-art-frames-shift | **10/10** | `IMPLEMENTED` |
| `experimental-dream-elevator` | Modern | Experimental | `Vertical Spatial Journey` | `elevator` | scroll-indicator-rises-floors | **6/10** | `LOCKED` |
| `experimental-memory-museum` | Modern | Experimental | `Museum Exhibition` | `royalHall` | scroll-museum-domes-lift | **6/10** | `LOCKED` |
| `experimental-love-constellation` | Modern | Experimental | `Celestial Map` | `starryNight` | scroll-stars-draw-heart | **6/10** | `LOCKED` |
| `experimental-midnight-radio` | Karanlık | Experimental | `Obsidian Soundboard` | `spotlight` | scroll-radio-tuner-slider | **10/10** | `IMPLEMENTED` |

### TIER 2 — STRETCH (To reach 150 unique designs stretch target)

| Template ID | Category | Collection | Layout Family | Opening | Signature Moment | Diff Score | Status |
|-------------|----------|------------|---------------|---------|------------------|------------|--------|
| `galaxy-ballroom` | Lüks | Celestial / Fantasy | `Cinematic Scroll` | `royalHall` | scroll-galaxy-spin | **7/10** | `STRETCH` |
| `astral-cathedral` | Karanlık | Celestial / Fantasy | `Stained Glass` | `nazarDome` | scroll-illuminate-stained-glass | **10/10** | `STRETCH` |
| `starlight-canyon` | Doğal | Celestial / Fantasy | `Canyon Crevice Journey` | `minimalFade` | scroll-canyon-depth | **9/10** | `STRETCH` |
| `rose-castle` | Doğal | Fairy Tale | `Pop-up Book` | `flowerBloom` | scroll-unroll-rose-briar | **7/10** | `STRETCH` |
| `magic-mirror-ball` | Lüks | Fairy Tale | `Cinematic Scroll` | `mirror` | scroll-mirror-shimmer-clear | **10/10** | `STRETCH` |
| `whispering-forest` | Doğal | Fairy Tale | `Pop-up Book` | `castleGates` | scroll-leaves-blow-across | **7/10** | `STRETCH` |
| `phoenix-palace` | Karanlık | Mythological | `Cinematic Scroll` | `curtain` | scroll-ash-rises-gold-wings | **10/10** | `STRETCH` |
| `pegasus-sky` | Doğal | Mythological | `Celestial Map` | `starryNight` | scroll-pegasus-flight-parallax | **6/10** | `STRETCH` |
| `medusa-marble` | Karanlık | Mythological | `Museum Exhibition` | `royalPalace` | scroll-snake-coils-slither | **6/10** | `STRETCH` |
| `oracle-of-delphi` | Karanlık | Mythological | `Observatory` | `spotlight` | scroll-smoke-clears-reveal-text | **6/10** | `STRETCH` |
| `watercolor-dream` | Doğal | Surreal / Artistic | `Paper Cut Diorama` | `botanicalWatercolor` | scroll-ink-bleeds-in | **7/10** | `STRETCH` |
| `origami-world` | Minimalist | Surreal / Artistic | `Paper Cut Diorama` | `origamiUnfold` | scroll-origami-crane-flaps | **9/10** | `STRETCH` |
| `glass-garden` | Modern | Surreal / Artistic | `Vertical Spatial Journey` | `glassReveal` | scroll-clear-foggy-glass | **7/10** | `STRETCH` |
| `persian-miniature-concept` | Kültürel | Cultural | `Ancient Scroll` | `royalParchment` | scroll-unroll-manuscript-horizontal | **10/10** | `IMPLEMENTED` |
| `korean-hanok-traditional` | Kültürel | Cultural | `Korean Hanok Page` | `door` | scroll-slide-hanji-windows | **8/10** | `IMPLEMENTED` |
| `andalusian-palace-alhambra` | Kültürel | Cultural | `Alhambra Court of Myrtles` | `waterWave` | scroll-reflection-pool-refract | **9/10** | `IMPLEMENTED` |
| `mughal-garden-taj` | Kültürel | Cultural | `Taj Mahal Fountain` | `mirror` | scroll-reflection-water-channel | **8/10** | `IMPLEMENTED` |
| `scandinavian-forest-nordic` | Doğal | Cultural | `Minimalist Grid` | `minimalFade` | scroll-minimal-line-drawing | **10/10** | `STRETCH` |
| `alpine-lodge-woodlands` | Doğal | Cultural | `Cinematic Scroll` | `castleGates` | scroll-snowflakes-drift-down | **10/10** | `STRETCH` |
| `maldives-overwater-sunset` | Doğal | Destination | `Ocean Bungalow Navigation` | `underwaterDive` | scroll-dive-into-lagoon | **8/10** | `STRETCH` |
| `toy-train-railway` | Çocuk | Children | `Horizontal Journey` | `cloudBalloon` | scroll-train-moves-along-track | **10/10** | `STRETCH` |
| `farm-adventure-animals` | Çocuk | Children | `Barnyard Landscape` | `cloudBalloon` | scroll-tractor-crosses-pasture | **7/10** | `STRETCH` |
| `circumcision-aviation-pilot` | Sünnet | Circumcision | `Horizontal Journey` | `cloudBalloon` | scroll-biplane-flies-clouds | **6/10** | `STRETCH` |
| `circumcision-bosphorus-prince` | Sünnet | Circumcision | `Anatolian Grid` | `nazarDome` | scroll-reveal-maiden-tower | **8/10** | `STRETCH` |
| `circumcision-seljuk-prince` | Sünnet | Circumcision | `Anatolian Grid` | `nazarDome` | scroll-assemble-seljuk-eagle | **8/10** | `STRETCH` |
| `circumcision-adventure-map` | Sünnet | Circumcision | `Kids Adventure Map` | `origamiUnfold` | scroll-trail-draws-x | **9/10** | `STRETCH` |
| `candle-courtyard-henna` | Kına Gecesi | Engagement / Henna | `Cinematic Scroll` | `curtain` | scroll-light-candles-row | **10/10** | `STRETCH` |
| `moonlit-henna-garden-celebration` | Kına Gecesi | Engagement / Henna | `Celestial Map` | `moonlitGarden` | scroll-sparkles-lantern-illuminate | **8/10** | `STRETCH` |
| `creative-festival-experimental` | Kurumsal | Corporate | `Holographic Interface` | `spotlight` | scroll-distorted-poster-morph | **9/10** | `STRETCH` |
| `biotech-congress-microscopic` | Kurumsal | Corporate | `Holographic Interface` | `futureSummit` | scroll-cell-splitting-animation | **7/10** | `STRETCH` |
| `regal-dynasty-lux` | Lüks | Luxury Premium | `Royal Decree` | `royalHall` | scroll-banners-unfurl | **7/10** | `STRETCH` |
| `vanderbilt-estate-lux` | Lüks | Luxury Premium | `Royal Decree` | `castleGates` | scroll-estate-gates-part | **7/10** | `STRETCH` |
| `experimental-analog-television` | Karanlık | Experimental | `Obsidian Soundboard` | `minimalFade` | scroll-television-dials-turn | **8/10** | `STRETCH` |
| `experimental-secret-agent` | Karanlık | Experimental | `Obsidian Soundboard` | `origamiUnfold` | scroll-unseal-classified-doc | **10/10** | `STRETCH` |

---

## 3. Detailed Fingerprint Attributes (Sample Preview)

Here are the detailed design signatures for key planned templates:


### `celestial-kingdom` — Celestial Kingdom
- **Category:** Modern
- **Collection:** Celestial / Fantasy
- **Layout Family:** Celestial Map
- **Hero Composition:** constellation-title
- **Visual Language:** astronomy-midnight-gold
- **Typography:** Cinzel + Montserrat
- **Background Type:** deep-space-milkyway
- **Photo Treatment:** silhouette
- **Decorative Language:** constellation-drawings
- **Content Flow:** vertical-spatial
- **Opening Animation:** constellationDraw (`observatory` family)
- **Motion Language:** cosmic-float
- **Signature Moment:** scroll-assemble-constellation
- **Difference Score:** 10/10 (Compared to `None`)
- **Key Differences:** layout, hero, typography, background, photoTreatment, opening, motionLanguage, decorativeLanguage, contentFlow, culturalIdentity
- **Status:** `LOCKED`

### `moon-palace` — Moon Palace
- **Category:** Karanlık
- **Collection:** Celestial / Fantasy
- **Layout Family:** Cinematic Scroll
- **Hero Composition:** palace-moon-silhouette
- **Visual Language:** midnight-silver-aurora
- **Typography:** Bodoni Moda + Inter
- **Background Type:** dark-lunar-surface
- **Photo Treatment:** window-reflection
- **Decorative Language:** lunar-phases
- **Content Flow:** vertical-parallax
- **Opening Animation:** eclipseReveal (`eclipse` family)
- **Motion Language:** slow-orbit
- **Signature Moment:** scroll-lunar-phases-morph
- **Difference Score:** 10/10 (Compared to `None`)
- **Key Differences:** layout, hero, typography, background, photoTreatment, opening, motionLanguage, decorativeLanguage, contentFlow
- **Status:** `LOCKED`

### `starlight-covenant` — Starlight Covenant
- **Category:** Karanlık
- **Collection:** Celestial / Fantasy
- **Layout Family:** Celestial Map
- **Hero Composition:** astral-sphere
- **Visual Language:** nebula-gold-dust
- **Typography:** Cormorant + DM Sans
- **Background Type:** space-nebula-violet
- **Photo Treatment:** projection
- **Decorative Language:** glowing-stars
- **Content Flow:** vertical-scroll-stars
- **Opening Animation:** starryNight (`starryNight` family)
- **Motion Language:** star-shimmer
- **Signature Moment:** scroll-constellation-monogram
- **Difference Score:** 6/10 (Compared to `constellation-night`)
- **Key Differences:** hero, background, photoTreatment, decorativeLanguage, motionLanguage, opening
- **Status:** `LOCKED`

### `eclipse-ceremony` — Eclipse Ceremony
- **Category:** Karanlık
- **Collection:** Celestial / Fantasy
- **Layout Family:** Cinematic Scroll
- **Hero Composition:** eclipse-sun-corona
- **Visual Language:** high-contrast-monochrome-gold
- **Typography:** Syncopate + Roboto
- **Background Type:** pitch-black-matte
- **Photo Treatment:** high-contrast-shadow
- **Decorative Language:** solar-corona
- **Content Flow:** vertical-fade
- **Opening Animation:** eclipseReveal (`eclipse` family)
- **Motion Language:** shadow-transition
- **Signature Moment:** scroll-eclipse-unfold
- **Difference Score:** 10/10 (Compared to `None`)
- **Key Differences:** layout, hero, typography, background, photoTreatment, opening, motionLanguage, decorativeLanguage, contentFlow
- **Status:** `LOCKED`

### `aurora-dreamscape` — Aurora Dreamscape
- **Category:** Doğal
- **Collection:** Celestial / Fantasy
- **Layout Family:** Holographic Interface
- **Hero Composition:** frosted-glass-hud
- **Visual Language:** aurora-borealis-neon
- **Typography:** Outfit + Plus Jakarta Sans
- **Background Type:** glowing-gradient-waves
- **Photo Treatment:** blurred-atmospheric
- **Decorative Language:** vector-waves
- **Content Flow:** vertical-blend
- **Opening Animation:** auroraGlass (`auroraGlass` family)
- **Motion Language:** liquid-flow
- **Signature Moment:** scroll-aurora-shift
- **Difference Score:** 7/10 (Compared to `aurora-glass`)
- **Key Differences:** layout, hero, typography, background, photoTreatment, motionLanguage, contentFlow
- **Status:** `LOCKED`

### `cosmic-garden` — Cosmic Garden
- **Category:** Doğal
- **Collection:** Celestial / Fantasy
- **Layout Family:** Celestial Map
- **Hero Composition:** florals-in-orbit
- **Visual Language:** cosmic-violet-rose-gold
- **Typography:** Cinzel Decorative + Inter
- **Background Type:** nebula-dust-garden
- **Photo Treatment:** masked-portrait
- **Decorative Language:** celestial-vines
- **Content Flow:** vertical-spatial
- **Opening Animation:** moonlitGarden (`moonlitGarden` family)
- **Motion Language:** orbit-drift
- **Signature Moment:** scroll-blooming-constellation
- **Difference Score:** 7/10 (Compared to `moonlit-secret-garden`)
- **Key Differences:** layout, hero, background, photoTreatment, decorativeLanguage, motionLanguage, contentFlow
- **Status:** `LOCKED`

### `galaxy-ballroom` — Galaxy Ballroom
- **Category:** Lüks
- **Collection:** Celestial / Fantasy
- **Layout Family:** Cinematic Scroll
- **Hero Composition:** spiral-galaxy-medallion
- **Visual Language:** royal-navy-gold-sparkle
- **Typography:** Playfair Display + Montserrat
- **Background Type:** dark-navy-starry-velvet
- **Photo Treatment:** gold-edge-portrait
- **Decorative Language:** spiral-galaxies
- **Content Flow:** vertical-parallax
- **Opening Animation:** royalHall (`royalHall` family)
- **Motion Language:** glitter-shimmer
- **Signature Moment:** scroll-galaxy-spin
- **Difference Score:** 7/10 (Compared to `constellation-night`)
- **Key Differences:** layout, hero, background, photoTreatment, opening, motionLanguage, decorativeLanguage
- **Status:** `STRETCH`

### `astral-cathedral` — Astral Cathedral
- **Category:** Karanlık
- **Collection:** Celestial / Fantasy
- **Layout Family:** Stained Glass
- **Hero Composition:** cathedral-arch-stars
- **Visual Language:** deep-blue-gold-emerald
- **Typography:** Cinzel + Cormorant
- **Background Type:** glowing-stained-glass
- **Photo Treatment:** mosaic
- **Decorative Language:** gothic-archway-geometry
- **Content Flow:** vertical-spatial
- **Opening Animation:** nazarDome (`nazarDome` family)
- **Motion Language:** ray-cast
- **Signature Moment:** scroll-illuminate-stained-glass
- **Difference Score:** 10/10 (Compared to `None`)
- **Key Differences:** layout, hero, typography, background, photoTreatment, opening, motionLanguage, decorativeLanguage, contentFlow, culturalIdentity
- **Status:** `STRETCH`

### `planetarium-romance` — Planetarium Romance
- **Category:** Modern
- **Collection:** Celestial / Fantasy
- **Layout Family:** Observatory
- **Hero Composition:** telescope-viewfinder
- **Visual Language:** navy-indigo-brass
- **Typography:** Space Grotesk + Inter
- **Background Type:** dome-constellation-chart
- **Photo Treatment:** circular-portrait
- **Decorative Language:** measurement-grids
- **Content Flow:** vertical-spatial
- **Opening Animation:** observatoryDome (`observatory` family)
- **Motion Language:** viewfinder-focus
- **Signature Moment:** scroll-lens-focus-names
- **Difference Score:** 10/10 (Compared to `None`)
- **Key Differences:** layout, hero, typography, background, photoTreatment, opening, motionLanguage, decorativeLanguage, contentFlow
- **Status:** `IMPLEMENTED`

### `starlight-canyon` — Starlight Canyon
- **Category:** Doğal
- **Collection:** Celestial / Fantasy
- **Layout Family:** Canyon Crevice Journey
- **Hero Composition:** canyon-rock-arch-sky
- **Visual Language:** terracotta-warm-indigo-modern
- **Typography:** Space Grotesk + Inter
- **Background Type:** night-canyon-milkyway-dark
- **Photo Treatment:** parallax-depth-layer
- **Decorative Language:** organic-rock-shapes
- **Content Flow:** horizontal-scroll-canyon
- **Opening Animation:** minimalFade (`minimalFade` family)
- **Motion Language:** parallax-rise-horizontal
- **Signature Moment:** scroll-canyon-depth
- **Difference Score:** 9/10 (Compared to `coastal-sunset`)
- **Key Differences:** layout, hero, typography, background, photoTreatment, opening, motionLanguage, contentFlow, decorativeLanguage
- **Status:** `STRETCH`

### `enchanted-forest` — Enchanted Forest
- **Category:** Doğal
- **Collection:** Fairy Tale
- **Layout Family:** Pop-up Book
- **Hero Composition:** forest-archway-vines
- **Visual Language:** moss-green-gold-rose
- **Typography:** Italiana + Cormorant Garamond
- **Background Type:** watercolor-woods-paper
- **Photo Treatment:** torn-paper
- **Decorative Language:** fairies-and-mushrooms
- **Content Flow:** vertical-unfold
- **Opening Animation:** flowerBloom (`flowerBloom` family)
- **Motion Language:** organic-unfold
- **Signature Moment:** scroll-bloom-flowers-vines
- **Difference Score:** 10/10 (Compared to `None`)
- **Key Differences:** layout, hero, typography, background, photoTreatment, opening, motionLanguage, decorativeLanguage, contentFlow, culturalIdentity
- **Status:** `LOCKED`

### `crystal-castle` — Crystal Castle
- **Category:** Lüks
- **Collection:** Fairy Tale
- **Layout Family:** Pop-up Book
- **Hero Composition:** glass-castle-spires
- **Visual Language:** crystal-white-silver-blue
- **Typography:** Pinyon Script + Cormorant
- **Background Type:** translucent-geometric-glass
- **Photo Treatment:** reflection
- **Decorative Language:** crystal-stars
- **Content Flow:** vertical-spatial
- **Opening Animation:** crystalShatter (`crystalShatter` family)
- **Motion Language:** crystalline-shimmer
- **Signature Moment:** scroll-shatter-reveal-details
- **Difference Score:** 10/10 (Compared to `None`)
- **Key Differences:** layout, hero, typography, background, photoTreatment, opening, motionLanguage, decorativeLanguage, contentFlow
- **Status:** `LOCKED`

### `secret-fairy-garden` — Secret Fairy Garden
- **Category:** Doğal
- **Collection:** Fairy Tale
- **Layout Family:** Pop-up Book
- **Hero Composition:** hidden-stone-gate
- **Visual Language:** pastel-pink-mint-gold
- **Typography:** Playfair Display + Inter
- **Background Type:** watercolor-garden-mist
- **Photo Treatment:** polaroid
- **Decorative Language:** fairy-dust-trails
- **Content Flow:** vertical-spatial
- **Opening Animation:** magicPortal (`magicPortal` family)
- **Motion Language:** gentle-float
- **Signature Moment:** scroll-fairy-dust-draw-path
- **Difference Score:** 7/10 (Compared to `enchanted-forest`)
- **Key Differences:** hero, visualLanguage, background, photoTreatment, decorativeLanguage, motionLanguage, opening
- **Status:** `LOCKED`

### `storybook-kingdom` — Storybook Kingdom
- **Category:** Klasik
- **Collection:** Fairy Tale
- **Layout Family:** Story Chapters
- **Hero Composition:** parchment-castle-seal
- **Visual Language:** royal-burgundy-gold-vellum
- **Typography:** Cinzel + Cormorant Garamond
- **Background Type:** aged-parchment-texture
- **Photo Treatment:** torn-paper
- **Decorative Language:** heraldic-animals
- **Content Flow:** vertical-unfold
- **Opening Animation:** origamiUnfold (`origamiUnfold` family)
- **Motion Language:** page-flip
- **Signature Moment:** scroll-open-storybook-pages
- **Difference Score:** 10/10 (Compared to `storybook-babyshower`)
- **Key Differences:** layout, hero, visualLanguage, background, photoTreatment, opening, motionLanguage, decorativeLanguage, contentFlow, culturalIdentity
- **Status:** `LOCKED`

### `midnight-carriage` — Midnight Carriage
- **Category:** Karanlık
- **Collection:** Fairy Tale
- **Layout Family:** Cinematic Scroll
- **Hero Composition:** pumpkin-carriage-gold
- **Visual Language:** midnight-blue-gold-glow
- **Typography:** Cinzel Decorative + Inter
- **Background Type:** dark-forest-night-sky
- **Photo Treatment:** silhouette
- **Decorative Language:** clock-striking-twelve
- **Content Flow:** vertical-parallax
- **Opening Animation:** curtain (`curtain` family)
- **Motion Language:** carriage-ride
- **Signature Moment:** scroll-carriage-moves
- **Difference Score:** 10/10 (Compared to `None`)
- **Key Differences:** layout, hero, typography, background, photoTreatment, opening, motionLanguage, decorativeLanguage, contentFlow, culturalIdentity
- **Status:** `LOCKED`

---

## 4. TIER 3 — REJECTED / MERGED IDEAS

These ideas were evaluated but rejected or merged to prevent catalog bloating and duplicate code layouts.

| Template ID | Category | Original Name | Reason for Rejection / Merging |
|-------------|----------|---------------|--------------------------------|
| `cappadocia-valley-baloons` | Destination | Cappadocia Valley Balloons | Merged with cappadocia-sunset-balloon. Avoids code layout duplicates. |
| `istanbul-ferry-bosphorus` | Destination | Istanbul Ferry Bosphorus | Merged with bosphorus-mansion. Ferry ride concept unified under the main yalı/Bosphorus design. |
| `kyoto-sakura-shrine` | Destination | Kyoto Sakura Shrine | Merged with japanese-folding-screen-sakura to avoid layout screen duplication. |
| `ocean-explorer-submarine` | Children | Ocean Explorer Submarine | Merged with underwater-kingdom-marine to avoid duplicating underwater diver cartoon grids. |
| `moroccan-riad-henna-pavilion` | Henna | Moroccan Riad Henna Pavilion | Merged with moroccan-riad-henna-night to avoid redundant courtyard/mosaic code duplication. |
| `experimental-architects-blueprint` | Minimalist | Architects Blueprint | Merged with architecture-conference-blueprint as both represented architectural drafts. |
| `cappadocia-balloon-duplicate` | Destination | Cappadocia Balloon | Duplicate of cappadocia-sunset-balloon. Concepts merged to avoid creating layout copies with minor color changes. |
| `moroccan-riad-henna-duplicate` | Henna | Moroccan Riad Henna | Merged with moroccan-riad-henna-night to avoid catalog bloating with redundant layouts. |
| `pink-princess-var-3` | Children | Pink Princess Var 3 | Rejected. Violates rule of no cosmetic variants as distinct unique templates. |
| `climbing-rose-estate` | Destination | Climbing Rose Estate | Merged with cotswolds-garden-estate. Both relied on climbing roses and brick walls in England. |
| `minimal-swiss-white-gallery` | Minimal | Swiss White Gallery | Duplicate of minimal-swiss-gallery. Merged to keep gallery clean and unified. |
| `stars-only-fantasy` | Fantasy | Stars Only Fantasy | Rejected. Too simple (dark background + stars). Fails unique visual signature threshold. |
| `baby-boy-bear-duplicate` | Children | Baby Boy Bear duplicate | Merged with baby-boy-bear colorVariant of clouds-above. |
| `autumn-tuscany` | Destination | Autumn Tuscany | Merged with tuscany-vineyard-manor. Autumn variation is handled as a backgroundDesign selection. |
| `ai-summit-dark-mode` | Corporate | AI Summit Dark Mode | Rejected. Standard dark mode variant of ai-summit-corporate, not a unique design family. |
| `circumcision-taç-tekrar` | Circumcision | Circumcision Crown duplicate | Rejected. Same crown icon over a slightly changed gold texture. Violates crown icon reuse constraint. |
