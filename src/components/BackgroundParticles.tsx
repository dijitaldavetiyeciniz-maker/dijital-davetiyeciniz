'use client';
import React from 'react';

interface BackgroundParticlesProps {
  animationType: string;
  primaryColor?: string;
}

export default function BackgroundParticles({ animationType, primaryColor = '#d4af37' }: BackgroundParticlesProps) {
  if (['goldenDust', 'rosePetals', 'sakura', 'bokehLights', 'heartsRain', 'starShower', 'pearlSparkle', 'mistCloud', 'confettiBurst', 'autumnLeaves', 'waveReflection', 'silkWave', 'candleFlicker', 'neonGradient', 'marbleLight'].includes(animationType)) {
    const config: Record<string, { cls: string; count: number; content?: string[]; noPos?: boolean }> = {
      goldenDust: { cls: 'golden-dust-particles', count: 30 },
      rosePetals: { cls: 'rose-petals-particles', count: 30 },
      sakura: { cls: 'sakura-particles', count: 30 },
      bokehLights: { cls: 'bokeh-lights-particles', count: 20 },
      heartsRain: { cls: 'hearts-rain-particles', count: 30, content: ['❤️', '🩷', '💕', '💗'] },
      starShower: { cls: 'star-shower-particles', count: 30 },
      pearlSparkle: { cls: 'pearl-sparkle-particles', count: 30 },
      mistCloud: { cls: 'mist-cloud-particles', count: 5 },
      confettiBurst: { cls: 'confetti-burst-particles', count: 30 },
      autumnLeaves: { cls: 'autumn-leaves-particles', count: 30 },
      waveReflection: { cls: 'wave-reflection-particles', count: 3, noPos: true },
      silkWave: { cls: 'silk-wave-particles', count: 3, noPos: true },
      candleFlicker: { cls: 'candle-flicker-particles', count: 10 },
      neonGradient: { cls: 'neon-gradient-particles', count: 5 },
      marbleLight: { cls: 'marble-light-particles', count: 5, noPos: true }
    };
    const c = config[animationType];
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${c.cls}`} aria-hidden="true">
        {Array.from({ length: c.count }).map((_, i) => {
          const style: any = { '--i': i };
          if (!c.noPos) {
            style.left = `${Math.random() * 100}%`;
            if (['bokehLights', 'pearlSparkle', 'mistCloud', 'candleFlicker', 'neonGradient'].includes(animationType)) {
              style.top = `${Math.random() * 100}%`;
            }
          }
          return (
            <span key={i} style={style}>
              {c.content ? c.content[i % c.content.length] : null}
            </span>
          );
        })}
      </div>
    );
  }

  // Normalize new keys to existing keys
  let normalizedType = animationType;
  if (animationType === 'goldParticles') normalizedType = 'gold-dust';
  if (animationType === 'rosePetals') normalizedType = 'rose-petals';
  if (animationType === 'pearlLight') normalizedType = 'pearl-shimmer';
  if (animationType === 'stars') normalizedType = 'starry-night';
  if (animationType === 'snowFall') normalizedType = 'snowflakes';
  if (animationType === 'leafFall') normalizedType = 'leaf-fall';
  if (animationType === 'candleLight') normalizedType = 'candlelight';
  if (animationType === 'glassShimmer') normalizedType = 'light-orbs';

  if (!normalizedType || normalizedType === 'none') return null;

  // CSS keyframes injected inline via <style> tag (no external deps)
  const renderStyle = () => {
    switch (normalizedType) {
      case 'gold-dust':
        return `
          @keyframes goldRise {
            0% { transform: translateY(100vh) translateX(0) scale(0); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.5; }
            100% { transform: translateY(-10vh) translateX(var(--drift)) scale(1); opacity: 0; }
          }
          .particle-gold { 
            position: absolute; bottom: 0; border-radius: 50%;
            background: radial-gradient(circle, #fff9c4 0%, ${primaryColor} 60%, transparent 100%);
            animation: goldRise var(--dur) var(--delay) infinite ease-in-out;
            will-change: transform, opacity;
          }
        `;
      case 'rose-petals':
        return `
          @keyframes petalFall {
            0% { transform: translateY(-5vh) translateX(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.9; }
            90% { opacity: 0.6; }
            100% { transform: translateY(105vh) translateX(var(--drift)) rotate(720deg); opacity: 0; }
          }
          .particle-petal {
            position: absolute; top: -10px;
            width: 12px; height: 16px;
            background: radial-gradient(ellipse, #fda4af 0%, #fb7185 70%, transparent 100%);
            border-radius: 50% 0 50% 0;
            animation: petalFall var(--dur) var(--delay) infinite ease-in-out;
            will-change: transform, opacity;
          }
        `;
      case 'sakura':
        return `
          @keyframes sakuraFall {
            0% { transform: translateY(-5vh) translateX(0) rotate(0deg) scale(0.8); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 0.7; }
            100% { transform: translateY(108vh) translateX(var(--drift)) rotate(540deg) scale(1.2); opacity: 0; }
          }
          .particle-sakura {
            position: absolute; top: -15px;
            width: 10px; height: 10px;
            background: radial-gradient(circle, #fce7f3 0%, #fbcfe8 70%, transparent 100%);
            border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%;
            animation: sakuraFall var(--dur) var(--delay) infinite ease-in-out;
            will-change: transform, opacity;
          }
        `;
      case 'light-orbs':
        return `
          @keyframes orbFloat {
            0% { transform: translateY(80vh) scale(0.3); opacity: 0; }
            30% { opacity: 0.6; }
            70% { opacity: 0.4; }
            100% { transform: translateY(-5vh) scale(1); opacity: 0; }
          }
          .particle-orb {
            position: absolute;
            background: radial-gradient(circle, rgba(255,255,220,0.9) 0%, ${primaryColor}60 50%, transparent 100%);
            border-radius: 50%;
            animation: orbFloat var(--dur) var(--delay) infinite ease-in-out;
            filter: blur(2px);
            will-change: transform, opacity;
          }
        `;
      case 'bokeh':
        return `
          @keyframes bokehDrift {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            25% { opacity: 0.4; }
            75% { opacity: 0.3; }
            100% { transform: translate(var(--drift), -30px) scale(1.3); opacity: 0; }
          }
          .particle-bokeh {
            position: absolute;
            background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, ${primaryColor}30 40%, transparent 100%);
            border-radius: 50%;
            animation: bokehDrift var(--dur) var(--delay) infinite ease-in-out;
            filter: blur(4px);
            will-change: transform, opacity;
          }
        `;
      case 'hearts':
        return `
          @keyframes heartFloat {
            0% { transform: translateY(80vh) scale(0.5) rotate(-10deg); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.5; }
            100% { transform: translateY(-5vh) scale(1) rotate(10deg); opacity: 0; }
          }
          .particle-heart {
            position: absolute;
            font-size: 14px;
            animation: heartFloat var(--dur) var(--delay) infinite ease-in-out;
            will-change: transform, opacity;
          }
        `;
      case 'starry-night':
        return `
          @keyframes starTwinkle {
            0%, 100% { opacity: 0.1; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          .particle-star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: starTwinkle var(--dur) var(--delay) infinite ease-in-out;
            will-change: transform, opacity;
          }
        `;
      case 'soft-mist':
        return `
          @keyframes mistDrift {
            0% { transform: translateX(-5%) scale(1); opacity: 0; }
            30% { opacity: 0.3; }
            70% { opacity: 0.2; }
            100% { transform: translateX(5%) scale(1.1); opacity: 0; }
          }
          .particle-mist {
            position: absolute;
            background: radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%);
            border-radius: 50%;
            animation: mistDrift var(--dur) var(--delay) infinite ease-in-out;
            filter: blur(20px);
            will-change: transform, opacity;
          }
        `;
      case 'pearl-shimmer':
        return `
          @keyframes pearlShimmer {
            0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
            40% { opacity: 0.9; }
            60% { opacity: 0.7; }
            100% { transform: translate(var(--drift), -40px) scale(1); opacity: 0; }
          }
          .particle-pearl {
            position: absolute;
            background: radial-gradient(circle, #ffffff 0%, #e8e0d0 50%, transparent 100%);
            border-radius: 50%;
            animation: pearlShimmer var(--dur) var(--delay) infinite ease-in-out;
            will-change: transform, opacity;
          }
        `;
      case 'confetti':
        return `
          @keyframes confettiFall {
            0% { transform: translateY(-5vh) rotate(0deg) translateX(0); opacity: 1; }
            100% { transform: translateY(108vh) rotate(720deg) translateX(var(--drift)); opacity: 0.3; }
          }
          .particle-confetti {
            position: absolute; top: -15px;
            width: 8px; height: 12px;
            animation: confettiFall var(--dur) var(--delay) infinite linear;
            will-change: transform, opacity;
          }
        `;
      case 'snowflakes':
        return `
          @keyframes snowFall {
            0% { transform: translateY(-5vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.6; }
            100% { transform: translateY(108vh) rotate(360deg); opacity: 0; }
          }
          .particle-snow {
            position: absolute; top: -15px;
            color: rgba(255,255,255,0.8);
            font-size: 16px;
            animation: snowFall var(--dur) var(--delay) infinite linear;
            will-change: transform, opacity;
          }
        `;
      case 'ocean-wave':
        return `
          @keyframes waveFlow {
            0% { transform: translateX(-100%) scaleY(1); opacity: 0; }
            50% { opacity: 0.3; scaleY(1.2); }
            100% { transform: translateX(100%) scaleY(1); opacity: 0; }
          }
          .particle-wave {
            position: absolute;
            background: linear-gradient(90deg, transparent, rgba(147,197,253,0.4), rgba(59,130,246,0.3), transparent);
            animation: waveFlow var(--dur) var(--delay) infinite ease-in-out;
            will-change: transform, opacity;
          }
        `;
      case 'silk-wave':
        return `
          @keyframes silkFlow {
            0% { transform: skewX(0deg) scaleX(1); opacity: 0; }
            50% { opacity: 0.15; transform: skewX(5deg) scaleX(1.05); }
            100% { transform: skewX(0deg) scaleX(1); opacity: 0; }
          }
          .particle-silk {
            position: absolute;
            background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 100%);
            animation: silkFlow var(--dur) var(--delay) infinite ease-in-out;
            will-change: transform, opacity;
          }
        `;
      case 'leaf-fall':
        return `
          @keyframes leafFall {
            0% { transform: translateY(-5vh) rotate(0deg) translateX(0); opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 0.7; }
            100% { transform: translateY(110vh) rotate(360deg) translateX(var(--drift)); opacity: 0; }
          }
          .particle-leaf {
            position: absolute; top: -15px;
            font-size: 18px;
            animation: leafFall var(--dur) var(--delay) infinite ease-in-out;
            will-change: transform, opacity;
          }
        `;
      case 'candlelight':
        return `
          @keyframes flicker {
            0%, 100% { transform: scale(1) translateY(0); opacity: 0.6; }
            25% { transform: scale(1.05) translateY(-3px); opacity: 0.9; }
            75% { transform: scale(0.95) translateY(2px); opacity: 0.7; }
          }
          .particle-candle {
            position: absolute;
            background: radial-gradient(circle, #fde68a 0%, #f59e0b 40%, transparent 100%);
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            animation: flicker var(--dur) var(--delay) infinite ease-in-out;
            filter: blur(3px);
            will-change: transform, opacity;
          }
        `;
      case 'neon-gradient':
        return `
          @keyframes neonPulse {
            0% { transform: scale(1) rotate(0deg); opacity: 0.15; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.35; }
            100% { transform: scale(1) rotate(360deg); opacity: 0.15; }
          }
          .particle-neon {
            position: absolute;
            border-radius: 50%;
            animation: neonPulse var(--dur) var(--delay) infinite ease-in-out;
            filter: blur(30px);
            will-change: transform, opacity;
          }
        `;
      case 'marble-reflection':
        return `
          @keyframes marbleShine {
            0% { transform: translateX(-100%) rotate(25deg); opacity: 0; }
            50% { opacity: 0.4; }
            100% { transform: translateX(300%) rotate(25deg); opacity: 0; }
          }
          .particle-marble {
            position: absolute;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
            animation: marbleShine var(--dur) var(--delay) infinite ease-in-out;
            will-change: transform, opacity;
          }
        `;
      case 'spotlight':
        return `
          @keyframes spotlightMove {
            0% { transform: translate(-10%, -10%) scale(1); opacity: 0.08; }
            50% { transform: translate(10%, 10%) scale(1.1); opacity: 0.18; }
            100% { transform: translate(-10%, -10%) scale(1); opacity: 0.08; }
          }
          .particle-spotlight {
            position: absolute;
            background: radial-gradient(circle, rgba(255,255,220,0.9) 0%, rgba(255,255,220,0.3) 30%, transparent 70%);
            border-radius: 50%;
            animation: spotlightMove var(--dur) var(--delay) infinite ease-in-out;
            will-change: transform, opacity;
          }
        `;
      default:
        return '';
    }
  };

  // Generate particle elements for each type
  const renderParticles = () => {
    switch (normalizedType) {
      case 'gold-dust': {
        const count = 18;
        return Array.from({ length: count }, (_, i) => {
          const size = 3 + Math.random() * 5;
          const left = (i / count) * 100 + (Math.random() * 6 - 3);
          const dur = 4 + Math.random() * 5;
          const delay = Math.random() * 6;
          const drift = (Math.random() * 80 - 40) + 'px';
          return (
            <div key={i} className="particle-gold" style={{
              width: size, height: size,
              left: `${left}%`,
              '--dur': `${dur}s`, '--delay': `${delay}s`, '--drift': drift,
            } as React.CSSProperties} />
          );
        });
      }
      case 'rose-petals':
      case 'sakura': {
        const cls = animationType === 'sakura' ? 'particle-sakura' : 'particle-petal';
        return Array.from({ length: 14 }, (_, i) => {
          const left = Math.random() * 100;
          const dur = 5 + Math.random() * 6;
          const delay = Math.random() * 8;
          const drift = (Math.random() * 100 - 50) + 'px';
          return (
            <div key={i} className={cls} style={{
              left: `${left}%`,
              '--dur': `${dur}s`, '--delay': `${delay}s`, '--drift': drift,
            } as React.CSSProperties} />
          );
        });
      }
      case 'hearts': {
        const emojis = ['❤️', '🩷', '💕', '💗'];
        return Array.from({ length: 12 }, (_, i) => {
          const left = Math.random() * 95;
          const dur = 5 + Math.random() * 5;
          const delay = Math.random() * 7;
          return (
            <div key={i} className="particle-heart" style={{
              left: `${left}%`,
              '--dur': `${dur}s`, '--delay': `${delay}s`,
            } as React.CSSProperties}>
              {emojis[i % emojis.length]}
            </div>
          );
        });
      }
      case 'light-orbs': {
        return Array.from({ length: 10 }, (_, i) => {
          const size = 30 + Math.random() * 60;
          const left = Math.random() * 100;
          const dur = 6 + Math.random() * 7;
          const delay = Math.random() * 8;
          return (
            <div key={i} className="particle-orb" style={{
              width: size, height: size, left: `${left}%`,
              '--dur': `${dur}s`, '--delay': `${delay}s`,
            } as React.CSSProperties} />
          );
        });
      }
      case 'bokeh': {
        return Array.from({ length: 12 }, (_, i) => {
          const size = 40 + Math.random() * 80;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const dur = 5 + Math.random() * 8;
          const delay = Math.random() * 7;
          const drift = (Math.random() * 40 - 20) + 'px';
          return (
            <div key={i} className="particle-bokeh" style={{
              width: size, height: size, left: `${left}%`, top: `${top}%`,
              '--dur': `${dur}s`, '--delay': `${delay}s`, '--drift': drift,
            } as React.CSSProperties} />
          );
        });
      }
      case 'starry-night': {
        return Array.from({ length: 25 }, (_, i) => {
          const size = 1.5 + Math.random() * 3;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const dur = 2 + Math.random() * 4;
          const delay = Math.random() * 5;
          return (
            <div key={i} className="particle-star" style={{
              width: size, height: size, left: `${left}%`, top: `${top}%`,
              '--dur': `${dur}s`, '--delay': `${delay}s`,
            } as React.CSSProperties} />
          );
        });
      }
      case 'soft-mist': {
        return Array.from({ length: 5 }, (_, i) => {
          const size = 200 + Math.random() * 300;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const dur = 10 + Math.random() * 10;
          const delay = Math.random() * 8;
          return (
            <div key={i} className="particle-mist" style={{
              width: size, height: size, left: `${left}%`, top: `${top}%`,
              '--dur': `${dur}s`, '--delay': `${delay}s`,
            } as React.CSSProperties} />
          );
        });
      }
      case 'pearl-shimmer': {
        return Array.from({ length: 15 }, (_, i) => {
          const size = 4 + Math.random() * 8;
          const left = Math.random() * 100;
          const top = 40 + Math.random() * 60;
          const dur = 3 + Math.random() * 4;
          const delay = Math.random() * 6;
          const drift = (Math.random() * 60 - 30) + 'px';
          return (
            <div key={i} className="particle-pearl" style={{
              width: size, height: size, left: `${left}%`, top: `${top}%`,
              '--dur': `${dur}s`, '--delay': `${delay}s`, '--drift': drift,
            } as React.CSSProperties} />
          );
        });
      }
      case 'confetti': {
        const colors = ['#f43f5e', '#facc15', '#34d399', '#60a5fa', '#c084fc', '#fb923c'];
        return Array.from({ length: 18 }, (_, i) => {
          const left = Math.random() * 100;
          const dur = 4 + Math.random() * 4;
          const delay = Math.random() * 7;
          const drift = (Math.random() * 120 - 60) + 'px';
          const color = colors[i % colors.length];
          return (
            <div key={i} className="particle-confetti" style={{
              left: `${left}%`,
              backgroundColor: color,
              '--dur': `${dur}s`, '--delay': `${delay}s`, '--drift': drift,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              transform: `rotate(${Math.random() * 360}deg)`,
            } as React.CSSProperties} />
          );
        });
      }
      case 'snowflakes': {
        const snowEmojis = ['❄', '❅', '❆', '✦'];
        return Array.from({ length: 14 }, (_, i) => {
          const left = Math.random() * 100;
          const dur = 5 + Math.random() * 7;
          const delay = Math.random() * 8;
          return (
            <div key={i} className="particle-snow" style={{
              left: `${left}%`,
              '--dur': `${dur}s`, '--delay': `${delay}s`,
            } as React.CSSProperties}>
              {snowEmojis[i % snowEmojis.length]}
            </div>
          );
        });
      }
      case 'leaf-fall': {
        const leafEmojis = ['🍁', '🍂', '🍃', '🌿'];
        return Array.from({ length: 12 }, (_, i) => {
          const left = Math.random() * 100;
          const dur = 5 + Math.random() * 6;
          const delay = Math.random() * 8;
          const drift = (Math.random() * 100 - 50) + 'px';
          return (
            <div key={i} className="particle-leaf" style={{
              left: `${left}%`,
              '--dur': `${dur}s`, '--delay': `${delay}s`, '--drift': drift,
            } as React.CSSProperties}>
              {leafEmojis[i % leafEmojis.length]}
            </div>
          );
        });
      }
      case 'candlelight': {
        return Array.from({ length: 6 }, (_, i) => {
          const size = 40 + Math.random() * 60;
          const left = 10 + (i / 6) * 80;
          const top = 30 + Math.random() * 40;
          const dur = 1.5 + Math.random() * 2;
          const delay = Math.random() * 2;
          return (
            <div key={i} className="particle-candle" style={{
              width: size, height: size * 1.4,
              left: `${left}%`, top: `${top}%`,
              '--dur': `${dur}s`, '--delay': `${delay}s`,
            } as React.CSSProperties} />
          );
        });
      }
      case 'neon-gradient': {
        const neonColors = ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981'];
        return Array.from({ length: 4 }, (_, i) => {
          const size = 150 + Math.random() * 200;
          const positions = [
            { left: '10%', top: '10%' },
            { left: '70%', top: '5%' },
            { left: '5%', top: '60%' },
            { left: '75%', top: '65%' },
          ];
          const dur = 6 + i * 2;
          const delay = i * 1.5;
          return (
            <div key={i} className="particle-neon" style={{
              width: size, height: size,
              ...positions[i],
              background: `radial-gradient(circle, ${neonColors[i]}60 0%, transparent 70%)`,
              '--dur': `${dur}s`, '--delay': `${delay}s`,
            } as React.CSSProperties} />
          );
        });
      }
      case 'marble-reflection': {
        return Array.from({ length: 3 }, (_, i) => {
          const dur = 5 + i * 3;
          const delay = i * 4;
          const top = 10 + i * 30;
          return (
            <div key={i} className="particle-marble" style={{
              width: '60%', height: '3px',
              top: `${top}%`, left: 0,
              '--dur': `${dur}s`, '--delay': `${delay}s`,
            } as React.CSSProperties} />
          );
        });
      }
      case 'spotlight': {
        return Array.from({ length: 2 }, (_, i) => {
          const size = 300 + i * 200;
          const positions = [{ left: '30%', top: '20%' }, { left: '60%', top: '50%' }];
          const dur = 8 + i * 3;
          const delay = i * 4;
          return (
            <div key={i} className="particle-spotlight" style={{
              width: size, height: size,
              ...positions[i],
              '--dur': `${dur}s`, '--delay': `${delay}s`,
            } as React.CSSProperties} />
          );
        });
      }
      case 'ocean-wave': {
        return Array.from({ length: 3 }, (_, i) => {
          const dur = 6 + i * 2;
          const delay = i * 2;
          const top = 30 + i * 20;
          return (
            <div key={i} className="particle-wave" style={{
              width: '120%', height: '60px',
              top: `${top}%`, left: '-10%',
              '--dur': `${dur}s`, '--delay': `${delay}s`,
            } as React.CSSProperties} />
          );
        });
      }
      case 'silk-wave': {
        return Array.from({ length: 4 }, (_, i) => {
          const dur = 7 + i * 2;
          const delay = i * 2;
          const top = 15 + i * 20;
          return (
            <div key={i} className="particle-silk" style={{
              width: '100%', height: '80px',
              top: `${top}%`, left: 0,
              '--dur': `${dur}s`, '--delay': `${delay}s`,
            } as React.CSSProperties} />
          );
        });
      }
      default:
        return null;
    }
  };

  const styleContent = renderStyle();
  if (!styleContent) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: styleContent }} />
      {renderParticles()}
    </div>
  );
}
