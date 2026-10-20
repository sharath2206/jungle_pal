import React, { useState, useEffect, useRef } from 'react';
import { FAVORITE_ANIMALS } from '../theme/footprints';

export const FootprintOverlay = ({ favoriteAnimal = 'cheetah' }) => {
  const [footprints, setFootprints] = useState([]);
  const footStepCounter = useRef(0);

  const animalConfig = FAVORITE_ANIMALS[favoriteAnimal] || FAVORITE_ANIMALS.cheetah;

  useEffect(() => {
    const handlePointerDown = (e) => {
      // Don't spawn if coordinates are invalid (e.g. synthetic events with 0, 0 outside window)
      if (typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return;
      if (e.clientX === 0 && e.clientY === 0 && e.isTrusted === false) return;

      footStepCounter.current += 1;
      // Alternate left / right paw angle for realistic animal tracking
      const isRightPaw = footStepCounter.current % 2 === 0;
      const baseAngle = isRightPaw ? 14 : -14;
      const angleJitter = (Math.random() - 0.5) * 8;
      const finalAngle = baseAngle + angleJitter;

      const newFootprint = {
        id: `${Date.now()}-${Math.random()}`,
        x: e.clientX,
        y: e.clientY,
        rotation: finalAngle,
        scale: 0.92 + Math.random() * 0.18,
        animalId: favoriteAnimal,
      };

      setFootprints((prev) => [...prev.slice(-15), newFootprint]);

      // Remove after 750ms
      setTimeout(() => {
        setFootprints((prev) => prev.filter((p) => p.id !== newFootprint.id));
      }, 750);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [favoriteAnimal]);

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes footprintPopFade {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--rot)) scale(0.45);
          }
          18% {
            opacity: 0.95;
            transform: translate(-50%, -50%) rotate(var(--rot)) scale(1.15);
          }
          35% {
            opacity: 0.9;
            transform: translate(-50%, -50%) rotate(var(--rot)) scale(1);
          }
          70% {
            opacity: 0.65;
            transform: translate(-50%, -50%) rotate(var(--rot)) scale(0.98);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--rot)) scale(0.92);
          }
        }
      `}</style>
      {footprints.map((fp) => {
        const pal = FAVORITE_ANIMALS[fp.animalId] || animalConfig;
        return (
          <div
            key={fp.id}
            style={{
              position: 'absolute',
              left: `${fp.x}px`,
              top: `${fp.y}px`,
              width: '44px',
              height: '44px',
              pointerEvents: 'none',
              willChange: 'transform, opacity',
              '--rot': `${fp.rotation}deg`,
              animation: 'footprintPopFade 0.75s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards',
              filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.18))',
            }}
            dangerouslySetInnerHTML={{ __html: pal.svgPaw }}
          />
        );
      })}
    </div>
  );
};
