
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { Peripheral } from '@/lib/site-config';

interface PeripheralsDrawerProps {
  peripherals: Peripheral[];
  subtitle?: string;
  cardImage?: string;
}

export function PeripheralsDrawer({ peripherals, subtitle, cardImage }: PeripheralsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial state without animation
    gsap.set(drawerRef.current, { height: 0, opacity: 0, marginTop: 0 });
  }, []);

  useEffect(() => {
    const drawerElement = drawerRef.current;
    if (!drawerElement) return;

    if (isOpen) {
      gsap.to(drawerElement, {
        height: 'auto',
        opacity: 1,
        marginTop: '0.5rem', // Corresponds to mt-2
        duration: 0.5,
        ease: 'power3.out',
      });
    } else {
      gsap.to(drawerElement, {
        height: 0,
        opacity: 0,
        marginTop: 0,
        duration: 0.5,
        ease: 'power3.inOut',
      });
    }
  }, [isOpen]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handlePeripheralClick = (e: React.MouseEvent, link: string) => {
    if (link) {
      e.stopPropagation();
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="group block overflow-hidden rounded-lg transition-all duration-300 ease-in-out md:hover:scale-105 cursor-pointer bg-black/50 border border-white/10"
        style={{
          boxShadow: '0 0 15px rgba(174, 194, 224, 0.4), 0 0 25px rgba(174, 194, 224, 0.2)',
        }}
        onClick={toggleDrawer}
      >
        <Image
          src={cardImage || 'https://i.imgur.com/Xbiudsl.png'}
          alt="My Peripherals"
          width={1600}
          height={600}
          className="w-full h-auto object-cover rounded-t-lg"
        />
        <div className="p-4 text-white text-center">
          <h2 className="text-2xl font-bold">Breakdown of my workstation</h2>
          <p className="text-sm opacity-90">{subtitle || 'Complete workstation essentials'}</p>
          <div className="flex items-center justify-center mt-2">
            <ChevronDown className={`h-6 w-6 text-white transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      <div
        ref={drawerRef}
        className="overflow-hidden" // Keep overflow hidden to clip content during animation
      >
        <div className="p-4 bg-black border border-[#040707] rounded-lg shadow-2xl shadow-slate-900/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {peripherals.map((item) => (
              <div
                key={item.id}
                className={`bg-[#040707] p-3 rounded-md border border-gray-800/50 text-left transition-all ${item.link ? 'cursor-pointer hover:bg-gray-800/50 hover:border-purple-500/50' : ''
                  }`}
                onClick={(e) => handlePeripheralClick(e, item.link)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  {item.link && (
                    <ExternalLink className="w-4 h-4 text-purple-400 flex-shrink-0 ml-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
