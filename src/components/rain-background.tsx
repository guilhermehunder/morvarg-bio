
"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface RainDrop {
  id: number
  left: number
  animationDuration: number
  opacity: number
  size: number
  delay: number
}

interface Lightning {
  id: number
  type: "flash" | "bolt"
  intensity: number
  duration: number
}

interface RainBackgroundProps {
  intensity?: number
  speed?: number
  color?: string
  angle?: number
  dropSize?: {
    min: number
    max: number
  }
  lightningEnabled?: boolean
  lightningFrequency?: number
  thunderEnabled?: boolean
  thunderVolume?: number
  thunderDelay?: number
  className?: string
  children?: React.ReactNode
}

const defaultProps: Required<Omit<RainBackgroundProps, 'className' | 'children'>> = {
  intensity: 500,
  speed: 0.5,
  color: "rgba(174, 194, 224, 0.6)",
  angle: 10,
  dropSize: { min: 1, max: 2 },
  lightningEnabled: true,
  lightningFrequency: 8,
  thunderEnabled: true,
  thunderVolume: 0.2,
  thunderDelay: 2,
};

export default function RainBackground({
  children,
  className,
  ...props
}: RainBackgroundProps) {
  const options = { ...defaultProps, ...props };
  const {
    intensity,
    speed,
    color,
    angle,
    dropSize,
    lightningEnabled,
    lightningFrequency,
    thunderEnabled,
    thunderVolume,
    thunderDelay,
  } = options;

  const [raindrops, setRaindrops] = useState<RainDrop[]>([]);
  const [lightning, setLightning] = useState<Lightning | null>(null);
  const [, setIsFlashing] = useState(false);
  const thunderAudioRef = useRef<HTMLAudioElement | null>(null);
  const lightningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize thunder audio
  useEffect(() => {
    if (!isMounted || !thunderEnabled || typeof window === "undefined") return;
    
    thunderAudioRef.current = new Audio();
    thunderAudioRef.current.volume = thunderVolume;
    thunderAudioRef.current.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT";
    
  }, [isMounted, thunderEnabled, thunderVolume]);

  // Generate raindrops
  useEffect(() => {
    if (!isMounted) return;

    const drops: RainDrop[] = [];
    for (let i = 0; i < intensity; i++) {
      drops.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: (Math.random() * 1 + 0.5) / speed,
        opacity: Math.random() * 0.6 + 0.2,
        size: Math.random() * (dropSize.max - dropSize.min) + dropSize.min,
        delay: Math.random() * 2,
      });
    }
    setRaindrops(drops);
  }, [isMounted, intensity, speed, dropSize]);

  // Lightning effect
  const triggerLightning = useCallback(() => {
    if (!lightningEnabled) return;

    const lightningTypes: ("flash" | "bolt")[] = ["flash", "flash", "bolt"];
    const type = lightningTypes[Math.floor(Math.random() * lightningTypes.length)];
    const intensity = Math.random() * 0.8 + 0.2;
    const duration = type === "flash" ? 150 + Math.random() * 100 : 300 + Math.random() * 200;

    const newLightning: Lightning = { id: Date.now(), type, intensity, duration };

    setLightning(newLightning);
    setIsFlashing(true);

    setTimeout(() => {
      setIsFlashing(false);
      setLightning(null);
    }, duration);

    if (thunderEnabled && thunderAudioRef.current) {
      setTimeout(() => {
        if (thunderAudioRef.current) {
          thunderAudioRef.current.currentTime = 0;
          thunderAudioRef.current.play().catch(() => {
            console.log("Thunder audio blocked by browser autoplay policy");
          });
        }
      }, thunderDelay * 1000);
    }

    const nextLightning = (lightningFrequency + Math.random() * lightningFrequency) * 1000;
    lightningTimeoutRef.current = setTimeout(triggerLightning, nextLightning);
  }, [lightningEnabled, lightningFrequency, thunderEnabled, thunderDelay]);

  // Start lightning cycle
  useEffect(() => {
    if (!isMounted || !lightningEnabled) return;
    
    const initialDelay = Math.random() * lightningFrequency * 1000;
    lightningTimeoutRef.current = setTimeout(triggerLightning, initialDelay);

    return () => {
      if (lightningTimeoutRef.current) {
        clearTimeout(lightningTimeoutRef.current);
      }
    };
  }, [isMounted, lightningEnabled, triggerLightning]);

  const generateBoltPath = () => {
    const startX = Math.random() * 100;
    const segments = 8 + Math.random() * 4;
    let path = `M ${startX} 0`;
    let currentX = startX;
    let currentY = 0;

    for (let i = 1; i <= segments; i++) {
      const segmentHeight = 100 / segments;
      currentY = i * segmentHeight;
      currentX += (Math.random() - 0.5) * 20;
      currentX = Math.max(0, Math.min(100, currentX));
      path += ` L ${currentX} ${currentY}`;
    }
    return path;
  };

  return (
    <div className={cn("absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden", className)}>
      {isMounted && (
        <>
          {lightning && (
            <>
              {lightning.type === "flash" && (
                <div
                  className="animate-lightning-flash pointer-events-none absolute inset-0 z-20"
                  style={{
                    background: `radial-gradient(circle, rgba(255, 255, 255, ${lightning.intensity}) 0%, rgba(135, 206, 235, ${lightning.intensity * 0.3}) 50%, transparent 100%)`,
                    animationDuration: `${lightning.duration}ms`,
                  }}
                />
              )}
              {lightning.type === "bolt" && (
                <div className="pointer-events-none absolute inset-0 z-20">
                  <svg
                    className="animate-lightning-bolt h-full w-full"
                    style={{ animationDuration: `${lightning.duration}ms` }}
                  >
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <path
                      d={generateBoltPath()}
                      stroke={`rgba(255, 255, 255, ${lightning.intensity})`}
                      strokeWidth="2"
                      fill="none"
                      filter="url(#glow)"
                    />
                    <path
                      d={generateBoltPath()}
                      stroke={`rgba(135, 206, 235, ${lightning.intensity * 0.8})`}
                      strokeWidth="1"
                      fill="none"
                    />
                  </svg>
                </div>
              )}
            </>
          )}

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: "center center",
            }}
          >
            {raindrops.map((drop) => (
              <div
                key={drop.id}
                className="animate-rain-fall absolute"
                style={{
                  left: `${drop.left}%`,
                  width: `${drop.size}px`,
                  height: `${drop.size * 10}px`,
                  background: `linear-gradient(to bottom, transparent, ${color})`,
                  borderRadius: `${drop.size}px`,
                  animationDuration: `${drop.animationDuration}s`,
                  animationDelay: `${drop.delay}s`,
                  opacity: drop.opacity,
                  top: "-20px",
                }}
              />
            ))}
          </div>
        </>
      )}

      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes rain-fall {
          0% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(calc(100vh + 20px));
          }
        }
        @keyframes lightning-flash {
          0%, 100% { opacity: 0; }
          10% { opacity: 1; }
          20% { opacity: 0.3; }
          30% { opacity: 1; }
          40% { opacity: 0; }
        }
        @keyframes lightning-bolt {
          0%, 100% { opacity: 0; }
          10% { opacity: 1; }
          20% { opacity: 0.7; }
          30% { opacity: 1; }
          40% { opacity: 0.4; }
          50% { opacity: 0.8; }
          60% { opacity: 0; }
        }
        .animate-rain-fall { animation: rain-fall linear infinite; }
        .animate-lightning-flash { animation: lightning-flash ease-out forwards; }
        .animate-lightning-bolt { animation: lightning-bolt ease-out forwards; }
      `}</style>
    </div>
  )
}
