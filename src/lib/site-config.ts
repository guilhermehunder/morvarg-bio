// Site configuration data model for Firestore
// Collection: /site/{siteId}

// --- Link Item (inside blocks) ---
export interface LinkItem {
    id: string;
    name: string;
    description: string;
    link: string;
    order: number;
}

// --- Link Block (expandable drawer) ---
export interface LinkBlock {
    id: string;
    title: string;
    subtitle: string;
    image: string; // Header image for the block
    links: LinkItem[];
    order: number;
}

// --- Solo Link (standalone button) ---
export interface SoloLink {
    id: string;
    name: string;
    icon: string; // Emoji or icon name
    link: string;
    logoUrl?: string; // Optional logo/brand image
    order: number;
}

// --- Tag/Category ---
export interface Tag {
    id: string;
    name: string;
    color: string; // Hex color for the chip
    link?: string; // Optional link when clicked
    order: number;
}

// --- Banner Config ---
export interface BannerConfig {
    enabled: boolean;
    imageUrl: string;
    height: number; // Height in pixels (100-400)
}

// --- Media Kit ---
export interface MediaKit {
    enabled: boolean;
    title: string;
    subtitle: string;
    url: string; // Link to PDF/document
}

// --- Social Link ---
export type SocialPlatform = 'email' | 'tiktok' | 'instagram' | 'twitter' | 'youtube' | 'twitch' | 'discord' | 'github' | 'linkedin' | 'website';

export interface SocialLink {
    id: string;
    platform: SocialPlatform;
    url: string;
    order: number;
}

// --- Legacy Peripheral (for backwards compatibility) ---
export interface Peripheral {
    id: string;
    name: string;
    description: string;
    image: string;
    link: string;
    order: number;
}

export interface MusicConfig {
    url: string;
    enabled: boolean;
    volume: number;
}

export interface BackgroundConfig {
    type: 'image' | 'gradient' | 'solid';
    value: string;
    blur: number;
    overlay: number;
}

export interface ProfileConfig {
    title: string;
    subtitle: string;
    footer: string;
    avatar: string;
    logo: string;
    logoSize: number;
}

export interface SiteConfig {
    profile: ProfileConfig;
    music: MusicConfig;
    background: BackgroundConfig;
    // Content structure
    blocks: LinkBlock[];
    soloLinks: SoloLink[];
    tags: Tag[];
    socialLinks: SocialLink[];
    // Features
    banner: BannerConfig;
    mediaKit: MediaKit;
    maxLinksPerBlock: number;
    // Legacy (will be migrated to blocks)
    peripherals: Peripheral[];
    peripheralsCardImage: string;
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
        logo: '',
        logoSize: 1,
    },
    music: {
        url: 'https://firebasestorage.googleapis.com/v0/b/studio-7654894928-c00a4.firebasestorage.app/o/Love%20My%20Tone.mp3?alt=media&token=ff816d18-e6c5-4987-a86c-a86cd9c55048',
        enabled: true,
        volume: 0.2,
    },
    background: {
        type: 'image',
        value: 'https://i.imgur.com/NBReecb.png',
        blur: 0,
        overlay: 0.65,
    },
    // New: Blocks with links
    blocks: [
        {
            id: 'block1',
            title: 'Breakdown of my workstation',
            subtitle: 'Complete workstation essentials',
            image: 'https://i.imgur.com/Xbiudsl.png',
            order: 0,
            links: [
                { id: '1', name: 'Keyboard', description: 'Mechanical, RGB', link: '', order: 0 },
                { id: '2', name: 'Mouse', description: 'Wireless, 16000 DPI', link: '', order: 1 },
                { id: '3', name: 'Monitor', description: '27-inch, 144Hz', link: '', order: 2 },
                { id: '4', name: 'PC Case', description: 'Mid-Tower, RGB', link: '', order: 3 },
            ],
        },
    ],
    // New: Solo links (buttons)
    soloLinks: [],
    // New: Tags/Categories
    tags: [],
    // New: Social Links
    socialLinks: [],
    // New: Banner
    banner: {
        enabled: false,
        imageUrl: '',
        height: 200,
    },
    // New: Media Kit
    mediaKit: {
        enabled: false,
        title: 'View My Media Kit',
        subtitle: 'Press kit and brand assets',
        url: '',
    },
    maxLinksPerBlock: 6, // Default limit
    // Legacy
    peripherals: [],
    peripheralsCardImage: 'https://i.imgur.com/Xbiudsl.png',
    template: 'dark',
};

// Helper to generate unique IDs
export const generateId = () => Math.random().toString(36).substring(2, 9);
