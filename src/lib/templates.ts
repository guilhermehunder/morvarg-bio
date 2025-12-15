// Template definitions for the admin dashboard
export type TemplateId = 'minimal-purple' | 'dark-elegance' | 'gradient-dreams' | 'professional' | 'neon';

export interface Template {
    id: TemplateId;
    name: string;
    description: string;
    preview: {
        background: string;
        buttonBg: string;
        buttonText: string;
        cardBg: string;
        textColor: string;
        accentColor: string;
    };
    styles: {
        background: string;
        buttonStyle: string;
        cardStyle: string;
        textStyle: string;
        effectsStyle: string;
    };
}

export const templates: Template[] = [
    {
        id: 'minimal-purple',
        name: 'Minimal Purple',
        description: 'Clean white with purple accents',
        preview: {
            background: 'linear-gradient(to bottom, #ffffff, #f8f7ff)',
            buttonBg: '#8b5cf6',
            buttonText: '#ffffff',
            cardBg: '#ffffff',
            textColor: '#1f2937',
            accentColor: '#8b5cf6',
        },
        styles: {
            background: 'bg-gradient-to-b from-white to-purple-50',
            buttonStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all',
            cardStyle: 'bg-white/80 backdrop-blur-sm border border-purple-100 shadow-sm',
            textStyle: 'text-gray-900',
            effectsStyle: 'shadow-purple-200/50',
        },
    },
    {
        id: 'dark-elegance',
        name: 'Dark Elegance',
        description: 'Black background with gold & purple',
        preview: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            buttonBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
            buttonText: '#000000',
            cardBg: 'rgba(255, 255, 255, 0.05)',
            textColor: '#ffffff',
            accentColor: '#f59e0b',
        },
        styles: {
            background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
            buttonStyle: 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70 transition-all',
            cardStyle: 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl',
            textStyle: 'text-white',
            effectsStyle: 'shadow-purple-500/30',
        },
    },
    {
        id: 'gradient-dreams',
        name: 'Gradient Dreams',
        description: 'Vibrant purple-to-pink gradient',
        preview: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            buttonBg: '#ffffff',
            buttonText: '#667eea',
            cardBg: 'rgba(255, 255, 255, 0.15)',
            textColor: '#ffffff',
            accentColor: '#ffffff',
        },
        styles: {
            background: 'bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500',
            buttonStyle: 'bg-white text-purple-600 font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all',
            cardStyle: 'bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl',
            textStyle: 'text-white',
            effectsStyle: 'shadow-pink-500/50',
        },
    },
    {
        id: 'professional',
        name: 'Professional Clean',
        description: 'Minimalist white & gray',
        preview: {
            background: '#f9fafb',
            buttonBg: '#111827',
            buttonText: '#ffffff',
            cardBg: '#ffffff',
            textColor: '#111827',
            accentColor: '#6b7280',
        },
        styles: {
            background: 'bg-gray-50',
            buttonStyle: 'bg-gray-900 text-white border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all',
            cardStyle: 'bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all',
            textStyle: 'text-gray-900',
            effectsStyle: 'shadow-gray-200/50',
        },
    },
    {
        id: 'neon',
        name: 'Neon Vibes',
        description: 'Dark with neon purple glow',
        preview: {
            background: '#0a0a0a',
            buttonBg: '#a855f7',
            buttonText: '#ffffff',
            cardBg: 'rgba(168, 85, 247, 0.1)',
            textColor: '#ffffff',
            accentColor: '#a855f7',
        },
        styles: {
            background: 'bg-black',
            buttonStyle: 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.8)] hover:shadow-[0_0_30px_rgba(168,85,247,1)] transition-all border border-purple-500',
            cardStyle: 'bg-purple-500/10 backdrop-blur-sm border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]',
            textStyle: 'text-white',
            effectsStyle: 'shadow-[0_0_40px_rgba(168,85,247,0.5)]',
        },
    },
];

export interface ProfileConfig {
    template: TemplateId;
    bio: {
        photo: string;
        username: string;
        description: string;
    };
    background: {
        type: 'gradient' | 'solid' | 'image';
        value: string;
        blur: number;
        overlay: number;
    };
    effects: {
        glassmorphism: boolean;
        shadows: 'none' | 'sm' | 'md' | 'lg';
        animations: boolean;
    };
}

export const defaultProfile: ProfileConfig = {
    template: 'minimal-purple',
    bio: {
        photo: '',
        username: 'Seu Nome',
        description: 'Adicione uma bio aqui ✨',
    },
    background: {
        type: 'gradient',
        value: templates[0].preview.background,
        blur: 0,
        overlay: 0,
    },
    effects: {
        glassmorphism: true,
        shadows: 'md',
        animations: true,
    },
};
