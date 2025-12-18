'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useUser } from '@/firebase';
import { initializeFirebase } from '@/firebase';
import { SiteConfig, defaultSiteConfig } from '@/lib/site-config';

const SITE_ID = 'main'; // Single site for now

export function useSiteConfig() {
    const { user } = useUser();
    const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Ensure we only run on client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Load config from Firestore
    useEffect(() => {
        if (!mounted) return;

        const { firestore } = initializeFirebase();
        const docRef = doc(firestore, 'site', SITE_ID);

        // Real-time listener
        const unsubscribe = onSnapshot(
            docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setConfig(docSnap.data() as SiteConfig);
                } else {
                    // Initialize with defaults if no config exists
                    setConfig(defaultSiteConfig);
                }
                setIsLoading(false);
            },
            (err) => {
                console.error('Error loading site config:', err);
                setError(err.message);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [mounted]);

    // Save config to Firestore
    const saveConfig = useCallback(async (newConfig: SiteConfig) => {
        if (!user) {
            setError('Você precisa estar logado para salvar');
            return false;
        }

        setIsSaving(true);
        setError(null);

        try {
            const { firestore } = initializeFirebase();
            const docRef = doc(firestore, 'site', SITE_ID);

            await setDoc(docRef, {
                ...newConfig,
                updatedAt: new Date(),
            });

            setConfig(newConfig);
            setIsSaving(false);
            return true;
        } catch (err: any) {
            console.error('Error saving site config:', err);
            setError(err.message);
            setIsSaving(false);
            return false;
        }
    }, [user]);

    // Update specific section
    const updateConfig = useCallback((updates: Partial<SiteConfig>) => {
        setConfig((prev) => ({ ...prev, ...updates }));
    }, []);

    return {
        config,
        setConfig,
        updateConfig,
        saveConfig,
        isLoading,
        isSaving,
        error,
    };
}

// Hook for public page (read-only)
export function usePublicSiteConfig() {
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const { firestore } = initializeFirebase();
        const docRef = doc(firestore, 'site', SITE_ID);

        const unsubscribe = onSnapshot(
            docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setConfig(docSnap.data() as SiteConfig);
                } else {
                    setConfig(defaultSiteConfig);
                }
                setIsLoading(false);
            },
            (err) => {
                console.error('Error loading public config:', err);
                setConfig(defaultSiteConfig);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [mounted]);

    return { config, isLoading };
}
