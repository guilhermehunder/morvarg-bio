
'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Gamepad2,
  Music,
  Image as ImageIcon,
  User,
  LogOut,
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  Save,
  Loader2,
  Eye,
  RefreshCw,
  Sparkles,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSiteConfig } from '@/hooks/use-site-config';
import { Peripheral, generateId, SiteConfig } from '@/lib/site-config';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type MenuKey = 'peripherals' | 'music' | 'background' | 'profile';

interface EditorProps {
  config: SiteConfig;
  updateConfig: (updates: Partial<SiteConfig>) => void;
}

// --- Peripherals Editor ---
function PeripheralsEditor({ config, updateConfig }: EditorProps) {
  const addPeripheral = () => {
    const newPeripheral: Peripheral = {
      id: generateId(),
      name: 'Novo Periférico',
      description: 'Descrição aqui',
      image: '',
      link: '',
      order: config.peripherals.length,
    };
    updateConfig({
      peripherals: [...config.peripherals, newPeripheral],
    });
  };

  const updatePeripheral = (id: string, updates: Partial<Peripheral>) => {
    updateConfig({
      peripherals: config.peripherals.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    });
  };

  const removePeripheral = (id: string) => {
    updateConfig({
      peripherals: config.peripherals.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Periféricos</h2>
              <p className="text-sm text-gray-500">Gerencie seus equipamentos e links de afiliado</p>
            </div>
          </div>
        </div>
        <button
          onClick={addPeripheral}
          className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          Adicionar
        </button>
      </div>

      {/* Card Image Section */}
      <div className="p-5 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon className="w-4 h-4 text-purple-400" />
          <Label className="text-sm font-medium text-white">Imagem de Capa</Label>
        </div>
        <Input
          value={config.peripheralsCardImage || ''}
          onChange={(e) => updateConfig({ peripheralsCardImage: e.target.value })}
          className="bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
          placeholder="https://i.imgur.com/..."
        />
        {config.peripheralsCardImage && (
          <div className="mt-4 rounded-xl overflow-hidden border border-gray-700/50">
            <img src={config.peripheralsCardImage} alt="Card preview" className="w-full h-32 object-cover" />
          </div>
        )}
      </div>

      {/* Peripherals List */}
      <div className="space-y-4">
        {config.peripherals.map((peripheral, index) => (
          <div
            key={peripheral.id}
            className="group p-5 bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30 rounded-2xl hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500 font-mono">#{index + 1}</span>
                <div className="text-gray-600 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4" />
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-400 mb-1.5 block">Nome</Label>
                  <Input
                    value={peripheral.name}
                    onChange={(e) => updatePeripheral(peripheral.id, { name: e.target.value })}
                    className="bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400 mb-1.5 block">Descrição</Label>
                  <Input
                    value={peripheral.description}
                    onChange={(e) => updatePeripheral(peripheral.id, { description: e.target.value })}
                    className="bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500 rounded-xl"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    Link de Afiliado
                  </Label>
                  <Input
                    value={peripheral.link}
                    onChange={(e) => updatePeripheral(peripheral.id, { link: e.target.value })}
                    className="bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500 rounded-xl"
                    placeholder="https://amazon.com/..."
                  />
                </div>
              </div>
              <button
                className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                onClick={() => removePeripheral(peripheral.id)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {config.peripherals.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/50 flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500 mb-3">Nenhum periférico adicionado</p>
            <button
              onClick={addPeripheral}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              + Adicionar primeiro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Music Editor ---
function MusicEditor({ config, updateConfig }: EditorProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
          <Music className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Música de Fundo</h2>
          <p className="text-sm text-gray-500">Configure o áudio ambiente da página</p>
        </div>
      </div>

      <div className="p-5 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Música Ativa</p>
            <p className="text-sm text-gray-500">Ativar/desativar música de fundo</p>
          </div>
          <Switch
            checked={config.music.enabled}
            onCheckedChange={(enabled) =>
              updateConfig({ music: { ...config.music, enabled } })
            }
          />
        </div>
      </div>

      <div className="p-5 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl space-y-5">
        <div>
          <Label className="text-sm font-medium text-white mb-2 block">URL do Áudio</Label>
          <Input
            value={config.music.url}
            onChange={(e) =>
              updateConfig({ music: { ...config.music, url: e.target.value } })
            }
            className="bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500 rounded-xl"
            placeholder="https://..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium text-white">Volume</Label>
            <span className="text-sm text-purple-400 font-mono">{Math.round(config.music.volume * 100)}%</span>
          </div>
          <Slider
            value={[config.music.volume]}
            onValueChange={([volume]) =>
              updateConfig({ music: { ...config.music, volume } })
            }
            max={1}
            step={0.05}
            className="mt-2"
          />
        </div>
      </div>

      {config.music.url && (
        <div className="p-5 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <p className="text-sm text-purple-300 font-medium">Preview</p>
          </div>
          <audio controls className="w-full" src={config.music.url}>
            Seu navegador não suporta áudio
          </audio>
        </div>
      )}
    </div>
  );
}

// --- Background Editor ---
function BackgroundEditor({ config, updateConfig }: EditorProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Plano de Fundo</h2>
          <p className="text-sm text-gray-500">Personalize o visual da sua página</p>
        </div>
      </div>

      <div className="p-5 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl space-y-5">
        <div>
          <Label className="text-sm font-medium text-white mb-2 block">URL da Imagem</Label>
          <Input
            value={config.background.value}
            onChange={(e) =>
              updateConfig({ background: { ...config.background, value: e.target.value } })
            }
            className="bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500 rounded-xl"
            placeholder="https://..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium text-white">Desfoque</Label>
            <span className="text-sm text-cyan-400 font-mono">{config.background.blur}px</span>
          </div>
          <Slider
            value={[config.background.blur]}
            onValueChange={([blur]) =>
              updateConfig({ background: { ...config.background, blur } })
            }
            max={20}
            step={1}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium text-white">Overlay</Label>
            <span className="text-sm text-cyan-400 font-mono">{Math.round(config.background.overlay * 100)}%</span>
          </div>
          <Slider
            value={[config.background.overlay]}
            onValueChange={([overlay]) =>
              updateConfig({ background: { ...config.background, overlay } })
            }
            max={1}
            step={0.05}
          />
        </div>
      </div>

      {config.background.value && (
        <div className="relative h-48 rounded-2xl overflow-hidden border border-gray-700/50">
          <img
            src={config.background.value}
            alt="Preview"
            className="w-full h-full object-cover"
            style={{ filter: `blur(${config.background.blur}px)` }}
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: config.background.overlay }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-4 py-2 bg-black/50 rounded-xl text-white text-sm font-medium backdrop-blur-sm">
              Preview do Background
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Profile Editor ---
function ProfileEditor({ config, updateConfig }: EditorProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Perfil</h2>
          <p className="text-sm text-gray-500">Configure textos e logo da página</p>
        </div>
      </div>

      <div className="p-5 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl space-y-5">
        <div>
          <Label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            URL do Logo
          </Label>
          <Input
            value={config.profile.logo || ''}
            onChange={(e) =>
              updateConfig({ profile: { ...config.profile, logo: e.target.value } })
            }
            className="bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500 rounded-xl"
            placeholder="https://i.imgur.com/seu-logo.png"
          />
          <p className="text-xs text-gray-500 mt-1.5">Imagem que substitui o título</p>
          {config.profile.logo && (
            <>
              <div className="mt-4 p-4 bg-gray-900 rounded-xl flex justify-center">
                <img
                  src={config.profile.logo}
                  alt="Logo"
                  className="object-contain transition-all"
                  style={{ maxHeight: `${(config.profile.logoSize || 1) * 80}px` }}
                />
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-white">Tamanho do Logo</Label>
                  <span className="text-sm text-amber-400 font-mono">{Math.round((config.profile.logoSize || 1) * 100)}%</span>
                </div>
                <Slider
                  value={[config.profile.logoSize || 1]}
                  onValueChange={([logoSize]) =>
                    updateConfig({ profile: { ...config.profile, logoSize } })
                  }
                  min={0.3}
                  max={2}
                  step={0.1}
                />
              </div>
            </>
          )}
        </div>

        <div className="border-t border-gray-700/50 pt-5">
          <Label className="text-sm font-medium text-white mb-2 block">Título (fallback)</Label>
          <Input
            value={config.profile.title}
            onChange={(e) =>
              updateConfig({ profile: { ...config.profile, title: e.target.value } })
            }
            className="bg-gray-900/80 border-gray-700 text-white text-lg font-bold placeholder:text-gray-500 rounded-xl"
            placeholder="Morvarg"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-white mb-2 block">Subtítulo</Label>
          <Input
            value={config.profile.subtitle}
            onChange={(e) =>
              updateConfig({ profile: { ...config.profile, subtitle: e.target.value } })
            }
            className="bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500 rounded-xl"
            placeholder="Complete workstation essentials"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-white mb-2 block">Rodapé</Label>
          <Textarea
            value={config.profile.footer}
            onChange={(e) =>
              updateConfig({ profile: { ...config.profile, footer: e.target.value } })
            }
            className="bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500 rounded-xl min-h-[80px]"
            placeholder="© 2025 Morvarg..."
          />
        </div>
      </div>
    </div>
  );
}

// --- Live Preview (Phone Mockup) ---
function LivePreview() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="relative">
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-sm text-gray-500">Prévia ao vivo</span>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Atualizar
          </button>
        </div>

        {/* Phone Mockup */}
        <div className="relative mx-auto">
          {/* Phone outer frame */}
          <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-black/50 border border-gray-700">
            {/* Screen bezel */}
            <div className="relative bg-black rounded-[2.25rem] overflow-hidden" style={{ width: '320px', height: '680px' }}>
              {/* Dynamic Island / Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-24 h-6 bg-black rounded-full" />

              {/* Iframe */}
              <iframe
                key={refreshKey}
                src="/"
                className="w-full h-full border-0"
                title="Preview"
                style={{ transform: 'scale(1)', transformOrigin: 'top left' }}
              />
            </div>
          </div>

          {/* Reflection effect */}
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        </div>

        {/* Open in new tab */}
        <button
          onClick={() => window.open('/', '_blank')}
          className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Abrir em nova aba
        </button>
      </div>
    </div>
  );
}

// --- Main Admin Page ---
export default function AdminPage() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeMenu, setActiveMenu] = useState<MenuKey>('peripherals');

  const { config, updateConfig, saveConfig, isLoading, isSaving, error } = useSiteConfig();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  const handleSave = async () => {
    const success = await saveConfig(config);
    if (success) {
      toast({
        title: '✅ Salvo com sucesso!',
        description: 'Suas alterações foram salvas no Firebase.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: error || 'Tente novamente.',
      });
    }
  };

  const menuItems = [
    { key: 'peripherals' as MenuKey, label: 'Periféricos', icon: Gamepad2, color: 'from-violet-500 to-purple-600' },
    { key: 'music' as MenuKey, label: 'Música', icon: Music, color: 'from-pink-500 to-rose-600' },
    { key: 'background' as MenuKey, label: 'Background', icon: ImageIcon, color: 'from-cyan-500 to-blue-600' },
    { key: 'profile' as MenuKey, label: 'Perfil', icon: User, color: 'from-amber-500 to-orange-600' },
  ];

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 animate-pulse" />
              <Loader2 className="absolute inset-0 m-auto w-8 h-8 animate-spin text-white" />
            </div>
            <p className="text-gray-500 animate-pulse">Carregando...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0a0a0f] flex">
        {/* Sidebar */}
        <aside className="w-[280px] bg-[#0d0d14] border-r border-gray-800/50 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white">Morvarg</h1>
                <p className="text-xs text-gray-500">Painel de Controle</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-3">Edição</p>
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                  activeMenu === item.key
                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                  activeMenu === item.key
                    ? `bg-gradient-to-br ${item.color}`
                    : 'bg-gray-800 group-hover:bg-gray-700'
                )}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">{item.label}</span>
                {activeMenu === item.key && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500" />
                )}
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-800/50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30">
              <Avatar className="w-10 h-10 border-2 border-purple-500/30">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="h-16 border-b border-gray-800/50 flex items-center justify-between px-6 bg-[#0d0d14]/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Editando:</span>
              <span className="text-white font-medium capitalize">{activeMenu}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open('/', '_blank')}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Ver Site</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white rounded-xl transition-all font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </header>

          {/* Content Grid */}
          <main className="flex-1 flex">
            {/* Editor Panel */}
            <div className="flex-1 overflow-y-auto p-8 max-w-3xl">
              {activeMenu === 'peripherals' && (
                <PeripheralsEditor config={config} updateConfig={updateConfig} />
              )}
              {activeMenu === 'music' && (
                <MusicEditor config={config} updateConfig={updateConfig} />
              )}
              {activeMenu === 'background' && (
                <BackgroundEditor config={config} updateConfig={updateConfig} />
              )}
              {activeMenu === 'profile' && (
                <ProfileEditor config={config} updateConfig={updateConfig} />
              )}
            </div>

            {/* Preview Panel */}
            <div className="hidden xl:block w-[420px] border-l border-gray-800/50 bg-gradient-to-b from-[#0d0d14] to-[#0a0a0f]">
              <LivePreview />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
