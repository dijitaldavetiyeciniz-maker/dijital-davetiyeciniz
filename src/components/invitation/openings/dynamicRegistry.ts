'use client';
import dynamic from 'next/dynamic';
import React from 'react';

/**
 * C13 W7 - Dynamic Opening Animation Renderer Registry
 * Lazy loads opening animation renderers on-demand.
 * When animation is 'none', ZERO renderer chunks are loaded.
 * When a specific animation is active, ONLY that single renderer chunk is requested.
 */
export const dynamicOpeningRegistry: Record<string, React.ComponentType<any>> = {
  envelope: dynamic(() => import('./EnvelopeOpening').then((m) => m.EnvelopeOpening), { ssr: false }),
  curtain: dynamic(() => import('./CurtainOpening').then((m) => m.CurtainOpening), { ssr: false }),
  door: dynamic(() => import('./DoorOpening').then((m) => m.DoorOpening), { ssr: false }),
  gardenGate: dynamic(() => import('./GardenGateOpening').then((m) => m.GardenGateOpening), { ssr: false }),
  book: dynamic(() => import('./BookOpening').then((m) => m.BookOpening), { ssr: false }),
  luxuryBox: dynamic(() => import('./LuxuryBoxOpening').then((m) => m.LuxuryBoxOpening), { ssr: false }),
  treasureChest: dynamic(() => import('./TreasureChestOpening').then((m) => m.TreasureChestOpening), { ssr: false }),
  glass: dynamic(() => import('./GlassRevealOpening').then((m) => m.GlassRevealOpening), { ssr: false }),
  mirror: dynamic(() => import('./MirrorRevealOpening').then((m) => m.MirrorRevealOpening), { ssr: false }),
  cinematicZoom: dynamic(() => import('./CinematicZoomOpening').then((m) => m.CinematicZoomOpening), { ssr: false }),
  spotlight: dynamic(() => import('./SpotlightOpening').then((m) => m.SpotlightOpening), { ssr: false }),
  starryNight: dynamic(() => import('./StarryNightOpening').then((m) => m.StarryNightOpening), { ssr: false }),
  elevator: dynamic(() => import('./ElevatorDoorOpening').then((m) => m.ElevatorDoorOpening), { ssr: false }),
  royalHall: dynamic(() => import('./RoyalHallOpening').then((m) => m.RoyalHallOpening), { ssr: false }),
  minimalFade: dynamic(() => import('./MinimalFadeOpening').then((m) => m.MinimalFadeOpening), { ssr: false }),
  cloudBaloon: dynamic(() => import('./CloudBaloonOpening').then((m) => m.CloudBaloonOpening), { ssr: false }),
  teddyBear: dynamic(() => import('./TeddyBearOpening').then((m) => m.TeddyBearOpening), { ssr: false }),
  cinematicFilm: dynamic(() => import('./CinematicFilmOpening').then((m) => m.CinematicFilmOpening), { ssr: false }),
  royalParchment: dynamic(() => import('./RoyalParchmentOpening').then((m) => m.RoyalParchmentOpening), { ssr: false }),
  botanicalBlossom: dynamic(() => import('./BotanicalBlossomOpening').then((m) => m.BotanicalBlossomOpening), { ssr: false }),
  hennaVelvetGate: dynamic(() => import('./HennaVelvetGateOpening').then((m) => m.HennaVelvetGateOpening), { ssr: false }),
  nazarDome: dynamic(() => import('./NazarDomeOpening').then((m) => m.NazarDomeOpening), { ssr: false }),
  parisianBlackTie: dynamic(() => import('./ParisianBlackTieOpening').then((m) => m.ParisianBlackTieOpening), { ssr: false }),
  grandOpera: dynamic(() => import('./GrandOperaOpening').then((m) => m.GrandOperaOpening), { ssr: false }),
  moonlitGarden: dynamic(() => import('./MoonlitGardenOpening').then((m) => m.MoonlitGardenOpening), { ssr: false }),
  vogueEditorial: dynamic(() => import('./VogueEditorialOpening').then((m) => m.VogueEditorialOpening), { ssr: false }),
  mediterraneanCeramic: dynamic(() => import('./MediterraneanCeramicOpening').then((m) => m.MediterraneanCeramicOpening), { ssr: false }),
  ottomanIllumination: dynamic(() => import('./OttomanIlluminationOpening').then((m) => m.OttomanIlluminationOpening), { ssr: false }),
  coastalSunset: dynamic(() => import('./CoastalSunsetOpening').then((m) => m.CoastalSunsetOpening), { ssr: false }),
  auroraGlass: dynamic(() => import('./AuroraGlassOpening').then((m) => m.AuroraGlassOpening), { ssr: false }),
  botanicalWatercolor: dynamic(() => import('./BotanicalWatercolorOpening').then((m) => m.BotanicalWatercolorOpening), { ssr: false }),
  filmPremiere: dynamic(() => import('./FilmPremiereOpening').then((m) => m.FilmPremiereOpening), { ssr: false }),
  swissGallery: dynamic(() => import('./SwissGalleryOpening').then((m) => m.SwissGalleryOpening), { ssr: false }),
  royalPalace: dynamic(() => import('./RoyalPalaceOpening').then((m) => m.RoyalPalaceOpening), { ssr: false }),
  hennaPalace: dynamic(() => import('./HennaPalaceOpening').then((m) => m.HennaPalaceOpening), { ssr: false }),
  princeCeremony: dynamic(() => import('./PrinceCeremonyOpening').then((m) => m.PrinceCeremonyOpening), { ssr: false }),
  storybook: dynamic(() => import('./StorybookOpening').then((m) => m.StorybookOpening), { ssr: false }),
  futureSummit: dynamic(() => import('./FutureSummitOpening').then((m) => m.FutureSummitOpening), { ssr: false }),
  'wax-seal-starfield': dynamic(() => import('./WaxSealStarfieldOpening').then((m) => m.WaxSealStarfieldOpening), { ssr: false }),
  waxSealStarfield: dynamic(() => import('./WaxSealStarfieldOpening').then((m) => m.WaxSealStarfieldOpening), { ssr: false }),
  'cinematic-car-journey': dynamic(() => import('./CinematicCarJourneyOpening').then((m) => m.CinematicCarJourneyOpening), { ssr: false }),
  'celestial-eclipse': dynamic(() => import('./CelestialEclipseOpening').then((m) => m.CelestialEclipseOpening), { ssr: false }),
  'golden-constellation': dynamic(() => import('./GoldenConstellationOpening').then((m) => m.GoldenConstellationOpening), { ssr: false }),
  'art-deco-doors': dynamic(() => import('./ArtDecoDoorsOpening').then((m) => m.ArtDecoDoorsOpening), { ssr: false }),
  'silk-fabric-reveal': dynamic(() => import('./SilkFabricRevealOpening').then((m) => m.SilkFabricRevealOpening), { ssr: false }),
  'luxury-jewelry-box': dynamic(() => import('./LuxuryJewelryBoxOpening').then((m) => m.LuxuryJewelryBoxOpening), { ssr: false }),
  'ocean-pearl-reveal': dynamic(() => import('./OceanPearlRevealOpening').then((m) => m.OceanPearlRevealOpening), { ssr: false }),
  'minimal-architectural-lines': dynamic(() => import('./MinimalArchitecturalLinesOpening').then((m) => m.MinimalArchitecturalLinesOpening), { ssr: false }),
  'ottoman-elegance': dynamic(() => import('./OttomanEleganceOpening').then((m) => m.OttomanEleganceOpening), { ssr: false }),
  'lantern-night': dynamic(() => import('./LanternNightOpening').then((m) => m.LanternNightOpening), { ssr: false }),
};
