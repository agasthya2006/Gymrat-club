// src/components/common/DumbbellCursor.tsx
import React, { useEffect, useRef, useState } from 'react';

interface DroppedDumbbell {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  rotation: number;
  createdAt: number;
  phase: 'dropping' | 'impact' | 'settled' | 'fading';
}

export const DumbbellCursor: React.FC = () => {
  const [isDesktopFinePointer, setIsDesktopFinePointer] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [droppedList, setDroppedList] = useState<DroppedDumbbell[]>([]);

  // Refs for tracking cursor without triggering React re-renders on every frame
  const followerRef = useRef<HTMLDivElement | null>(null);
  const mousePosRef = useRef({ x: -100, y: -100 });
  const followerPosRef = useRef({ x: -100, y: -100, vx: 0, rotation: 0 });
  const isVisibleRef = useRef(false);
  const rAFIdRef = useRef<number | null>(null);

  // Check pointer capability: Strictly fine pointer (mouse/trackpad), NEVER touchscreens
  useEffect(() => {
    const finePointerQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    setIsDesktopFinePointer(finePointerQuery.matches);
    setPrefersReducedMotion(reducedMotionQuery.matches);

    const handlePointerChange = (e: MediaQueryListEvent) => setIsDesktopFinePointer(e.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    finePointerQuery.addEventListener('change', handlePointerChange);
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    return () => {
      finePointerQuery.removeEventListener('change', handlePointerChange);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Desktop Cursor Follower Loop (rAF + lerp)
  useEffect(() => {
    if (!isDesktopFinePointer || prefersReducedMotion) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        followerPosRef.current.x = e.clientX + 14;
        followerPosRef.current.y = e.clientY + 14;
      }

      // Check if hovering clickable elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest('button, a, input, select, textarea, [role="button"], .clickable, [onclick]');
        setIsHoveringClickable(isClickable);
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      if (followerRef.current) {
        followerRef.current.style.opacity = '0';
      }
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      if (followerRef.current) {
        followerRef.current.style.opacity = '1';
      }
    };

    // Continuous Animation Frame loop
    const animate = () => {
      if (followerRef.current && isVisibleRef.current) {
        // Offset: +14px to the right and bottom of cursor so pointer is never occluded
        const targetX = mousePosRef.current.x + 14;
        const targetY = mousePosRef.current.y + 14;

        // Smooth physics-based interpolation (lerp factor ~0.18 for floating weight feel)
        const dx = targetX - followerPosRef.current.x;
        const dy = targetY - followerPosRef.current.y;

        followerPosRef.current.x += dx * 0.18;
        followerPosRef.current.y += dy * 0.18;

        // Subtle tilt based on movement speed and direction
        const targetRotation = Math.max(-25, Math.min(25, dx * 0.65));
        followerPosRef.current.rotation += (targetRotation - followerPosRef.current.rotation) * 0.15;

        // Apply hardware-accelerated transform
        const scale = isHoveringClickable ? 1.15 : 1.0;
        followerRef.current.style.transform = `translate3d(${followerPosRef.current.x}px, ${followerPosRef.current.y}px, 0) rotate(${followerPosRef.current.rotation}deg) scale(${scale})`;
        followerRef.current.style.opacity = '1';
      }

      rAFIdRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    rAFIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rAFIdRef.current) cancelAnimationFrame(rAFIdRef.current);
    };
  }, [isDesktopFinePointer, prefersReducedMotion, isHoveringClickable]);

  // Click Handler: ONLY on Desktop with fine pointer
  useEffect(() => {
    if (!isDesktopFinePointer || prefersReducedMotion) {
      return;
    }

    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      const startX = followerPosRef.current.x > 0 ? followerPosRef.current.x : clickX + 12;
      const startY = followerPosRef.current.y > 0 ? followerPosRef.current.y : clickY - 15;
      const currentRot = followerPosRef.current.rotation || 0;

      const newId = Date.now() + Math.random();
      const newDropped: DroppedDumbbell = {
        id: newId,
        startX,
        startY,
        targetX: clickX - 14,
        targetY: clickY - 8,
        rotation: currentRot + (Math.random() * 24 - 12),
        createdAt: Date.now(),
        phase: 'dropping'
      };

      setDroppedList(prev => {
        const updated = [...prev, newDropped];
        return updated.length > 12 ? updated.slice(updated.length - 12) : updated;
      });
    };

    window.addEventListener('click', handleClick, { passive: true });

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [isDesktopFinePointer, prefersReducedMotion]);

  // Dropped Dumbbells Lifecycle: 1-second total lifecycle with smooth fade-out
  useEffect(() => {
    if (!isDesktopFinePointer || droppedList.length === 0) return;

    const timer = setInterval(() => {
      const now = Date.now();
      setDroppedList(prev => {
        const next = prev
          .map(item => {
            const age = now - item.createdAt;
            if (age > 1050) {
              return null; // Removed completely after 1s total lifecycle
            } else if (age > 600 && item.phase !== 'fading') {
              return { ...item, phase: 'fading' as const };
            } else if (age > 260 && item.phase === 'dropping') {
              return { ...item, phase: 'settled' as const };
            }
            return item;
          })
          .filter((item): item is DroppedDumbbell => item !== null);

        return next;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [isDesktopFinePointer, droppedList.length]);

  // Return nothing on mobile / touch devices for 100% native smooth scrolling
  if (!isDesktopFinePointer || prefersReducedMotion) {
    return null;
  }

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. DESKTOP CURSOR FOLLOWER INSTANCE */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-5 pointer-events-none will-change-transform transition-opacity duration-150"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          opacity: 0,
          filter: isHoveringClickable 
            ? 'drop-shadow(0 0 6px rgba(225,96,27,0.75))' 
            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))'
        }}
      >
        <DumbbellSVG isGlow={isHoveringClickable} />
      </div>

      {/* 2. DROPPED DUMBBELL INSTANCES (1-SECOND LIFECYCLE) */}
      {droppedList.map(item => (
        <DroppedDumbbellItem key={item.id} item={item} />
      ))}
    </div>
  );
};

// Sub-component for individual dropped dumbbell physics & 1s smooth fade
const DroppedDumbbellItem: React.FC<{ item: DroppedDumbbell }> = ({ item }) => {
  const [styleState, setStyleState] = useState<{
    x: number;
    y: number;
    rotation: number;
    scale: number;
    opacity: number;
    transition: string;
  }>({
    x: item.startX,
    y: item.startY,
    rotation: item.rotation,
    scale: 0.95,
    opacity: 1,
    transition: 'none'
  });

  useEffect(() => {
    // 1. Drop down toward click position (0ms - 220ms)
    const dropTimer = setTimeout(() => {
      setStyleState({
        x: item.targetX,
        y: item.targetY,
        rotation: item.rotation + 16,
        scale: 1.04,
        opacity: 1,
        transition: 'transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });
    }, 10);

    // 2. Micro impact bounce (220ms - 340ms)
    const bounceTimer = setTimeout(() => {
      setStyleState(prev => ({
        ...prev,
        y: item.targetY - 2,
        scale: 1.0,
        rotation: item.rotation + 10,
        transition: 'transform 120ms ease-out'
      }));
    }, 220);

    // 3. Settle completely (340ms - 550ms)
    const settleTimer = setTimeout(() => {
      setStyleState(prev => ({
        ...prev,
        y: item.targetY,
        scale: 1.0,
        rotation: item.rotation + 10,
        transition: 'transform 90ms ease-in'
      }));
    }, 340);

    // 4. Smooth 1-second fade out (starts at 580ms, finishes at ~1000ms)
    const fadeTimer = setTimeout(() => {
      setStyleState(prev => ({
        ...prev,
        y: item.targetY + 4,
        scale: 0.85,
        opacity: 0,
        transition: 'opacity 420ms ease-out, transform 420ms ease-out'
      }));
    }, 580);

    return () => {
      clearTimeout(dropTimer);
      clearTimeout(bounceTimer);
      clearTimeout(settleTimer);
      clearTimeout(fadeTimer);
    };
  }, [item.id, item.targetX, item.targetY, item.rotation]);

  return (
    <div
      className="fixed top-0 left-0 w-8 h-5 pointer-events-none will-change-transform"
      style={{
        transform: `translate3d(${styleState.x}px, ${styleState.y}px, 0) rotate(${styleState.rotation}deg) scale(${styleState.scale})`,
        opacity: styleState.opacity,
        transition: styleState.transition,
        filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.85))'
      }}
    >
      <DumbbellSVG isGlow={false} />
    </div>
  );
};

// Premium GymRat Dumbbell Vector Graphic: Stepped Hex Plates, Knurled Steel Grip & Orange Collars
const DumbbellSVG: React.FC<{ isGlow?: boolean }> = ({ isGlow }) => {
  return (
    <svg 
      viewBox="0 0 32 18" 
      className="w-full h-full object-contain"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central Knurled Steel Bar */}
      <rect x="7" y="7.5" width="18" height="3" rx="1" fill="#71717A" stroke="#27272A" strokeWidth="0.5" />
      {/* Knurling Grid Lines */}
      <line x1="10" y1="7.5" x2="10" y2="10.5" stroke="#A1A1AA" strokeWidth="0.6" strokeDasharray="0.8 0.6" />
      <line x1="13" y1="7.5" x2="13" y2="10.5" stroke="#A1A1AA" strokeWidth="0.6" strokeDasharray="0.8 0.6" />
      <line x1="16" y1="7.5" x2="16" y2="10.5" stroke="#A1A1AA" strokeWidth="0.6" strokeDasharray="0.8 0.6" />
      <line x1="19" y1="7.5" x2="19" y2="10.5" stroke="#A1A1AA" strokeWidth="0.6" strokeDasharray="0.8 0.6" />
      <line x1="22" y1="7.5" x2="22" y2="10.5" stroke="#A1A1AA" strokeWidth="0.6" strokeDasharray="0.8 0.6" />

      {/* LEFT WEIGHT STACK */}
      <rect x="1" y="4" width="2" height="10" rx="0.75" fill="#18181B" stroke="#3F3F46" strokeWidth="0.5" />
      <rect x="3.5" y="2.5" width="2" height="13" rx="0.75" fill="#14151C" stroke="#3F3F46" strokeWidth="0.5" />
      <rect x="6" y="1" width="2.5" height="16" rx="0.75" fill="#0D0D11" stroke="#52525B" strokeWidth="0.5" />
      <rect x="8.5" y="6" width="1.5" height="6" rx="0.5" fill="#E1601B" stroke="#FF7728" strokeWidth="0.3" />

      {/* RIGHT WEIGHT STACK */}
      <rect x="22" y="6" width="1.5" height="6" rx="0.5" fill="#E1601B" stroke="#FF7728" strokeWidth="0.3" />
      <rect x="23.5" y="1" width="2.5" height="16" rx="0.75" fill="#0D0D11" stroke="#52525B" strokeWidth="0.5" />
      <rect x="26.5" y="2.5" width="2" height="13" rx="0.75" fill="#14151C" stroke="#3F3F46" strokeWidth="0.5" />
      <rect x="29" y="4" width="2" height="10" rx="0.75" fill="#18181B" stroke="#3F3F46" strokeWidth="0.5" />

      {/* Subtle Orange Glow Accent on Plates */}
      {isGlow && (
        <>
          <circle cx="7.2" cy="9" r="1.5" fill="#E1601B" fillOpacity="0.8" />
          <circle cx="24.8" cy="9" r="1.5" fill="#E1601B" fillOpacity="0.8" />
        </>
      )}
    </svg>
  );
};
