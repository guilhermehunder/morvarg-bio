// Site configuration data model for Firestore
// Collection: /site/{siteId}

export interface Peripheral {
    id: string;
    name: string;
    description: string;
    image: string;
    link: string; // Affiliate link
    order: number;
}

export interface MusicConfig {
    url: string;
    enabled: boolean;
    volume: number;
}

export interface BackgroundConfig {
    type: 'image' | 'gradient' | 'solid';
    value: string; // URL or color/gradient value
    blur: number;
    overlay: number;
}

export interface ProfileConfig {
    title: string;
    subtitle: string;
    footer: string;
    avatar: string;
    logo: string; // URL for logo image
    logoSize: number; // Logo size multiplier (1 = 100%, 0.5 = 50%, 2 = 200%)
}

export interface SiteConfig {
    profile: ProfileConfig;
    music: MusicConfig;
    background: BackgroundConfig;
    peripherals: Peripheral[];
    peripheralsCardImage: string; // Header image for peripherals card
    template: string;
    updatedAt?: Date;
}

// Default configuration for new sites
export const defaultSiteConfig: SiteConfig = {
    profile: {
        title: 'Morvarg',
        subtitle: 'Complete workstation essentials',
        footer: '© 2025 Morvarg. Todos os direitos reservados.',
        avatar: '',
        logo: '', // Logo image (if empty, uses text title)
        logoSize: 1, // Default: 100%
    },
    music: {
        url: 'https://firebasestorage.googleapis.com/v0/b/studio-7654894928-c00a4.firebasestorage.app/o/Love%20My%20Tone.mp3?alt=media&token=ff816d18-e6c5-4987-a86c-a86cd9c55048',
        enabled: true,
        volume: 0.2,
    },
    background: {
        type: 'image',
        value: 'https://i.imgur.com/NBReecb.png', // Default background
        blur: 0,
        overlay: 0.65,
    },
    peripheralsCardImage: 'https://i.imgur.com/Xbiudsl.png', // Default peripherals card image
    peripherals: [
        {
            id: '1',
            name: 'Keyboard',
            description: 'Mechanical, RGB, Tenkeyless',
            image: '',
            link: '',
            order: 0,
        },
        {
            id: '2',
            name: 'Mouse',
            description: 'Wireless, Lightweight, 16000 DPI',
            image: '',
            link: '',
            order: 1,
        },
        {
            id: '3',
            name: 'Monitor',
            description: '27-inch, 144Hz, IPS Panel',
            image: '',
            link: '',
            order: 2,
        },
        {
            id: '4',
            name: 'PC Case',
            description: 'Mid-Tower, Tempered Glass, High Airflow',
            image: '',
            link: '',
            order: 3,
        },
    ],
    template: 'dark',
};

// Helper to generate unique IDs
export const generateId = () => Math.random().toString(36).substring(2, 9);
