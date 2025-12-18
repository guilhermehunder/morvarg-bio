
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Music, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import RainBackground from '@/components/rain-background';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PeripheralsDrawer } from '@/components/peripherals-drawer';
import { usePublicSiteConfig } from '@/hooks/use-site-config';

export default function LinksPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [volume, setVolume] = useState(0.2);
    const [isMuted, setIsMuted] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const { config, isLoading } = usePublicSiteConfig();

    useEffect(() => {
        if (!containerRef.current || isLoading) return;

        gsap.fromTo(
            ".fade-in",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.5 }
        );
    }, [isLoading]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Set initial volume from config
    useEffect(() => {
        if (config?.music.volume) {
            setVolume(config.music.volume);
        }
    }, [config?.music.volume]);

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

    if (isLoading || !config) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
        );
    }

    const musicUrl = config.music.url;
    const musicEnabled = config.music.enabled;

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4">
            {musicEnabled && (
                <audio ref={audioRef} id="bg-audio" src={musicUrl} loop></audio>
            )}

            {musicEnabled && !hasInteracted && (
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
                <main ref={containerRef} className="relative z-10 flex flex-col items-center w-full max-w-2xl text-center text-white">
                    {/* Banner - Optional large cover image */}
                    {config.banner?.enabled && config.banner.imageUrl && (
                        <div className="fade-in w-full mb-8 -mt-8 overflow-hidden rounded-2xl">
                            <img
                                src={config.banner.imageUrl}
                                alt="Banner"
                                className="w-full object-cover"
                                style={{ height: `${config.banner.height || 200}px` }}
                            />
                        </div>
                    )}

                    {/* Logo or Title */}
                    {config.profile.logo ? (
                        <img
                            src={config.profile.logo}
                            alt={config.profile.title}
                            className="fade-in object-contain mb-8"
                            style={{
                                filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.7))',
                                maxHeight: `${(config.profile.logoSize || 1) * 160}px`
                            }}
                        />
                    ) : (
                        <h1 className="fade-in font-gothic text-7xl md:text-8xl font-bold mb-8 select-none text-white" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                            {config.profile.title}
                        </h1>
                    )}

                    {/* Social Links Icons */}
                    {config.socialLinks && config.socialLinks.length > 0 && (
                        <div className="fade-in flex gap-3 mb-6">
                            {config.socialLinks
                                .filter(social => social.url && social.url.trim() !== '')
                                .sort((a, b) => a.order - b.order)
                                .map((social) => {
                                    const platformIcons: Record<string, string> = {
                                        instagram: '📷',
                                        twitter: '🐦',
                                        tiktok: '🎵',
                                        youtube: '▶️',
                                        linkedin: '💼',
                                        github: '🐙',
                                        facebook: '👍',
                                        twitch: '🎮',
                                        discord: '💬',
                                        other: '🔗'
                                    };
                                    return (
                                        <a
                                            key={social.id}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 bg-white/10 hover:bg-white/20 border border-white/20"
                                            title={social.platform}
                                        >
                                            <span className="text-2xl">{platformIcons[social.platform] || '🔗'}</span>
                                        </a>
                                    );
                                })}
                        </div>
                    )}

                    {/* Tags - Category chips */}
                    {config.tags && config.tags.length > 0 && (
                        <div className="fade-in flex flex-wrap gap-2 justify-center mb-6">
                            {config.tags
                                .sort((a, b) => a.order - b.order)
                                .map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="px-4 py-1.5 rounded-full text-sm font-medium transition-all bg-white/10 border border-white/20"
                                        style={{
                                            backgroundColor: tag.color ? `${tag.color}20` : undefined,
                                            borderColor: tag.color || undefined,
                                            color: tag.color || '#fff'
                                        }}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                        </div>
                    )}

                    {/* Media Kit - Special card */}
                    {config.mediaKit?.enabled && config.mediaKit.url && (
                        <div className="fade-in w-full mb-4">
                            <a
                                href={config.mediaKit.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full p-6 rounded-2xl border-2 transition-all duration-300 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/50 hover:border-purple-400"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-500/20">
                                        <span className="text-2xl">📄</span>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="font-bold text-lg text-white">
                                            {config.mediaKit.title || 'View My Media Kit'}
                                        </h3>
                                        {config.mediaKit.subtitle && (
                                            <p className="text-sm text-purple-200">
                                                {config.mediaKit.subtitle}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-2xl">→</span>
                                </div>
                            </a>
                        </div>
                    )}

                    <div className="w-full flex flex-col space-y-4">
                        {/* Render new blocks if available */}
                        {config.blocks?.map((block) => {
                            // Filter out links without URLs
                            const validLinks = block.links.filter(l => l.link && l.link.trim() !== '');

                            // Don't render block if it has no valid links
                            if (validLinks.length === 0) return null;

                            return (
                                <PeripheralsDrawer
                                    key={block.id}
                                    peripherals={validLinks.map(l => ({
                                        id: l.id,
                                        name: l.name,
                                        description: l.description,
                                        link: l.link,
                                        image: '',
                                        order: l.order,
                                    }))}
                                    subtitle={block.subtitle}
                                    cardImage={block.image}
                                    title={block.title}
                                />
                            );
                        })}

                        {/* Fallback to legacy peripherals if no blocks */}
                        {(!config.blocks || config.blocks.length === 0) && config.peripherals?.length > 0 && (
                            <PeripheralsDrawer
                                peripherals={config.peripherals}
                                subtitle={config.profile.subtitle}
                                cardImage={config.peripheralsCardImage}
                            />
                        )}

                        {/* Solo Links - Standalone buttons (only show with valid URLs) */}
                        {config.soloLinks?.filter(link => link.link && link.link.trim() !== '').map((link) => (
                            <a
                                key={link.id}
                                href={link.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="fade-in w-full p-4 backdrop-blur-md rounded-xl border transition-all duration-300 flex items-center gap-3 group bg-white/10 hover:bg-white/20 border-white/10 hover:border-white/20"
                            >
                                {link.logoUrl ? (
                                    <img src={link.logoUrl} alt={link.name} className="w-8 h-8 object-contain" />
                                ) : (
                                    <span className="text-2xl">{link.icon}</span>
                                )}
                                <span className="font-medium text-white">{link.name}</span>
                            </a>
                        ))}
                    </div>

                    <footer className="fade-in mt-12 text-center text-sm text-white/50">
                        <p>{config.profile.footer || `© ${new Date().getFullYear()} ${config.profile.title}. Todos os direitos reservados.`}</p>
                    </footer>
                </main>
            </RainBackground>

            {musicEnabled && (
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
            )}
        </div>
    );
}
