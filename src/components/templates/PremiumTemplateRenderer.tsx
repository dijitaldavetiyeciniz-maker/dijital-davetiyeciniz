'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Sparkles, Calendar, MapPin, Navigation, 
  Heart, Crown, Feather, Infinity, Leaf, Camera, Loader2 
} from 'lucide-react';
import CountdownTimer from '../CountdownTimer';
import RsvpModal from '../RsvpModal';
import { isColorLight, getContrastRatio, getReadableTextColor } from '@/lib/colorUtils';
import { getBackgroundStyle, isBackgroundLight } from '@/lib/backgrounds';
import { supabase } from '@/lib/supabase';
import { predefinedThemes } from '@/lib/themes';
import BackgroundAnimation from '../BackgroundAnimation';
import { backgroundDesignRegistry } from '@/lib/registries';
const FoldedSealLayout = dynamic(() => import('./layouts/FoldedSealLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const GiantMonogramLayout = dynamic(() => import('./layouts/GiantMonogramLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const PhotoLuxuryLayout = dynamic(() => import('./layouts/PhotoLuxuryLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const BotanicalFrameLayout = dynamic(() => import('./layouts/BotanicalFrameLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const KidsThematicLayout = dynamic(() => import('./layouts/KidsThematicLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const HennaVelvetLayout = dynamic(() => import('./layouts/HennaVelvetLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const RoyalCircumcisionLayout = dynamic(() => import('./layouts/RoyalCircumcisionLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const MinimalPaperLayout = dynamic(() => import('./layouts/MinimalPaperLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const MagazineEditorialLayout = dynamic(() => import('./layouts/MagazineEditorialLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const FullBleedPhotoLayout = dynamic(() => import('./layouts/FullBleedPhotoLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const SplitScreenLayout = dynamic(() => import('./layouts/SplitScreenLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const StoryTimelineLayout = dynamic(() => import('./layouts/StoryTimelineLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ModernEventLayout = dynamic(() => import('./layouts/ModernEventLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const CinematicPosterLayout = dynamic(() => import('./layouts/CinematicPosterLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const RoyalLetterLayout = dynamic(() => import('./layouts/RoyalLetterLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const PolaroidStoryLayout = dynamic(() => import('./layouts/PolaroidStoryLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ConstellationNightLayout = dynamic(() => import('./layouts/ConstellationNightLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ModernArchitectureLayout = dynamic(() => import('./layouts/ModernArchitectureLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const BotanicalCeramicLayout = dynamic(() => import('./layouts/BotanicalCeramicLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const LuxuryHotelLayout = dynamic(() => import('./layouts/LuxuryHotelLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const DestinationBoardingPassLayout = dynamic(() => import('./layouts/DestinationBoardingPassLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const FashionMagazineLayout = dynamic(() => import('./layouts/FashionMagazineLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ArtDecoTheaterLayout = dynamic(() => import('./layouts/ArtDecoTheaterLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const MediterraneanGardenLayout = dynamic(() => import('./layouts/MediterraneanGardenLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const MinimalTypographicLayout = dynamic(() => import('./layouts/MinimalTypographicLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ParisianApartmentLayout = dynamic(() => import('./layouts/ParisianApartmentLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const SwissGridCeremonyLayout = dynamic(() => import('./layouts/SwissGridCeremonyLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const CocktailMenuLayout = dynamic(() => import('./layouts/CocktailMenuLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const FabricPressLayout = dynamic(() => import('./layouts/FabricPressLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const MarbleColumnLayout = dynamic(() => import('./layouts/MarbleColumnLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const GalaNightLayout = dynamic(() => import('./layouts/GalaNightLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const VelvetCurtainLayout = dynamic(() => import('./layouts/VelvetCurtainLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const HennaTrayLayout = dynamic(() => import('./layouts/HennaTrayLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const CandleCorridorLayout = dynamic(() => import('./layouts/CandleCorridorLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const OrientalLaceLayout = dynamic(() => import('./layouts/OrientalLaceLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const PrinceThroneRoomLayout = dynamic(() => import('./layouts/PrinceThroneRoomLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const NazarDomeLayout = dynamic(() => import('./layouts/NazarDomeLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const VelvetTheaterLayout = dynamic(() => import('./layouts/VelvetTheaterLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const OttomanGardenLayout = dynamic(() => import('./layouts/OttomanGardenLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const CrownCrestLayout = dynamic(() => import('./layouts/CrownCrestLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ModernGeometricMonogramLayout = dynamic(() => import('./layouts/ModernGeometricMonogramLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const FashionEditorialLayout = dynamic(() => import('./layouts/FashionEditorialLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const FairyTalePalaceLayout = dynamic(() => import('./layouts/FairyTalePalaceLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const CrownJewelBoxLayout = dynamic(() => import('./layouts/CrownJewelBoxLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const StorybookLayout = dynamic(() => import('./layouts/StorybookLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const HotAirBalloonLayout = dynamic(() => import('./layouts/HotAirBalloonLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const EngagementTableLayout = dynamic(() => import('./layouts/EngagementTableLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const CinematicGardenJourneyLayout = dynamic(() => import('./layouts/CinematicGardenJourneyLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const BlackTieCinemaLayout = dynamic(() => import('./layouts/BlackTieCinemaLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const CelestialJourneyLayout = dynamic(() => import('./layouts/CelestialJourneyLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const DestinationFilmLayout = dynamic(() => import('./layouts/DestinationFilmLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const StorybookDreamLayout = dynamic(() => import('./layouts/StorybookDreamLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const BosphorusMansionLayout = dynamic(() => import('./layouts/BosphorusMansionLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const MoroccanRiadLayout = dynamic(() => import('./layouts/MoroccanRiadLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const PersianMiniatureLayout = dynamic(() => import('./layouts/PersianMiniatureLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const KoreanHanokLayout = dynamic(() => import('./layouts/KoreanHanokLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const AndalusianPalaceLayout = dynamic(() => import('./layouts/AndalusianPalaceLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const MughalGardenLayout = dynamic(() => import('./layouts/MughalGardenLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const SantoriniSunsetLayout = dynamic(() => import('./layouts/SantoriniSunsetLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const AmalfiCoastLayout = dynamic(() => import('./layouts/AmalfiCoastLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const TuscanyVineyardLayout = dynamic(() => import('./layouts/TuscanyVineyardLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const LakeComoLayout = dynamic(() => import('./layouts/LakeComoLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const MoonPalaceLayout = dynamic(() => import('./layouts/MoonPalaceLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const EclipseCeremonyLayout = dynamic(() => import('./layouts/EclipseCeremonyLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const CosmicGardenLayout = dynamic(() => import('./layouts/CosmicGardenLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const AstralCathedralLayout = dynamic(() => import('./layouts/AstralCathedralLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const AtlantisLayout = dynamic(() => import('./layouts/AtlantisLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ApolloSunTempleLayout = dynamic(() => import('./layouts/ApolloSunTempleLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ArtemisMoonGardenLayout = dynamic(() => import('./layouts/ArtemisMoonGardenLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const PhoenixPalaceLayout = dynamic(() => import('./layouts/PhoenixPalaceLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const OracleDelphiLayout = dynamic(() => import('./layouts/OracleDelphiLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const DinosaurExpeditionLayout = dynamic(() => import('./layouts/DinosaurExpeditionLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const PirateTreasureMapLayout = dynamic(() => import('./layouts/PirateTreasureMapLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const RobotLaboratoryLayout = dynamic(() => import('./layouts/RobotLaboratoryLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ToyTrainJourneyLayout = dynamic(() => import('./layouts/ToyTrainJourneyLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const UnderwaterKidsKingdomLayout = dynamic(() => import('./layouts/UnderwaterKidsKingdomLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const LittleCaptainLayout = dynamic(() => import('./layouts/LittleCaptainLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const JuniorPilotLayout = dynamic(() => import('./layouts/JuniorPilotLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const StadiumChampionLayout = dynamic(() => import('./layouts/StadiumChampionLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const AstronautMissionLayout = dynamic(() => import('./layouts/AstronautMissionLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const AdventureMapLayout = dynamic(() => import('./layouts/AdventureMapLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const MedicalCongressEditorialLayout = dynamic(() => import('./layouts/MedicalCongressEditorialLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const AIFutureSummitLayout = dynamic(() => import('./layouts/AIFutureSummitLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ArchitectureForumBlueprintLayout = dynamic(() => import('./layouts/ArchitectureForumBlueprintLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const InvestorNightPrivateLayout = dynamic(() => import('./layouts/InvestorNightPrivateLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const SustainabilityForumLayout = dynamic(() => import('./layouts/SustainabilityForumLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const MemoryMuseumLayout = dynamic(() => import('./layouts/MemoryMuseumLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const MidnightRadioLayout = dynamic(() => import('./layouts/MidnightRadioLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const AnalogTelevisionLayout = dynamic(() => import('./layouts/AnalogTelevisionLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const SecretAgentInvitationLayout = dynamic(() => import('./layouts/SecretAgentInvitationLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const VinylLoveStoryLayout = dynamic(() => import('./layouts/VinylLoveStoryLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const HennaCourtyardRitualLayout = dynamic(() => import('./layouts/HennaCourtyardRitualLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const EngagementRingAtelierLayout = dynamic(() => import('./layouts/EngagementRingAtelierLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const RoseGoldEngagementLayout = dynamic(() => import('./layouts/RoseGoldEngagementLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const AnatolianHennaProcessionLayout = dynamic(() => import('./layouts/AnatolianHennaProcessionLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const CandlelightEngagementTableLayout = dynamic(() => import('./layouts/CandlelightEngagementTableLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const VenetianMaskedBallLayout = dynamic(() => import('./layouts/VenetianMaskedBallLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ChampagnePenthouseLayout = dynamic(() => import('./layouts/ChampagnePenthouseLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const GrandHotelBallroomLayout = dynamic(() => import('./layouts/GrandHotelBallroomLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const MonacoEveningLayout = dynamic(() => import('./layouts/MonacoEveningLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const PrivateEstateGalaLayout = dynamic(() => import('./layouts/PrivateEstateGalaLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ArchitecturalWhiteSpaceLayout = dynamic(() => import('./layouts/ArchitecturalWhiteSpaceLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const TypographicMonumentLayout = dynamic(() => import('./layouts/TypographicMonumentLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const GalleryCatalogueLayout = dynamic(() => import('./layouts/GalleryCatalogueLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const PaperFoldEditorialLayout = dynamic(() => import('./layouts/PaperFoldEditorialLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const BotanicalHerbariumLayout = dynamic(() => import('./layouts/BotanicalHerbariumLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const CeramicStudioLayout = dynamic(() => import('./layouts/CeramicStudioLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const PerfumeAtelierLayout = dynamic(() => import('./layouts/PerfumeAtelierLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const DesertNightCampLayout = dynamic(() => import('./layouts/DesertNightCampLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const MinimalCeremonyLayout = dynamic(() => import('./layouts/MinimalCeremonyLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const GoldFrameGalleryLayout = dynamic(() => import('./layouts/GoldFrameGalleryLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const FloralFamilyLayout = dynamic(() => import('./layouts/FloralFamilyLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const LavenderGardenLayout = dynamic(() => import('./layouts/LavenderGardenLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const EmeraldEleganceLayout = dynamic(() => import('./layouts/EmeraldEleganceLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const HorizontalCanalJourneyLayout = dynamic(() => import('./layouts/HorizontalCanalJourneyLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const VerticalBalloonJourneyLayout = dynamic(() => import('./layouts/VerticalBalloonJourneyLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const JapaneseFoldingScreenLayout = dynamic(() => import('./layouts/JapaneseFoldingScreenLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const AnatolianGridLayout = dynamic(() => import('./layouts/AnatolianGridLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ArchitecturalBlueprintLayout = dynamic(() => import('./layouts/ArchitecturalBlueprintLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const HolographicInterfaceLayout = dynamic(() => import('./layouts/HolographicInterfaceLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ObservatoryLayout = dynamic(() => import('./layouts/ObservatoryLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const UnderwaterJourneyLayout = dynamic(() => import('./layouts/UnderwaterJourneyLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const MuseumExhibitionLayout = dynamic(() => import('./layouts/MuseumExhibitionLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
const ObsidianSoundboardLayout = dynamic(() => import('./layouts/ObsidianSoundboardLayout'), { loading: () => <div className="min-h-screen w-full flex items-center justify-center bg-stone-900 text-stone-300">Yükleniyor...</div> });
import InvitationActionRow from './InvitationActionRow';



interface TemplateProps {
  wedding: any;
  templateId: string;
  mode?: 'preview' | 'public';
  hideCustomSections?: boolean;
}

export default function PremiumTemplateRenderer({ 
  wedding, 
  templateId, 
  mode = 'public',
  hideCustomSections = false
}: TemplateProps) {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [guestMessages, setGuestMessages] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchGuestMessages() {
      if (wedding.show_comments !== false) {
        const { data, error } = await supabase
          .from('rsvps')
          .select('guest_name, message, created_at')
          .eq('wedding_id', wedding.id)
          .eq('is_attending', true)
          .not('message', 'is', null)
          .neq('message', '')
          .neq('is_approved', false)
          .order('created_at', { ascending: false });

        if (data && !error) {
          setGuestMessages(data);
        }
      }
    }
    fetchGuestMessages();
  }, [wedding.id, wedding.show_comments]);

  const dateObj = (() => {
    if (!wedding.wedding_date) return new Date();
    const d = new Date(wedding.wedding_date);
    return isNaN(d.getTime()) ? new Date() : d;
  })();

  const getDeterministicDate = (d: Date) => {
    const day = d.getUTCDate();
    const months = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    const month = months[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    return `${day} ${month} ${year}`;
  };

  const getDeterministicTime = (d: Date) => {
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const dateStr = mounted 
    ? dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : getDeterministicDate(dateObj);

  const timeStr = mounted
    ? dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    : getDeterministicTime(dateObj);
  const eventTitle = (() => {
    const rawType = (wedding.event_type || '').toLowerCase();
    const eventTypeLabels: Record<string, string> = {
      wedding: "Düğün Töreni",
      engagement: "Nişan Töreni",
      henna: "Kına Gecesi",
      circumcision: "Sünnet Düğünü",
      baby_shower: "Baby Shower",
      birthday: "Doğum Günü",
      corporate: "Kurumsal Etkinlik",
      graduation: "Mezuniyet Töreni",
    };
    if (eventTypeLabels[rawType]) {
      return eventTypeLabels[rawType];
    }
    if (rawType.includes('düğün') || rawType.includes('nikah')) return 'Düğün Töreni';
    if (rawType.includes('nişan') || rawType.includes('söz')) return 'Nişan Töreni';
    if (rawType.includes('kına')) return 'Kına Gecesi';
    if (rawType.includes('sünnet')) return 'Sünnet Düğünü';
    if (rawType.includes('baby') || rawType.includes('shower')) return 'Baby Shower';
    if (rawType.includes('doğum') || rawType.includes('birthday')) return 'Doğum Günü';
    if (rawType.includes('kurumsal') || rawType.includes('corporate') || rawType.includes('lansman') || rawType.includes('davet') || rawType.includes('özel')) return 'Kurumsal Etkinlik';
    if (rawType.includes('mezuniyet') || rawType.includes('graduation')) return 'Mezuniyet Töreni';
    return wedding.event_type || 'Düğün Töreni';
  })();

  // Load the concept configuration
  const themeConfig = predefinedThemes.find(t => t.id === templateId) || predefinedThemes[0];
  
  const overrides = wedding.custom_overrides || {};
  
  // -- BACKGROUND SELECTION LOGIC --
  const requestedBg = overrides.design?.backgroundDesign || overrides.background_design || wedding.background_design;
  let selectedVariant = null;
  let effectiveBackground = themeConfig?.defaultBackground || 'minimal-white';
  
  if (themeConfig?.backgroundOptions && Array.isArray(themeConfig.backgroundOptions)) {
    if (requestedBg === 'none') {
      effectiveBackground = 'none';
      selectedVariant = null;
    } else {
      const variant = themeConfig.backgroundOptions.find(v => v.id === requestedBg);
      if (variant) {
        effectiveBackground = variant.id;
        selectedVariant = variant;
      } else if (themeConfig.backgroundOptions.length > 0) {
        effectiveBackground = themeConfig.backgroundOptions[0].id;
        selectedVariant = themeConfig.backgroundOptions[0];
      }
    }
  }
  
  const selectedBackground = selectedVariant;
  const effOverlay = selectedBackground?.overlayEffect;
  const effSide = selectedBackground?.sideDeco;
  const effCorner = selectedBackground?.cornerDeco;
  const effFrame = selectedBackground?.frameStyle;

  // Merge color palettes
  const basePalette = themeConfig?.colorPalette || themeConfig?.palette || {
    background: '#faf7f2',
    surface: '#ffffff',
    primary: '#111111',
    primaryText: '#3f3832',
    secondaryText: '#7b7066',
  };
  
  const effectivePalette = {
    ...basePalette,
    ...selectedVariant?.colorPalette
  };

  const isDarkModeActive = !!wedding.is_dark_mode;
  
  // Try to respect user overrides, otherwise use effectivePalette
  const primaryColor = overrides.primary_color || wedding.primary_color || (effectivePalette as any).primary || '#111111';
  
  const customDesignOverrides = wedding.custom_overrides?.design || {};
  const cardSurfaceObj = customDesignOverrides.cardSurface || {};

  const sceneBackgroundColor = customDesignOverrides.sceneBackgroundColor ?? wedding.scene_background_color ?? (isDarkModeActive ? '#0f172a' : (effectivePalette.background || '#f8fafc'));

  const overridesCardBg = cardSurfaceObj.color || customDesignOverrides.cardBgColor;
  const cardBgColorFallback = overridesCardBg || (isDarkModeActive ? '#12131a' : (effectivePalette.surface || (effectivePalette as any).card || '#ffffff'));
  const cardBgColorRaw = overridesCardBg || cardBgColorFallback || '#ffffff';

  const rawOpacityNum = cardSurfaceObj.opacity !== undefined ? cardSurfaceObj.opacity : (customDesignOverrides.cardOpacity !== undefined ? customDesignOverrides.cardOpacity : 90);
  const cardOpacity = rawOpacityNum / 100;

  const cardBlur = cardSurfaceObj.blur !== undefined ? cardSurfaceObj.blur : (customDesignOverrides.cardBlur ?? 0);

  let rawTextColor = isDarkModeActive ? '#f8fafc' : (overrides.text_color || wedding.text_color || effectivePalette.primaryText || '#333333');
  const effectiveTextBg = cardOpacity > 0.4 ? cardBgColorRaw : sceneBackgroundColor;
  const contrastRatio = getContrastRatio(rawTextColor, effectiveTextBg);
  if (contrastRatio < 3.0) {
    rawTextColor = getReadableTextColor(effectiveTextBg, '#ffffff', '#1e293b');
  }
  const textColor = rawTextColor;

  const mutedTextColor = isDarkModeActive ? '#94a3b8' : (effectivePalette.secondaryText || effectivePalette.mutedText || '#666666');

  const bgIsLight = isDarkModeActive ? false : isColorLight(effectivePalette.background || '#ffffff');
  const textIsLight = isDarkModeActive ? true : isColorLight(textColor);

  const headingFont = overrides.names_font_family || wedding.names_font_family || themeConfig.typography?.heading || 'Playfair Display';
  const bodyFont = overrides.font_family || wedding.font_family || themeConfig.typography?.body || 'Cormorant Garamond';
  const accentFont = themeConfig.typography?.accent || 'Great Vibes';

  const getFontFamily = (fontName: string, fallback: string) => {
    const map: Record<string, string> = {
      'Cormorant Garamond': 'var(--font-cormorant)',
      'Great Vibes': 'var(--font-great-vibes)',
      'Montserrat': 'var(--font-montserrat)',
      'Outfit': 'var(--font-outfit)',
      'Lora': 'var(--font-lora)',
      'Cinzel': 'var(--font-cinzel)',
      'Playfair Display': 'var(--font-playfair)',
      'Inter': 'var(--font-inter)',
      'Caveat': 'var(--font-caveat)'
    };
    return map[fontName] ? `${map[fontName]}, ${fallback}` : `"${fontName}", ${fallback}`;
  };

  const bodyFontFamily = getFontFamily(bodyFont, 'serif');
  const headingFontFamily = getFontFamily(headingFont, 'cursive, serif');
  const accentFontFamily = getFontFamily(accentFont, 'cursive');

  const hexToRgba = (hex: string, alpha: number) => {
    let c = hex.replace('#', '');
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const r = parseInt(c.substring(0, 2), 16) || 255;
    const g = parseInt(c.substring(2, 4), 16) || 255;
    const b = parseInt(c.substring(4, 6), 16) || 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const cardStyles: React.CSSProperties = {
    borderColor: `${primaryColor}25`,
    fontFamily: bodyFontFamily
  };

  const cardRgba = hexToRgba(cardBgColorRaw, cardOpacity);
  const cardBgColor = cardRgba;

  const cardSurfaceStyle: React.CSSProperties = {
    backgroundColor: cardBgColor,
    backdropFilter: cardBlur > 0 ? `blur(${cardBlur}px)` : undefined,
    WebkitBackdropFilter: cardBlur > 0 ? `blur(${cardBlur}px)` : undefined,
  };

  const svgNoise = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.055'/%3E%3C/svg%3E`;

  const txtId = overrides.background_design || wedding.background_design || overrides.envelope_bg_color || wedding.envelope_bg_color || themeConfig.visualDetails?.texture || 'minimal-white-paper';
  const registryBg = backgroundDesignRegistry[txtId] || backgroundDesignRegistry['minimal-white-paper'];

  if (isDarkModeActive) {
    cardStyles.backgroundImage = `url("${svgNoise}"), radial-gradient(circle at center, #1b1c22 0%, #0d0d12 100%)`;
    cardStyles.color = '#fff8ec';
    cardStyles.borderColor = 'rgba(214, 168, 79, 0.35)';
  } else {
    cardStyles.backgroundColor = registryBg.fallbackColor;
    cardStyles.backgroundImage = `url("${svgNoise}"), linear-gradient(${cardRgba}, ${cardRgba}), url('${registryBg.image}')`;
    cardStyles.backgroundBlendMode = 'overlay';
    cardStyles.backgroundSize = registryBg.size;
    cardStyles.backgroundPosition = registryBg.position;
    cardStyles.backgroundRepeat = registryBg.repeat;
  }

  const handleGuestPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (mode === 'preview') {
      alert("Önizleme Modu: Fotoğraf yükleme simülasyonu başarılı! (Gerçek yükleme için davetiyeyi kaydedip yayındaki sayfadan yükleme yapın.) 📸❤️");
      return;
    }
    const file = e.target.files[0];
    setIsUploading(true);

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('wedding_id', wedding.id);

    try {
      const res = await fetch('/api/telegram/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert("Fotoğrafınız gelin ve damadın ortak albümüne başarıyla gönderildi! 📸❤️");
      } else {
        alert("Fotoğraf gönderilemedi: " + data.error);
      }
    } catch (err) {
      alert("Yükleme sırasında hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMapClick = () => {
    setIsMapModalOpen(true);
  };

  // Dynamically compile paper texture styling
  const backgroundStyles: React.CSSProperties = {
    backgroundColor: isDarkModeActive ? '#090a0f' : registryBg.fallbackColor,
    backgroundImage: wedding.background_image_url 
      ? `url(${wedding.background_image_url})` 
      : `linear-gradient(${registryBg.overlay}, ${registryBg.overlay}), url('${registryBg.image}')`,
    backgroundSize: wedding.background_image_url ? 'cover' : registryBg.size,
    backgroundPosition: wedding.background_image_url ? 'center' : registryBg.position,
    backgroundRepeat: wedding.background_image_url ? 'no-repeat' : registryBg.repeat,
    color: isDarkModeActive ? '#f8fafc' : textColor
  };

  // Get card border styling
  const renderCardBorder = () => {
    const borderType = themeConfig.visualDetails?.border;
    if (borderType === 'gold-thin-frame') {
      return <div className="absolute inset-3 border border-double rounded-2xl pointer-events-none z-0 opacity-60" style={{ borderColor: primaryColor, borderWidth: '2px' }} />;
    } else if (borderType === 'double-gold') {
      return <div className="absolute inset-2 border-4 border-double rounded-[2rem] pointer-events-none z-0 opacity-70" style={{ borderColor: primaryColor }} />;
    } else if (borderType === 'soft-rose-frame') {
      return <div className="absolute inset-4 border rounded-3xl pointer-events-none z-0 opacity-40" style={{ borderColor: `${primaryColor}aa`, borderStyle: 'solid' }} />;
    } else if (borderType === 'minimal-line') {
      return <div className="absolute inset-4 border rounded-none pointer-events-none z-0 opacity-30" style={{ borderColor: `${textColor}40`, borderWidth: '1px' }} />;
    } else if (borderType === 'baroque-pattern') {
      return (
        <div className="absolute inset-4 pointer-events-none z-0 opacity-30">
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l" style={{ borderColor: primaryColor }} />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r" style={{ borderColor: primaryColor }} />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l" style={{ borderColor: primaryColor }} />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r" style={{ borderColor: primaryColor }} />
        </div>
      );
    } else if (borderType === 'botanical-frame') {
      return (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-25 text-lg select-none">
          <div className="absolute top-3 left-3">🌿</div>
          <div className="absolute top-3 right-3 scale-x-[-1]">🌿</div>
          <div className="absolute bottom-3 left-3 scale-y-[-1]">🌿</div>
          <div className="absolute bottom-3 right-3 scale-x-[-1] scale-y-[-1]">🌿</div>
        </div>
      );
    } else if (borderType === 'geometric-gold') {
      return (
        <div className="absolute inset-3 border rounded-[2rem] pointer-events-none z-0 opacity-40" style={{ borderColor: primaryColor, borderWidth: '1px' }}>
          <div className="absolute -inset-1 border rounded-[2.1rem]" style={{ borderColor: primaryColor, borderWidth: '0.5px' }} />
        </div>
      );
    } else if (borderType === 'starlight-frame') {
      return (
        <div className="absolute inset-2 rounded-2xl pointer-events-none z-0 opacity-30" style={{ 
          boxShadow: `0 0 15px ${primaryColor}40, inset 0 0 10px ${primaryColor}20`,
          border: `1px solid ${primaryColor}` 
        }} />
      );
    } else if (borderType === 'watercolor-frame') {
      return <div className="absolute inset-4 border border-dashed rounded-3xl pointer-events-none z-0 opacity-40" style={{ borderColor: `${primaryColor}80` }} />;
    } else if (borderType === 'modern-frame') {
      return <div className="absolute inset-3 border-l-2 pointer-events-none z-0 opacity-50" style={{ borderColor: primaryColor }} />;
    }
    return null;
  };

  // Card classes for shapes
  let cardShapeClass = 'rounded-3xl shadow-xl';
  const shape = themeConfig.visualDetails?.cardShape;
  if (shape === 'rounded-luxury') {
    cardShapeClass = 'rounded-[2.2rem] shadow-2xl';
  } else if (shape === 'soft-rounded') {
    cardShapeClass = 'rounded-2xl shadow-lg';
  } else if (shape === 'clean-rectangle') {
    cardShapeClass = 'rounded-none shadow-sm border-y';
  } else if (shape === 'elegant-curve') {
    cardShapeClass = 'rounded-[3rem] shadow-2xl';
  } else if (shape === 'royal-rounded') {
    cardShapeClass = 'rounded-[1.8rem] shadow-xl';
  } else if (shape === 'rough-edges') {
    cardShapeClass = 'rounded-[0.5rem] shadow-md border-dashed';
  }

  // Monogram rendering
  const brideInitial = wedding.bride_name ? wedding.bride_name.trim().charAt(0) : 'E';
  const groomInitial = wedding.groom_name ? wedding.groom_name.trim().charAt(0) : '';

  const renderMonogram = () => (
    <div className="flex flex-col items-center justify-center my-12 opacity-80 text-center select-none z-10 relative">
      <div className="flex items-center justify-center font-serif text-3xl font-light opacity-90" style={{ color: primaryColor }}>
        {groomInitial ? `${brideInitial} & ${groomInitial}` : brideInitial}
      </div>
      <div className="w-16 h-[1px] opacity-35 my-2" style={{ backgroundColor: primaryColor }} />
      <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: textColor, opacity: 0.6 }}>
        {eventTitle}
      </span>
    </div>
  );

  // Program timeline simulation
  // Program timeline simulation (Disabled per request)
  const renderProgramTimeline = () => {
    return null;
  };

  // Sub-renderers
  const renderHeader = () => (
    <h3 className="font-semibold tracking-[0.25em] uppercase mb-4 text-xs relative z-10" style={{ color: primaryColor }}>
      {eventTitle}
    </h3>
  );

  const renderNames = () => (
    <div className="w-full flex flex-col items-center justify-center" style={{ overflow: 'visible' }}>
      <h1 
        className="text-2xl sm:text-3xl md:text-4xl mb-6 mt-4 font-normal select-none relative z-10 w-full text-center"
        style={{ color: textColor, fontFamily: headingFontFamily, overflow: 'visible', lineHeight: 1.5, whiteSpace: 'nowrap' }}
      >
        {wedding.bride_parents && (
          <span 
            className="text-[10px] tracking-[0.25em] font-light mb-4 block"
            style={{ color: textColor, opacity: 0.6, fontFamily: 'Inter, system-ui, sans-serif', whiteSpace: 'normal' }}
          >
            {wedding.bride_parents}
          </span>
        )}
        <span className="block">
          {wedding.bride_name}
        </span>
      {wedding.groom_name && (
        <>
          <span className="text-sm my-2 block text-center" style={{ color: primaryColor, fontFamily: 'Inter, system-ui, sans-serif' }}>
            &
          </span>
          <span className="block">
            {wedding.groom_name}
          </span>
        </>
      )}
      {wedding.groom_parents && (
        <span 
          className="text-[10px] tracking-[0.25em] font-light mt-3 block text-center"
          style={{ color: textColor, opacity: 0.6, fontFamily: 'Inter, system-ui, sans-serif', whiteSpace: 'normal' }}
        >
          {wedding.groom_parents}
        </span>
      )}
    </h1>
    </div>
  );

  const renderQuote = () => wedding.custom_message && (
    <p 
      className="font-light italic mb-8 px-4 leading-relaxed text-sm relative z-10"
      style={{ 
        color: textColor, 
        opacity: 0.9,
        fontFamily: bodyFontFamily
      }}
    >
      "{wedding.custom_message}"
    </p>
  );

  const handleAddToCalendar = () => {
    if (!wedding.wedding_date) return;
    try {
      const dateObj = new Date(wedding.wedding_date);
      const startStr = dateObj.toISOString().replace(/-|:|\.\d+/g, '');
      const endObj = new Date(dateObj.getTime() + 4 * 60 * 60 * 1000); // 4 hours later
      const endStr = endObj.toISOString().replace(/-|:|\.\d+/g, '');
      const title = encodeURIComponent(`${wedding.bride_name} & ${wedding.groom_name} - ${eventTitle}`);
      const location = encodeURIComponent(wedding.venue_address || wedding.venue_name || '');
      
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=&location=${location}&sf=true&output=xml`;
      window.open(url, '_blank');
    } catch (e) {
      console.error(e);
    }
  };

  const renderTimer = () => wedding.wedding_date && wedding.show_countdown !== false && (
    <div className="my-6 relative z-10">
      <CountdownTimer 
        targetDate={wedding.wedding_date} 
        primaryColor={primaryColor} 
        styleType={wedding.countdown_style || 'glass'} 
      />
    </div>
  );

  const renderDetails = () => (
    <div className="flex flex-col gap-4 text-sm font-medium mb-10 mt-6 relative z-10 font-sans" style={{ color: textColor }}>
      <div 
        className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border shadow-xs" 
        style={{ 
          borderColor: `${primaryColor}20`, 
          backgroundColor: textIsLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.7)',
          color: textColor
        }}
      >
        <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
        <span suppressHydrationWarning>{dateStr} <span className="mx-2" style={{ color: primaryColor }}>|</span> {timeStr}</span>
      </div>

      <div 
        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border shadow-xs" 
        style={{ 
          borderColor: `${primaryColor}20`, 
          backgroundColor: textIsLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.7)',
          color: textColor
        }}
      >
        <div className="flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
          <span className="font-bold" style={{ color: textColor }}>{wedding.venue_name || 'Mekan Belirtilmedi'}</span>
        </div>
        {wedding.venue_address && (
          <span className="text-xs font-light px-4 opacity-80" style={{ color: textColor }}>{wedding.venue_address}</span>
        )}
      </div>
    </div>
  );

  const renderRsvpButton = () => {
    return (
      <InvitationActionRow
        primaryColor={primaryColor}
        textColor={textColor}
        textIsLight={textIsLight}
        showRsvp={wedding.show_rsvp !== false}
        showPhotos={wedding.show_photos !== false}
        showLocation={true}
        showCalendar={!!wedding.wedding_date}
        onRsvpClick={() => setIsRsvpOpen(true)}
        onMapClick={handleMapClick}
        onCalendarClick={handleAddToCalendar}
        onPhotoUpload={async (file) => {
          if (mode === 'preview') {
            alert("Önizleme Modu: Fotoğraf yükleme simülasyonu başarılı! (Gerçek yükleme için davetiyeyi kaydedip yayındaki sayfadan yükleme yapın.) 📸❤️");
            return;
          }
          setIsUploading(true);
      
          const formData = new FormData();
          formData.append('photo', file);
          formData.append('wedding_id', wedding.id);
      
          try {
            const res = await fetch('/api/telegram/upload', {
              method: 'POST',
              body: formData,
            });
            const data = await res.json();
            if (data.success) {
              alert('Fotoğrafınız başarıyla yüklendi, teşekkür ederiz! ❤️');
            } else {
              alert('Fotoğraf yüklenirken bir hata oluştu.');
            }
          } catch (error) {
            console.error('Upload error:', error);
            alert('Fotoğraf yüklenirken bir hata oluştu.');
          } finally {
            setIsUploading(false);
          }
        }}
        isUploading={isUploading}
      />
    );
  };

  // Guest Book Section (Anı Defteri)
  const renderGuestBook = () => {
    if (wedding.show_comments === false || guestMessages.length === 0) return null;
    
    return (
      <div className="w-full mt-10 mb-6 relative z-10 font-sans text-left px-2">
        <div className="w-12 h-[1px] bg-slate-200 mx-auto mb-6"></div>
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-center mb-6" style={{ color: textColor }}>
          ✍️ ANI DEFTERİ
        </h3>
        
        <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
          {guestMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-2xl border bg-white/40 backdrop-blur-sm shadow-2xs transition-all hover:bg-white/60"
              style={{ borderColor: `${primaryColor}20` }}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-xs" style={{ color: textColor }}>{msg.guest_name}</span>
                <span className="text-[9px] opacity-50" style={{ color: textColor }}>
                  {(() => {
                    const d = new Date(msg.created_at);
                    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('tr-TR');
                  })()}
                </span>
              </div>
              <p className="text-xs italic leading-relaxed opacity-95" style={{ color: textColor }}>
                "{msg.message}"
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonogramDivider = () => {
    return (
      <div className="flex items-center justify-center space-x-3 my-4 relative z-10 opacity-80">
        <div className="w-12 h-[1px]" style={{ backgroundColor: primaryColor }}></div>
        <div className="text-sm font-serif italic" style={{ color: primaryColor }}>&</div>
        <div className="w-12 h-[1px]" style={{ backgroundColor: primaryColor }}></div>
      </div>
    );
  };

  const renderContextualDecorations = () => {
    const eventTypeStr = eventTitle.toLowerCase();
    const isSunnet = eventTypeStr.includes('sünnet');
    const isKina = eventTypeStr.includes('kına') || eventTypeStr.includes('henna');
    const isBaby = eventTypeStr.includes('baby') || eventTypeStr.includes('doğum') || eventTypeStr.includes('yaş');

    if (isSunnet) {
      return (
        <div className="absolute top-0 left-0 w-full flex justify-center -mt-8 z-20 pointer-events-none">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2" style={{ borderColor: primaryColor }}>
            <span className="text-3xl">🧿</span>
          </div>
        </div>
      );
    }
    
    if (isKina) {
      return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
          <svg className="absolute -top-16 -left-16 w-64 h-64" viewBox="0 0 200 200" fill={primaryColor}>
            <path d="M100,0 C120,40 160,40 200,60 C160,80 160,120 140,160 C100,180 60,180 0,200 C40,160 40,120 20,80 C60,60 60,20 100,0 Z" />
          </svg>
          <svg className="absolute -bottom-16 -right-16 w-64 h-64" viewBox="0 0 200 200" fill={primaryColor}>
            <path d="M100,0 C120,40 160,40 200,60 C160,80 160,120 140,160 C100,180 60,180 0,200 C40,160 40,120 20,80 C60,60 60,20 100,0 Z" />
          </svg>
        </div>
      );
    }
    
    if (isBaby) {
      return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30 text-4xl">
          <div className="absolute top-10 left-10 animate-pulse">☁️</div>
          <div className="absolute top-40 right-10 text-2xl animate-bounce">⭐</div>
          <div className="absolute bottom-20 left-20 text-3xl">🧸</div>
        </div>
      );
    }
    
    return null;
  };



  
  
  
  
  
  const renderLayout = () => {
    const layoutStyle = wedding.custom_overrides?.layoutStyle || themeConfig?.layoutStyle || templateId || 'monogram';
    const commonProps = {
    templateId, selectedBackground, wedding, primaryColor, textColor, headingFont, bodyFont, accentFont, dateObj, dateStr, timeStr, eventTitle, renderTimer, renderRsvpButton, renderGuestBook, renderQuote, handleMapClick, cardBgColor, cardBlur, cardSurfaceStyle };
    switch (layoutStyle) {
      case 'cinematic-poster':
        return (
          <CinematicPosterLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'royal-letter':
        return (
          <RoyalLetterLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'polaroid-story':
        return (
          <PolaroidStoryLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'constellation-night':
        return (
          <ConstellationNightLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      
      case 'modern-architecture':
        return <ModernArchitectureLayout             wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode} />;
      case 'botanical-ceramic':
        return <BotanicalCeramicLayout             wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode} />;
      case 'luxury-hotel':
        return <LuxuryHotelLayout             wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode} />;
      case 'destination-boarding-pass':
        return <DestinationBoardingPassLayout             wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode} />;
      case 'fashion-magazine':
        return <FashionMagazineLayout             wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode} />;
      case 'art-deco-theater':
        return <ArtDecoTheaterLayout             wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode} />;
      case 'mediterranean-garden':
        return <MediterraneanGardenLayout             wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode} />;
      case 'minimal-typographic':
        return <MinimalTypographicLayout             wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode} />;
case 'asymmetric': 
      case 'full-bleed':
        return (
          <FullBleedPhotoLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'editorial':
        return (
          <MagazineEditorialLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'oriental': 
      case 'folded-seal':
        return (
          <FoldedSealLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
          />
        );
      case 'monogram-media':
        return (
          <GiantMonogramLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'photo-luxury':
        return (
          <PhotoLuxuryLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'botanical-frame':
        return (
          <BotanicalFrameLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'kids-thematic':
        return (
          <KidsThematicLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'henna-velvet':
        return (
          <HennaVelvetLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'royal-circumcision':
        return (
          <RoyalCircumcisionLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'minimal-paper':
        return (
          <MinimalPaperLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'split-screen':
        return (
          <SplitScreenLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'story-timeline':
        return (
          <StoryTimelineLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      case 'modern-event':
        return (
          <ModernEventLayout 
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
            
      case 'giant-monogram':
        return (
          <GiantMonogramLayout
            wedding={wedding}
            primaryColor={primaryColor}
            textColor={textColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            accentFont={accentFont}
            dateObj={dateObj}
            dateStr={dateStr}
            timeStr={timeStr}
            eventTitle={eventTitle}
            renderTimer={renderTimer}
            renderRsvpButton={renderRsvpButton}
            renderGuestBook={renderGuestBook}
            renderQuote={renderQuote}
            handleMapClick={handleMapClick}
            cardBgColor={cardBgColor}
            mode={mode}
          />
        );
      
      case 'parisian-apartment': 
      case 'parisian-black-tie':
      case 'french-haute-couture': return <ParisianApartmentLayout {...commonProps} />;
      case 'swiss-grid':
      case 'minimal-swiss-gallery': return <SwissGridCeremonyLayout {...commonProps} dateObj={dateObj} />;
      case 'grand-opera-ballroom': return <ArtDecoTheaterLayout {...commonProps} />;
      case 'moonlit-secret-garden': return <ConstellationNightLayout {...commonProps} />;
      case 'vogue-wedding-editorial': return <FashionMagazineLayout {...commonProps} />;
      case 'mediterranean-ceramic-garden':
      case 'mediterranean-ceramic': return <BotanicalCeramicLayout {...commonProps} />;
      case 'ottoman-illumination': 
      case 'oriental-lace': return <OrientalLaceLayout {...commonProps} />;
      case 'coastal-sunset': 
      case 'full-bleed-photo': return <FullBleedPhotoLayout {...commonProps} />;
      case 'aurora-glass': return <ModernArchitectureLayout {...commonProps} />;
      case 'fine-art-botanical-watercolor': return <BotanicalFrameLayout {...commonProps} />;
      case 'film-premiere-night': return <CinematicPosterLayout {...commonProps} />;
      case 'royal-palace-invitation': return <RoyalLetterLayout {...commonProps} />;
      case 'henna-palace-night': return <HennaVelvetLayout {...commonProps} />;
      case 'prince-ceremony': return <RoyalCircumcisionLayout {...commonProps} />;
      case 'storybook-babyshower':
      case 'storybook-birthday': 
      case 'storybook-kids': return <KidsThematicLayout {...commonProps} />;
      case 'future-summit':
      case 'modern-event': return <ModernEventLayout {...commonProps} />;
      case 'horizontal-canal-journey': return <HorizontalCanalJourneyLayout {...commonProps} />;
      case 'vertical-balloon-journey': return <VerticalBalloonJourneyLayout {...commonProps} />;
      case 'japanese-folding-screen': return <JapaneseFoldingScreenLayout {...commonProps} />;
      case 'anatolian-grid': return <AnatolianGridLayout {...commonProps} />;
      case 'architectural-blueprint': return <ArchitecturalBlueprintLayout {...commonProps} />;
      case 'holographic-interface': return <HolographicInterfaceLayout {...commonProps} />;
      case 'observatory': return <ObservatoryLayout {...commonProps} />;
      case 'underwater-journey': return <UnderwaterJourneyLayout {...commonProps} />;
      case 'museum-exhibition': return <MuseumExhibitionLayout {...commonProps} />;
      case 'obsidian-soundboard': return <ObsidianSoundboardLayout {...commonProps} />;
      case 'cinematic-garden-journey': return <CinematicGardenJourneyLayout {...commonProps} />;
      case 'cinematic-black-tie': return <BlackTieCinemaLayout {...commonProps} />;
      case 'cinematic-celestial': return <CelestialJourneyLayout {...commonProps} />;
      case 'cinematic-destination-journey': return <DestinationFilmLayout {...commonProps} />;
      case 'cinematic-storybook': return <StorybookDreamLayout {...commonProps} />;
      case 'bosphorus-mansion': return <BosphorusMansionLayout {...commonProps} />;
      case 'moroccan-riad-henna-night': return <MoroccanRiadLayout {...commonProps} />;
      case 'persian-miniature-concept': return <PersianMiniatureLayout {...commonProps} />;
      case 'korean-hanok-traditional': return <KoreanHanokLayout {...commonProps} />;
      case 'andalusian-palace-alhambra': return <AndalusianPalaceLayout {...commonProps} />;
      case 'mughal-garden-taj': return <MughalGardenLayout {...commonProps} />;
      case 'santorini-sunset-terrace': return <SantoriniSunsetLayout {...commonProps} />;
      case 'amalfi-coast-lemons': return <AmalfiCoastLayout {...commonProps} />;
      case 'tuscany-vineyard-manor': return <TuscanyVineyardLayout {...commonProps} />;
      case 'lake-como-grand-hotel': return <LakeComoLayout {...commonProps} />;
      case 'moon-palace': return <MoonPalaceLayout {...commonProps} />;
      case 'eclipse-ceremony': return <EclipseCeremonyLayout {...commonProps} />;
      case 'cosmic-garden': return <CosmicGardenLayout {...commonProps} />;
      case 'astral-cathedral': return <AstralCathedralLayout {...commonProps} />;
      case 'atlantis-ceremony': return <AtlantisLayout {...commonProps} />;
      case 'apollo-sun-temple': return <ApolloSunTempleLayout {...commonProps} />;
      case 'artemis-moon-garden': return <ArtemisMoonGardenLayout {...commonProps} />;
      case 'phoenix-palace': return <PhoenixPalaceLayout {...commonProps} />;
      case 'oracle-of-delphi': return <OracleDelphiLayout {...commonProps} />;
      case 'dinosaur-expedition': return <DinosaurExpeditionLayout {...commonProps} />;
      case 'pirate-treasure-map': return <PirateTreasureMapLayout {...commonProps} />;
      case 'robot-laboratory': return <RobotLaboratoryLayout {...commonProps} />;
      case 'toy-train-journey': return <ToyTrainJourneyLayout {...commonProps} />;
      case 'underwater-kids-kingdom': return <UnderwaterKidsKingdomLayout {...commonProps} />;
      case 'little-captain-ceremony': return <LittleCaptainLayout {...commonProps} />;
      case 'junior-pilot-ceremony': return <JuniorPilotLayout {...commonProps} />;
      case 'stadium-champion-ceremony': return <StadiumChampionLayout {...commonProps} />;
      case 'astronaut-mission-ceremony': return <AstronautMissionLayout {...commonProps} />;
      case 'adventure-map-ceremony': return <AdventureMapLayout {...commonProps} />;
      case 'medical-congress-editorial': return <MedicalCongressEditorialLayout {...commonProps} />;
      case 'ai-future-summit': return <AIFutureSummitLayout {...commonProps} />;
      case 'architecture-forum-blueprint': return <ArchitectureForumBlueprintLayout {...commonProps} />;
      case 'investor-night-private': return <InvestorNightPrivateLayout {...commonProps} />;
      case 'sustainability-forum': return <SustainabilityForumLayout {...commonProps} />;
      case 'memory-museum': return <MemoryMuseumLayout {...commonProps} />;
      case 'midnight-radio': return <MidnightRadioLayout {...commonProps} />;
      case 'analog-television': return <AnalogTelevisionLayout {...commonProps} />;
      case 'secret-agent-invitation': return <SecretAgentInvitationLayout {...commonProps} />;
      case 'vinyl-love-story': return <VinylLoveStoryLayout {...commonProps} />;
      case 'henna-courtyard-ritual': return <HennaCourtyardRitualLayout {...commonProps} />;
      case 'engagement-ring-atelier': return <EngagementRingAtelierLayout {...commonProps} />;
      case 'rose-gold-engagement': return <RoseGoldEngagementLayout {...commonProps} />;
      case 'anatolian-henna-procession': return <AnatolianHennaProcessionLayout {...commonProps} />;
      case 'candlelight-engagement-table': return <CandlelightEngagementTableLayout {...commonProps} />;
      case 'venetian-masked-ball': return <VenetianMaskedBallLayout {...commonProps} />;
      case 'champagne-penthouse': return <ChampagnePenthouseLayout {...commonProps} />;
      case 'grand-hotel-ballroom': return <GrandHotelBallroomLayout {...commonProps} />;
      case 'monaco-evening': return <MonacoEveningLayout {...commonProps} />;
      case 'private-estate-gala': return <PrivateEstateGalaLayout {...commonProps} />;
      case 'architectural-white-space': return <ArchitecturalWhiteSpaceLayout {...commonProps} />;
      case 'typographic-monument': return <TypographicMonumentLayout {...commonProps} />;
      case 'gallery-catalogue': return <GalleryCatalogueLayout {...commonProps} />;
      case 'paper-fold-editorial': return <PaperFoldEditorialLayout {...commonProps} />;
      case 'botanical-herbarium': return <BotanicalHerbariumLayout {...commonProps} />;
      case 'ceramic-studio': return <CeramicStudioLayout {...commonProps} />;
      case 'perfume-atelier': return <PerfumeAtelierLayout {...commonProps} />;
      case 'desert-night-camp': return <DesertNightCampLayout {...commonProps} />;
      default:
        return <SplitScreenLayout {...commonProps} />;
    }
  };

  // Render the core layout

  const isFullBleed = themeConfig.layoutMode === 'full-bleed';

  const isNoBackground = requestedBg === 'none' || effectiveBackground === 'none';

  return (
    <div 
      className={`min-h-screen w-full relative flex flex-col font-sans transition-colors duration-1000 ${!isNoBackground ? `bg-design-${effectiveBackground}` : ''} ${(isDarkModeActive && !selectedBackground?.image && !selectedBackground?.background) ? 'dark-mode' : ''} ${!isFullBleed ? 'items-center justify-center p-4 sm:p-6 pb-28 invitation-page' : ''}`}
      data-testid="invitation-scene-root"
      style={{
        backgroundColor: isNoBackground 
          ? sceneBackgroundColor 
          : (selectedBackground?.background && !selectedBackground.background.includes('/') ? selectedBackground.background : sceneBackgroundColor),
        backgroundImage: isNoBackground 
          ? (wedding.background_image_url ? `url("${wedding.background_image_url}")` : 'none')
          : (selectedBackground?.image 
              ? `url("${selectedBackground.image}")` 
              : (selectedBackground?.background?.includes('/') ? `url("${selectedBackground.background}")` : (wedding.background_image_url ? `url("${wedding.background_image_url}")` : undefined))),
        backgroundSize: selectedBackground?.backgroundSize ?? 'cover',
        backgroundPosition: selectedBackground?.backgroundPosition ?? 'center',
        backgroundRepeat: selectedBackground?.backgroundRepeat ?? 'no-repeat',
        ...(!isNoBackground && !selectedBackground?.background && !selectedBackground?.image && !selectedVariant?.background ? backgroundStyles : {}),
        overflowX: 'clip'
      }}
    >
      <BackgroundAnimation type={selectedBackground?.ornamentSet || overrides.background_animation || wedding.background_animation} disableDefault={!!selectedBackground} />
      
<style dangerouslySetInnerHTML={{ __html: `
  /* Overlays */
  .bg-overlay-gold-sparkle-soft { background-image: radial-gradient(circle at center, rgba(255,215,0,0.15) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"); }
  .bg-overlay-gold-sparkle-strong { background-image: radial-gradient(circle at center, rgba(255,215,0,0.3) 0%, transparent 80%), url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"); }
  .bg-overlay-rose-glow { background-image: radial-gradient(circle at 50% 30%, rgba(255,182,193,0.3) 0%, transparent 60%); }
  .bg-overlay-warm-glow { background-image: radial-gradient(circle at 50% 50%, rgba(255,248,220,0.4) 0%, transparent 70%); }
  .bg-overlay-sunlight-glow { background-image: radial-gradient(circle at 10% 10%, rgba(255,255,200,0.6) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(255,200,100,0.2) 0%, transparent 50%); }
  .bg-overlay-paper-texture { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E"); mix-blend-mode: multiply; }
  .bg-overlay-ceramic-texture { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E"); }
  .bg-overlay-starlight { background-image: radial-gradient(1px 1px at 10% 20%, white 100%, transparent), radial-gradient(2px 2px at 40% 60%, rgba(255,255,255,0.8) 100%, transparent), radial-gradient(1.5px 1.5px at 80% 30%, white 100%, transparent), radial-gradient(2.5px 2.5px at 70% 80%, rgba(255,255,255,0.9) 100%, transparent), radial-gradient(1px 1px at 30% 90%, white 100%, transparent); background-size: 200px 200px; }
  .bg-overlay-garden-glow { background-image: radial-gradient(circle at 20% 80%, rgba(144,238,144,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(144,238,144,0.1) 0%, transparent 40%); }
  .bg-overlay-linen-texture { background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px); mix-blend-mode: multiply; }
  .bg-overlay-palace-arch { background-image: radial-gradient(ellipse at top, rgba(255,215,0,0.1) 0%, transparent 60%); border-top: 20px solid rgba(255,215,0,0.05); border-radius: 50% 50% 0 0 / 10% 10% 0 0; }
  .bg-overlay-moon-stars { background-image: radial-gradient(circle at 80% 20%, rgba(255,255,200,0.4) 0%, rgba(255,255,200,0.1) 20%, transparent 40%); }
  .bg-overlay-cyber-glow { background-image: radial-gradient(circle at 50% 50%, rgba(0,255,255,0.1) 0%, transparent 60%); mix-blend-mode: screen; }

  /* Side Decorations */
  .bg-side-left-marble-gold { background-image: linear-gradient(to right, rgba(212,175,55,0.2) 0%, transparent 100%); border-left: 4px solid rgba(212,175,55,0.3); }
  .bg-side-right-marble-gold { background-image: linear-gradient(to left, rgba(212,175,55,0.2) 0%, transparent 100%); border-right: 4px solid rgba(212,175,55,0.3); }
  .bg-side-left-marble-gold-dark { background-image: linear-gradient(to right, rgba(212,175,55,0.4) 0%, transparent 100%); border-left: 6px solid rgba(212,175,55,0.5); }
  .bg-side-right-marble-gold-dark { background-image: linear-gradient(to left, rgba(212,175,55,0.4) 0%, transparent 100%); border-right: 6px solid rgba(212,175,55,0.5); }
  .bg-side-left-rose-silk { background-image: linear-gradient(to right, rgba(255,182,193,0.3) 0%, transparent 100%); }
  .bg-side-right-rose-silk { background-image: linear-gradient(to left, rgba(255,182,193,0.3) 0%, transparent 100%); }
  .bg-side-left-botanical-leaves { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 200'%3E%3Cpath d='M0,50 Q40,40 50,0 Q60,40 100,50 Q60,60 50,100 Q40,60 0,50' fill='rgba(34,139,34,0.05)'/%3E%3C/svg%3E"); background-size: cover; }
  .bg-side-right-botanical-leaves { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 200'%3E%3Cpath d='M0,50 Q40,40 50,0 Q60,40 100,50 Q60,60 50,100 Q40,60 0,50' fill='rgba(34,139,34,0.05)'/%3E%3C/svg%3E"); background-size: cover; transform: scaleX(-1); }
  .bg-side-left-velvet-curtain { background: linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, transparent 100%); border-left: 15px solid rgba(139,0,0,0.3); }
  .bg-side-right-velvet-curtain { background: linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, transparent 100%); border-right: 15px solid rgba(139,0,0,0.3); }
  .bg-side-left-velvet-curtain-burgundy { background: linear-gradient(to right, rgba(60,0,10,0.7) 0%, rgba(60,0,10,0.2) 50%, transparent 100%); border-left: 20px solid rgba(139,0,0,0.4); }
  .bg-side-right-velvet-curtain-burgundy { background: linear-gradient(to left, rgba(60,0,10,0.7) 0%, rgba(60,0,10,0.2) 50%, transparent 100%); border-right: 20px solid rgba(139,0,0,0.4); }
  .bg-side-left-royal-curtain { background: linear-gradient(to right, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0.1) 40%, transparent 100%); border-left: 10px solid rgba(212,175,55,0.6); }
  .bg-side-right-royal-curtain { background: linear-gradient(to left, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0.1) 40%, transparent 100%); border-right: 10px solid rgba(212,175,55,0.6); }
  .bg-side-left-digital-grid { background-image: linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px; mask-image: linear-gradient(to right, black 0%, transparent 100%); }
  .bg-side-right-digital-grid { background-image: linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px; mask-image: linear-gradient(to left, black 0%, transparent 100%); }

  /* Frame Styles */
  .border-frame-thin-gold { border: 1px solid rgba(212,175,55,0.5); outline: 1px solid rgba(212,175,55,0.2); outline-offset: 4px; }
  .border-frame-thick-gold { border: 4px double rgba(212,175,55,0.6); }
  .border-frame-gold-border { border: 2px solid #d4af37; border-radius: 8px; box-shadow: inset 0 0 20px rgba(212,175,55,0.2); }
  .border-frame-sparkle-frame { border: 2px dotted rgba(255,192,203,0.8); border-radius: 16px; }
  .border-frame-book-pages { border-right: 8px solid rgba(0,0,0,0.1); border-bottom: 8px solid rgba(0,0,0,0.15); border-radius: 4px 12px 12px 4px; }

  /* Corner Decorations */
  .bg-corner-tl-gold-crest { background: radial-gradient(circle at 0% 0%, rgba(212,175,55,0.4) 0%, transparent 60%); }
  .bg-corner-tr-gold-crest { background: radial-gradient(circle at 100% 0%, rgba(212,175,55,0.4) 0%, transparent 60%); }
  .bg-corner-bl-gold-crest { background: radial-gradient(circle at 0% 100%, rgba(212,175,55,0.4) 0%, transparent 60%); }
  .bg-corner-br-gold-crest { background: radial-gradient(circle at 100% 100%, rgba(212,175,55,0.4) 0%, transparent 60%); }
  .bg-corner-tl-floral-corners { background: radial-gradient(circle at 0% 0%, rgba(255,182,193,0.3) 0%, transparent 70%); }
  .bg-corner-tr-floral-corners { background: radial-gradient(circle at 100% 0%, rgba(255,182,193,0.3) 0%, transparent 70%); }
  .bg-corner-bl-floral-corners { background: radial-gradient(circle at 0% 100%, rgba(255,182,193,0.3) 0%, transparent 70%); }
  .bg-corner-br-floral-corners { background: radial-gradient(circle at 100% 100%, rgba(255,182,193,0.3) 0%, transparent 70%); }
`}} />



      
      {wedding.background_image_url && (
        <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" />
      )}

      {/* Main Premium Invitation Card Box */}
      <div 
        data-testid="invitation-layout-root" 
        data-template-id={templateId}
        data-layout-id={themeConfig?.layoutStyle || 'split-screen'}
        className="relative z-[20]"
      >
        {renderLayout()}

        {/* User-defined Custom Content Sections */}
        {wedding?.custom_overrides?.custom_sections && Array.isArray(wedding.custom_overrides.custom_sections) && !hideCustomSections && (
          <div className="w-full max-w-2xl mx-auto px-4 space-y-6 mt-6 relative z-20">
            {wedding.custom_overrides.custom_sections
              .filter((sec: any) => sec.isVisible !== false)
              .map((sec: any) => (
                <div 
                  key={sec.id}
                  data-testid={`custom-section-${sec.id}`}
                  className={`p-6 md:p-8 rounded-3xl backdrop-blur-md border shadow-sm transition hover:shadow-md ${
                    sec.alignment === 'left' ? 'text-left' : sec.alignment === 'right' ? 'text-right' : 'text-center'
                  }`}
                  style={{
                    backgroundColor: cardBgColor ? `${cardBgColor}F0` : 'rgba(255,255,255,0.92)',
                    borderColor: `${primaryColor}30`,
                    color: textColor
                  }}
                >
                  <h3 className="text-xl md:text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                    {sec.title}
                  </h3>
                  {sec.subtitle && (
                    <p className="text-xs uppercase tracking-widest opacity-70 mb-3 font-semibold">
                      {sec.subtitle}
                    </p>
                  )}
                  <p className="text-sm md:text-base leading-relaxed opacity-90 whitespace-pre-line font-sans">
                    {sec.content}
                  </p>
                  {sec.buttonText && sec.buttonUrl && (
                    <div className="mt-4">
                      <a
                        href={sec.buttonUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-5 py-2.5 rounded-full font-bold text-xs shadow-md transition hover:scale-105"
                        style={{
                          backgroundColor: primaryColor,
                          color: '#ffffff'
                        }}
                      >
                        {sec.buttonText}
                      </a>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      
      {/* Visual Scene Layers based on selectedBackground */}
      {effOverlay && (
        <div className={`absolute inset-0 pointer-events-none z-[10] mix-blend-overlay bg-overlay-${effOverlay}`} />
      )}
      {effSide && (
        <>
          <div className={`absolute top-0 left-0 bottom-0 w-16 md:w-48 pointer-events-none z-[10] bg-side-left-${effSide}`} />
          <div className={`absolute top-0 right-0 bottom-0 w-16 md:w-48 pointer-events-none z-[10] bg-side-right-${effSide}`} />
        </>
      )}
      {effCorner && (
        <>
          <div className={`absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 pointer-events-none z-[10] bg-corner-tl-${effCorner}`} />
          <div className={`absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 pointer-events-none z-[10] bg-corner-tr-${effCorner}`} />
          <div className={`absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 pointer-events-none z-[10] bg-corner-bl-${effCorner}`} />
          <div className={`absolute bottom-0 right-0 w-32 h-32 md:w-64 md:h-64 pointer-events-none z-[10] bg-corner-br-${effCorner}`} />
        </>
      )}
      {effFrame && (
        <div className={`absolute inset-2 md:inset-6 pointer-events-none z-[10] border-frame-${effFrame}`} />
      )}

      {/* RSVP Modal */}
      <RsvpModal 
        weddingId={wedding.id} 
        isOpen={isRsvpOpen} 
        onClose={() => setIsRsvpOpen(false)} 
        primaryColor={primaryColor} 
        brideName={wedding.bride_name}
        groomName={wedding.groom_name}
        mode={mode}
        events={wedding.invitation_events || []}
      />

      {/* Travel directions Yandex/Google Maps Dialog */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
          <div 
            className="w-full max-w-sm rounded-3xl p-6 relative border shadow-2xl transition-all scale-up bg-white text-slate-800"
            style={{ 
              borderColor: `${primaryColor}30`,
              backgroundColor: cardBgColor || '#ffffff',
              color: textColor
            }}
          >
            <button 
              type="button"
              onClick={() => setIsMapModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h3 className="font-serif font-bold text-lg mb-2 text-center" style={{ color: textColor }}>🗺️ Yol Tarifi Al</h3>
            <p className="text-xs text-slate-500 text-center mb-6">Lütfen yol tarifi almak istediğiniz harita uygulamasını seçin.</p>

            <div className="flex flex-col gap-3">
              {wedding.google_maps_url && (
                <a 
                  href={wedding.google_maps_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl border text-sm font-bold transition-all hover:scale-102 hover:shadow-xs active:scale-98"
                  style={{ 
                    borderColor: `${primaryColor}20`,
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    color: textColor
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Navigation className="w-4 h-4" style={{ color: primaryColor }} />
                    <span>Google Haritalar</span>
                  </div>
                  <span className="text-xs opacity-50">&rarr;</span>
                </a>
              )}

              <a 
                href={`https://maps.apple.com/?q=${encodeURIComponent(wedding.venue_name || 'Düğün Mekanı')}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl border text-sm font-bold transition-all hover:scale-102 hover:shadow-xs active:scale-98"
                style={{ 
                  borderColor: `${primaryColor}20`,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  color: textColor
                }}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 170 170" fill="currentColor" style={{ color: primaryColor }}>
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.14-1.92-14.38-6.14-3.57-2.92-7.55-7.79-11.96-14.59-4.83-7.58-8.8-16.27-11.92-26.06-3.12-9.79-4.68-19.12-4.68-28 0-14.18 3.86-25.59 11.58-34.25 7.73-8.66 17.2-13 28.43-13 5.46 0 11.39 1.5 17.79 4.49 6.4 2.99 10.97 4.49 13.72 4.49 2.5 0 6.64-1.35 12.42-4.04 5.78-2.69 11.45-3.95 17-3.79 16.2.63 28.53 6.94 36.98 18.91-14.49 8.76-21.57 20.89-21.22 36.4.35 12.16 4.96 22.28 13.84 30.38 8.88 8.1 19.34 12.44 31.42 13.04.47 5 .94 9.5 1.42 13.5zM119.22 19.25c0 7.82-2.8 15.11-8.41 21.88-5.61 6.77-12.63 10.87-21.05 12.29.12-1.3.18-2.6.18-3.9 0-7.39 2.76-14.54 8.27-21.46 5.51-6.92 12.38-11.23 20.61-12.92 0 .5.1.7.1 1.2 0 1.25.1 2.37.3 2.91z"/>
                  </svg>
                  <span>Apple Haritalar</span>
                </div>
                <span className="text-xs opacity-50">&rarr;</span>
              </a>

              <a 
                href={`https://yandex.com.tr/maps/?text=${encodeURIComponent((wedding.venue_name || '') + ' ' + (wedding.venue_address || ''))}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl border text-sm font-bold transition-all hover:scale-102 hover:shadow-xs active:scale-98"
                style={{ 
                  borderColor: `${primaryColor}20`,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  color: textColor
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-black italic tracking-tighter shrink-0" style={{ color: primaryColor }}>Y</span>
                  <span>Yandex Haritalar</span>
                </div>
                <span className="text-xs opacity-50">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
