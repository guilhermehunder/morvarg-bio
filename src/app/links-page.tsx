
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { gsap } from 'gsap';
import RainBackground from '@/components/rain-background';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PeripheralsDrawer } from '@/components/peripherals-drawer';

export default function LinksPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [volume, setVolume] = useState(0.2);
    const [isMuted, setIsMuted] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;
        
        gsap.fromTo(
            ".fade-in", 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.5 }
        );
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const handleVolumeChange = (newVolume: number[]) => {
        setVolume(newVolume[0]);
        if (isMuted && newVolume[0] > 0) {
            setIsMuted(false);
        }
    };
    
    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handlePlayAudio = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(error => {
                console.error("Audio play failed:", error);
            });
            setHasInteracted(true);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <audio ref={audioRef} id="bg-audio" src="https://firebasestorage.googleapis.com/v0/b/studio-7654894928-c00a4.firebasestorage.app/o/Love%20My%20Tone.mp3?alt=media&token=ff816d18-e6c5-4987-a86c-a86cd9c55048" loop></audio>
          
          {!hasInteracted && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <button 
                      onClick={handlePlayAudio}
                      className="px-8 py-4 text-xl font-semibold text-white bg-black/40 border border-white/20 rounded-xl hover:bg-black/60 transition-colors"
                  >
                      Clique para ativar o som
                  </button>
              </div>
          )}

          <RainBackground>
            <main ref={containerRef} className="relative z-10 flex flex-col items-center w-full max-w-2xl text-center text-foreground">
                <h1 className="fade-in font-gothic text-7xl md:text-8xl font-bold text-white mb-8 select-none" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                    Morvarg
                </h1>

                <div className="w-full flex flex-col space-y-4">
                   <PeripheralsDrawer />
                </div>

                <footer className="fade-in mt-12 text-center text-sm text-foreground/50">
                    <p>&copy; {new Date().getFullYear()} Morvarg. Todos os direitos reservados.</p>
                </footer>
            </main>
            </RainBackground>
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20 md:left-5 md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:translate-x-0">
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="p-3 rounded-full bg-black/40 text-white/80 backdrop-blur-md hover:bg-black/60 transition-colors">
                            <Music size={20} />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="center" className="w-48 bg-black/50 border-white/20 text-white backdrop-blur-lg md:side-right md:align-start">
                        <div className="flex items-center gap-3">
                            <button onClick={toggleMute}>
                                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                            <Slider
                                value={[isMuted ? 0 : volume]}
                                onValueChange={handleVolumeChange}
                                max={1}
                                step={0.01}
                                className="w-full"
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
