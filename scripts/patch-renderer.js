import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src/components/templates/PremiumTemplateRenderer.tsx');
let content = fs.readFileSync(file, 'utf8');

// Add imports
const newImports = `
import ModernArchitectureLayout from './layouts/ModernArchitectureLayout';
import BotanicalCeramicLayout from './layouts/BotanicalCeramicLayout';
import LuxuryHotelLayout from './layouts/LuxuryHotelLayout';
import DestinationBoardingPassLayout from './layouts/DestinationBoardingPassLayout';
import FashionMagazineLayout from './layouts/FashionMagazineLayout';
import ArtDecoTheaterLayout from './layouts/ArtDecoTheaterLayout';
import MediterraneanGardenLayout from './layouts/MediterraneanGardenLayout';
import MinimalTypographicLayout from './layouts/MinimalTypographicLayout';
`;

content = content.replace(/(import ConstellationNightLayout from '\.\/layouts\/ConstellationNightLayout';)/, '$1' + newImports);

const layoutPropsCall = `            wedding={wedding}
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
            mode={mode}`;

const newCases = `
      case 'modern-architecture':
        return <ModernArchitectureLayout ${layoutPropsCall} />;
      case 'botanical-ceramic':
        return <BotanicalCeramicLayout ${layoutPropsCall} />;
      case 'luxury-hotel':
        return <LuxuryHotelLayout ${layoutPropsCall} />;
      case 'destination-boarding-pass':
        return <DestinationBoardingPassLayout ${layoutPropsCall} />;
      case 'fashion-magazine':
        return <FashionMagazineLayout ${layoutPropsCall} />;
      case 'art-deco-theater':
        return <ArtDecoTheaterLayout ${layoutPropsCall} />;
      case 'mediterranean-garden':
        return <MediterraneanGardenLayout ${layoutPropsCall} />;
      case 'minimal-typographic':
        return <MinimalTypographicLayout ${layoutPropsCall} />;
`;

content = content.replace(/(case 'asymmetric': return renderAsymmetricLayout\(\);)/, newCases + '$1');

fs.writeFileSync(file, content, 'utf8');
console.log('Renderer updated!');
