
'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Palette,
  User,
  Image as ImageIcon,
  Sparkles,
  LogOut,
  Smartphone,
  Upload,
  Check,
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';
import { templates, defaultProfile, ProfileConfig, TemplateId } from '@/lib/templates';
import { cn } from '@/lib/utils';

type MenuKey = 'templates' | 'profile' | 'background' | 'effects';

export default function AdminPage() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<MenuKey>('templates');
  const [profile, setProfile] = useState<ProfileConfig>(defaultProfile);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  const updateProfile = (updates: Partial<ProfileConfig>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Save to Firebase
    setTimeout(() => setIsSaving(false), 1000);
  };

  const currentTemplate = templates.find(t => t.id === profile.template) || templates[0];

  // --- Editor Panels ---
  const TemplatesEditor = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Templates</h2>
        <p className="text-gray-600 mt-1">Escolha um estilo pré-definido incrível</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => updateProfile({ template: template.id })}
            className={cn(
              'relative p-4 rounded-xl border-2 transition-all text-left hover:scale-[1.02]',
              profile.template === template.id
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300 bg-white'
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-lg flex-shrink-0 shadow-md"
                style={{ background: template.preview.background }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  {profile.template === template.id && (
                    <Check className="w-4 h-4 text-purple-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );

  const ProfileEditor = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Perfil</h2>
        <p className="text-gray-600 mt-1">Customize seu perfil e bio</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="photo" className="text-gray-900">Foto de Perfil</Label>
          <div className="mt-2 flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.bio.photo || user?.photoURL || undefined} />
              <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
                {profile.bio.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="username" className="text-gray-900">Nome de Usuário</Label>
          <Input
            id="username"
            value={profile.bio.username}
            onChange={(e) => updateProfile({
              bio: { ...profile.bio, username: e.target.value }
            })}
            className="mt-2 border-gray-300"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-gray-900">Bio</Label>
          <Textarea
            id="description"
            value={profile.bio.description}
            onChange={(e) => updateProfile({
              bio: { ...profile.bio, description: e.target.value }
            })}
            className="mt-2 border-gray-300 min-h-[100px]"
            placeholder="Conte sobre você..."
          />
        </div>
      </div>
    </motion.div>
  );

  const BackgroundEditor = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Background</h2>
        <p className="text-gray-600 mt-1">Personalize o fundo da sua página</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-gray-900">Tipo</Label>
          <Select
            value={profile.background.type}
            onValueChange={(value: 'gradient' | 'solid' | 'image') =>
              updateProfile({ background: { ...profile.background, type: value } })
            }
          >
            <SelectTrigger className="mt-2 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gradient">Gradiente</SelectItem>
              <SelectItem value="solid">Cor Sólida</SelectItem>
              <SelectItem value="image">Imagem</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {profile.background.type === 'image' && (
          <div>
            <Label className="text-gray-900">Imagem</Label>
            <Button variant="outline" className="w-full mt-2 gap-2">
              <Upload className="w-4 h-4" />
              Upload Imagem
            </Button>
          </div>
        )}

        <div>
          <Label className="text-gray-900">Desfoque ({profile.background.blur}px)</Label>
          <Slider
            value={[profile.background.blur]}
            onValueChange={([blur]) =>
              updateProfile({ background: { ...profile.background, blur } })
            }
            max={20}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-gray-900">Overlay ({profile.background.overlay}%)</Label>
          <Slider
            value={[profile.background.overlay]}
            onValueChange={([overlay]) =>
              updateProfile({ background: { ...profile.background, overlay } })
            }
            max={100}
            step={5}
            className="mt-2"
          />
        </div>
      </div>
    </motion.div>
  );

  const EffectsEditor = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Efeitos</h2>
        <p className="text-gray-600 mt-1">Adicione efeitos especiais</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Glassmorphism</p>
            <p className="text-sm text-gray-600">Efeito de vidro translúcido</p>
          </div>
          <Switch
            checked={profile.effects.glassmorphism}
            onCheckedChange={(glassmorphism) =>
              updateProfile({ effects: { ...profile.effects, glassmorphism } })
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Animações</p>
            <p className="text-sm text-gray-600">Animações suaves ao hover</p>
          </div>
          <Switch
            checked={profile.effects.animations}
            onCheckedChange={(animations) =>
              updateProfile({ effects: { ...profile.effects, animations } })
            }
          />
        </div>

        <div>
          <Label className="text-gray-900">Sombras</Label>
          <Select
            value={profile.effects.shadows}
            onValueChange={(shadows: 'none' | 'sm' | 'md' | 'lg') =>
              updateProfile({ effects: { ...profile.effects, shadows } })
            }
          >
            <SelectTrigger className="mt-2 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma</SelectItem>
              <SelectItem value="sm">Pequena</SelectItem>
              <SelectItem value="md">Média</SelectItem>
              <SelectItem value="lg">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'templates':
        return <TemplatesEditor />;
      case 'profile':
        return <ProfileEditor />;
      case 'background':
        return <BackgroundEditor />;
      case 'effects':
        return <EffectsEditor />;
      default:
        return <TemplatesEditor />;
    }
  };

  // --- Live Preview ---
  const LivePreview = () => {
    return (
      <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center p-8">
        {/* iPhone Mockup */}
        <div className="relative w-full max-w-[375px] h-[667px] bg-black rounded-[3rem] shadow-2xl p-3">
          {/* iPhone Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10" />

          {/* Screen */}
          <div
            className="w-full h-full rounded-[2.5rem] overflow-hidden relative"
            style={{ background: currentTemplate.preview.background }}
          >
            <div className="absolute inset-0 overflow-y-auto p-6 flex flex-col items-center scrollbar-hide">
              {/* Profile Section */}
              <div className="text-center mb-6 mt-8">
                <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-white/50">
                  <AvatarImage src={profile.bio.photo || user?.photoURL || undefined} />
                  <AvatarFallback
                    className="text-2xl font-semibold"
                    style={{
                      backgroundColor: currentTemplate.preview.cardBg,
                      color: currentTemplate.preview.textColor
                    }}
                  >
                    {profile.bio.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2
                  className="text-xl font-bold mb-2"
                  style={{ color: currentTemplate.preview.textColor }}
                >
                  {profile.bio.username}
                </h2>
                <p
                  className="text-sm opacity-90"
                  style={{ color: currentTemplate.preview.textColor }}
                >
                  {profile.bio.description}
                </p>
              </div>

              {/* Sample Links */}
              <div className="w-full space-y-3">
                {['Link 1', 'Link 2', 'Link 3'].map((link, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-full py-4 px-6 rounded-2xl text-center font-medium transition-all',
                      profile.effects.glassmorphism && 'backdrop-blur-md',
                      profile.effects.animations && 'hover:scale-105',
                      `shadow-${profile.effects.shadows === 'none' ? 'none' : profile.effects.shadows}`
                    )}
                    style={{
                      background: currentTemplate.preview.buttonBg,
                      color: currentTemplate.preview.buttonText,
                    }}
                  >
                    {link}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const menuItems = [
    { key: 'templates' as MenuKey, label: 'Templates', icon: Palette },
    { key: 'profile' as MenuKey, label: 'Perfil', icon: User },
    { key: 'background' as MenuKey, label: 'Background', icon: ImageIcon },
    { key: 'effects' as MenuKey, label: 'Efeitos', icon: Sparkles },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white flex">
        {/* Sidebar */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                  activeMenu === item.key
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Editor</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
              <Avatar className="w-9 h-9 border-2 border-purple-200">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Editor + Preview */}
          <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
            {/* Editor Panel */}
            <div className="bg-gray-50 border-r border-gray-200 overflow-y-auto p-8">
              <AnimatePresence mode="wait">
                {renderContent()}
              </AnimatePresence>
            </div>

            {/* Preview Panel */}
            <div className="hidden lg:flex items-center justify-center p-8 bg-white">
              <LivePreview />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
