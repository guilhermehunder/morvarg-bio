
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  Link,
  Menu,
  X,
  Tags,
  FileText,
  Share2,
  ChevronDown,
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSiteConfig } from '@/hooks/use-site-config';
import { generateId, SiteConfig, LinkBlock, SoloLink, Tag, SocialLink } from '@/lib/site-config';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type MenuKey = 'blocks' | 'links' | 'tags' | 'banner' | 'mediakit' | 'social' | 'music' | 'background' | 'profile' | 'settings';

interface EditorProps {
  config: SiteConfig;
  updateConfig: (updates: Partial<SiteConfig>) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  onRefreshPreview?: () => void;
}

// --- Save Button Component ---
const SaveButton = ({ onSave, isSaving, color = 'from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500' }: { onSave: () => Promise<void>; isSaving: boolean; color?: string }) => (
  <div className="flex justify-end pt-6 border-t border-gray-700/30">
    <button
      onClick={onSave}
      disabled={isSaving}
      className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${color} disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg`}
    >
      {isSaving ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
    </button>
  </div>
);

// --- Blocks Editor (Linktree-style) ---
function BlocksEditor({ config, updateConfig, onSave, isSaving }: EditorProps) {
  const [expandedBlock, setExpandedBlock] = useState<string | null>(config.blocks?.[0]?.id || null);
  const maxLinks = config.maxLinksPerBlock || 6;

  // Initialize blocks if not present
  const blocks = config.blocks || [];

  const addBlock = () => {
    const newBlock = {
      id: generateId(),
      title: 'Novo Bloco',
      subtitle: 'Descrição do bloco',
      image: '',
      order: blocks.length,
      links: [],
    };
    updateConfig({ blocks: [...blocks, newBlock] });
    setExpandedBlock(newBlock.id);
  };

  const updateBlock = (blockId: string, updates: Partial<typeof blocks[0]>) => {
    updateConfig({
      blocks: blocks.map(b => b.id === blockId ? { ...b, ...updates } : b),
    });
  };

  const removeBlock = (blockId: string) => {
    updateConfig({ blocks: blocks.filter(b => b.id !== blockId) });
  };

  const addLink = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || block.links.length >= maxLinks) return;

    const newLink = {
      id: generateId(),
      name: 'Novo Link',
      description: '',
      link: '',
      order: block.links.length,
    };
    updateBlock(blockId, { links: [...block.links, newLink] });
  };

  const updateLink = (blockId: string, linkId: string, updates: Partial<typeof blocks[0]['links'][0]>) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    updateBlock(blockId, {
      links: block.links.map(l => l.id === linkId ? { ...l, ...updates } : l),
    });
  };

  const removeLink = (blockId: string, linkId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    updateBlock(blockId, { links: block.links.filter(l => l.id !== linkId) });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Blocos</h2>
            <p className="text-sm text-gray-500">Crie blocos expansíveis com links (máx {maxLinks} por bloco)</p>
          </div>
        </div>
        <button
          onClick={addBlock}
          className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" />
          Novo Bloco
        </button>
      </div>

      {/* Blocks List */}
      <div className="space-y-4">
        {blocks.map((block, blockIndex) => (
          <div
            key={block.id}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden"
          >
            {/* Block Header */}
            <div
              className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
              onClick={() => setExpandedBlock(expandedBlock === block.id ? null : block.id)}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 flex items-center justify-center bg-purple-500/20 text-purple-400 text-sm font-bold rounded-lg shrink-0">
                  {blockIndex + 1}
                </span>
                <div className="flex-1 space-y-2 py-1">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 ml-1">Título</Label>
                    <Input
                      value={block.title}
                      onChange={(e) => { e.stopPropagation(); updateBlock(block.id, { title: e.target.value }); }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Título do bloco"
                      className="bg-gray-900/50 border-gray-700/50 text-white font-semibold focus:bg-gray-900 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 ml-1">Subtítulo</Label>
                    <Input
                      value={block.subtitle}
                      onChange={(e) => { e.stopPropagation(); updateBlock(block.id, { subtitle: e.target.value }); }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Subtítulo"
                      className="bg-gray-900/50 border-gray-700/50 text-gray-300 text-sm focus:bg-gray-900 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 pl-2">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-mono",
                      block.links.length >= maxLinks ? "bg-amber-500/20 text-amber-400" : "bg-gray-700 text-gray-400"
                    )}>
                      {block.links.length}/{maxLinks}
                    </span>
                    <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-200", expandedBlock === block.id && "rotate-180")} />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                    title="Excluir bloco"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedBlock === block.id && (
              <div className="border-t border-gray-700/50 p-4 space-y-4">
                {/* Block Image */}
                <div>
                  <Label className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Imagem de Capa
                  </Label>
                  <Input
                    value={block.image}
                    onChange={(e) => updateBlock(block.id, { image: e.target.value })}
                    placeholder="https://i.imgur.com/..."
                    className="bg-gray-900/80 border-gray-700 text-white rounded-lg text-sm"
                  />
                  {block.image && (
                    <img src={block.image} alt="Preview" className="mt-2 w-full h-24 object-cover rounded-lg" />
                  )}
                </div>

                {/* Links inside block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-gray-400">Links ({block.links.length}/{maxLinks})</Label>
                    <button
                      onClick={() => addLink(block.id)}
                      disabled={block.links.length >= maxLinks}
                      className={cn(
                        "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium",
                        block.links.length >= maxLinks
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                      )}
                    >
                      <Plus className="w-3 h-3" /> Adicionar Link
                    </button>
                  </div>

                  {block.links.map((link, linkIndex) => (
                    <div key={link.id} className="flex items-center gap-2 p-2 bg-gray-900/50 rounded-lg group">
                      <span className="w-5 h-5 flex items-center justify-center bg-gray-700 text-gray-400 text-xs rounded shrink-0">
                        {linkIndex + 1}
                      </span>
                      <Input
                        value={link.name}
                        onChange={(e) => updateLink(block.id, link.id, { name: e.target.value })}
                        placeholder="Nome"
                        className="bg-transparent border-gray-700 text-white rounded h-8 text-sm flex-1"
                      />
                      <Input
                        value={link.description}
                        onChange={(e) => updateLink(block.id, link.id, { description: e.target.value })}
                        placeholder="Descrição"
                        className="bg-transparent border-gray-700 text-white rounded h-8 text-sm flex-1"
                      />
                      <div className="flex items-center gap-1 flex-1">
                        <ExternalLink className="w-3 h-3 text-gray-500 shrink-0" />
                        <Input
                          value={link.link}
                          onChange={(e) => updateLink(block.id, link.id, { link: e.target.value })}
                          placeholder="URL"
                          className="bg-transparent border-gray-700 text-white rounded h-8 text-sm"
                        />
                      </div>
                      <button
                        onClick={() => removeLink(block.id, link.id)}
                        className="p-1.5 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {block.links.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-gray-700 rounded-lg">
                      <p className="text-gray-500 text-sm">Nenhum link neste bloco</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {blocks.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/50 flex items-center justify-center">
              <LayoutDashboard className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500 mb-3">Nenhum bloco criado</p>
            <button onClick={addBlock} className="text-purple-400 hover:text-purple-300 font-medium">
              + Criar primeiro bloco
            </button>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-700/30">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
}

// --- Solo Links Editor (Standalone buttons) ---
function SoloLinksEditor({ config, updateConfig, onSave, isSaving }: EditorProps) {
  const soloLinks = config.soloLinks || [];

  const addSoloLink = () => {
    const newLink: SoloLink = {
      id: generateId(),
      name: 'Novo Link',
      icon: '🔗',
      link: '',
      order: soloLinks.length,
    };
    updateConfig({ soloLinks: [...soloLinks, newLink] });
  };

  const updateSoloLink = (id: string, updates: Partial<SoloLink>) => {
    updateConfig({
      soloLinks: soloLinks.map(l => l.id === id ? { ...l, ...updates } : l),
    });
  };

  const removeSoloLink = (id: string) => {
    updateConfig({ soloLinks: soloLinks.filter(l => l.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Link className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Links Soltos</h2>
            <p className="text-sm text-gray-500">Botões independentes sem limite</p>
          </div>
        </div>
        <button
          onClick={addSoloLink}
          className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          Novo Link
        </button>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {soloLinks.map((link, index) => (
          <div
            key={link.id}
            className="group p-4 bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30 rounded-xl hover:border-emerald-500/30 transition-all space-y-3"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 flex items-center justify-center bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg shrink-0">
                {index + 1}
              </span>

              {/* Emoji picker */}
              <Input
                value={link.icon}
                onChange={(e) => updateSoloLink(link.id, { icon: e.target.value })}
                placeholder="🔗"
                className="bg-gray-900/80 border-gray-700 text-white text-center rounded-lg h-9 w-14 text-lg"
              />

              {/* Name */}
              <Input
                value={link.name}
                onChange={(e) => updateSoloLink(link.id, { name: e.target.value })}
                placeholder="Nome do link"
                className="bg-gray-900/80 border-gray-700 text-white rounded-lg h-9 text-sm flex-1"
              />

              {/* Delete */}
              <button
                onClick={() => removeSoloLink(link.id)}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* URL + Logo */}
            <div className="flex items-center gap-2">
              {/* URL */}
              <div className="flex items-center gap-1 flex-1">
                <ExternalLink className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <Input
                  value={link.link}
                  onChange={(e) => updateSoloLink(link.id, { link: e.target.value })}
                  placeholder="https://..."
                  className="bg-gray-900/80 border-gray-700 text-white rounded-lg h-9 text-sm"
                />
              </div>

              {/* Logo URL */}
              <div className="flex items-center gap-1 flex-1">
                <ImageIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <Input
                  value={link.logoUrl || ''}
                  onChange={(e) => updateSoloLink(link.id, { logoUrl: e.target.value })}
                  placeholder="Logo URL (opcional)"
                  className="bg-gray-900/80 border-gray-700 text-white rounded-lg h-9 text-sm"
                />
              </div>
            </div>

            {/* Logo Preview */}
            {link.logoUrl && (
              <div className="flex items-center gap-2 p-2 bg-gray-900/50 rounded-lg">
                <img src={link.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded" />
                <span className="text-xs text-gray-500">Preview do logo</span>
              </div>
            )}
          </div>
        ))}

        {soloLinks.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/50 flex items-center justify-center">
              <Link className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500 mb-3">Nenhum link solto criado</p>
            <button onClick={addSoloLink} className="text-emerald-400 hover:text-emerald-300 font-medium">
              + Criar primeiro link
            </button>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-700/30">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
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
function LivePreview({ externalRefreshKey, config }: { externalRefreshKey?: number, config: SiteConfig }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Combined refresh key (internal + external)
  const combinedKey = refreshKey + (externalRefreshKey || 0);

  // Send config updates to iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow && config) {
      iframeRef.current.contentWindow.postMessage({
        type: 'PREVIEW_UPDATE',
        config
      }, '*');
    }
  }, [config, combinedKey]);

  const handleLoad = () => {
    if (iframeRef.current?.contentWindow && config) {
      iframeRef.current.contentWindow.postMessage({
        type: 'PREVIEW_UPDATE',
        config
      }, '*');
    }
  };

  // Prevent parent scroll when hovering over preview
  const handleWheel = (e: React.WheelEvent) => {
    if (isHovering) {
      e.stopPropagation();
    }
  };

  return (
    <div
      className="h-full flex flex-col items-center justify-center p-4"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onWheel={handleWheel}
    >
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

              {/* Iframe - Interactive scroll */}
              <iframe
                ref={iframeRef}
                onLoad={handleLoad}
                key={combinedKey}
                src="/"
                className="w-full h-full border-0"
                title="Preview"
                style={{
                  transform: 'scale(1)',
                  transformOrigin: 'top left',
                  pointerEvents: isHovering ? 'auto' : 'none'
                }}
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

// --- Tags Editor (Categories/Chips) ---
function TagsEditor({ config, updateConfig, onSave, isSaving }: EditorProps) {
  const tags = config.tags || [];

  const addTag = () => {
    const newTag: Tag = {
      id: generateId(),
      name: 'Nova Tag',
      color: '#8b5cf6',
      order: tags.length,
    };
    updateConfig({ tags: [...tags, newTag] });
  };

  const updateTag = (id: string, updates: Partial<Tag>) => {
    updateConfig({ tags: tags.map(t => t.id === id ? { ...t, ...updates } : t) });
  };

  const removeTag = (id: string) => {
    updateConfig({ tags: tags.filter(t => t.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Tags className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Tags/Categorias</h2>
            <p className="text-sm text-gray-500">Chips clicáveis para filtrar conteúdo</p>
          </div>
        </div>
        <button
          onClick={addTag}
          className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          Nova Tag
        </button>
      </div>

      <div className="space-y-3">
        {tags.map((tag, index) => (
          <div key={tag.id} className="group flex items-center gap-3 p-4 bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30 rounded-xl hover:border-indigo-500/30 transition-all">
            <span className="w-7 h-7 flex items-center justify-center bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-lg shrink-0">
              {index + 1}
            </span>

            <Input
              value={tag.name}
              onChange={(e) => updateTag(tag.id, { name: e.target.value })}
              placeholder="Nome da tag"
              className="bg-gray-900/80 border-gray-700 text-white rounded-lg h-9 text-sm flex-1"
            />

            <input
              type="color"
              value={tag.color}
              onChange={(e) => updateTag(tag.id, { color: e.target.value })}
              className="w-12 h-9 rounded-lg border border-gray-700 bg-gray-900/80 cursor-pointer"
            />

            <div className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: tag.color + '20', color: tag.color }}>
              {tag.name}
            </div>

            <button
              onClick={() => removeTag(tag.id)}
              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {tags.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/50 flex items-center justify-center">
              <Tags className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500 mb-3">Nenhuma tag criada</p>
            <button onClick={addTag} className="text-indigo-400 hover:text-indigo-300 font-medium">
              + Criar primeira tag
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Banner Editor ---
function BannerEditor({ config, updateConfig, onSave, isSaving }: EditorProps) {
  const banner = config.banner || { enabled: false, imageUrl: '', height: 200 };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Banner/Capa</h2>
          <p className="text-sm text-gray-500">Imagem grande no topo da página</p>
        </div>
      </div>

      <div className="p-5 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-white">Ativar Banner</Label>
          <Switch
            checked={banner.enabled}
            onCheckedChange={(enabled) => updateConfig({ banner: { ...banner, enabled } })}
          />
        </div>

        {banner.enabled && (
          <>
            <div>
              <Label className="text-sm font-medium text-white mb-2 block">URL da Imagem</Label>
              <Input
                value={banner.imageUrl}
                onChange={(e) => updateConfig({ banner: { ...banner, imageUrl: e.target.value } })}
                placeholder="https://..."
                className="bg-gray-900/80 border-gray-700 text-white rounded-xl"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-white">Altura</Label>
                <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-lg text-sm font-mono">
                  {banner.height}px
                </span>
              </div>
              <Slider
                value={[banner.height]}
                onValueChange={([height]) => updateConfig({ banner: { ...banner, height } })}
                min={100}
                max={400}
                step={10}
                className="w-full"
              />
            </div>

            {banner.imageUrl && (
              <div className="relative overflow-hidden rounded-xl border border-gray-700" style={{ height: `${banner.height / 2}px` }}>
                <img src={banner.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="px-4 py-2 bg-black/50 rounded-xl text-white text-sm font-medium backdrop-blur-sm">
                    Preview do Banner
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// --- Media Kit Editor ---
function MediaKitEditor({ config, updateConfig, onSave, isSaving }: EditorProps) {
  const mediaKit = config.mediaKit || { enabled: false, title: 'View My Media Kit', subtitle: '', url: '' };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Media Kit</h2>
          <p className="text-sm text-gray-500">Link especial para PDF/Press Kit</p>
        </div>
      </div>

      <div className="p-5 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-white">Ativar Media Kit</Label>
          <Switch
            checked={mediaKit.enabled}
            onCheckedChange={(enabled) => updateConfig({ mediaKit: { ...mediaKit, enabled } })}
          />
        </div>

        {mediaKit.enabled && (
          <>
            <div>
              <Label className="text-sm font-medium text-white mb-2 block">Título</Label>
              <Input
                value={mediaKit.title}
                onChange={(e) => updateConfig({ mediaKit: { ...mediaKit, title: e.target.value } })}
                placeholder="View My Media Kit"
                className="bg-gray-900/80 border-gray-700 text-white rounded-xl"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-white mb-2 block">Subtítulo</Label>
              <Input
                value={mediaKit.subtitle}
                onChange={(e) => updateConfig({ mediaKit: { ...mediaKit, subtitle: e.target.value } })}
                placeholder="Press kit and brand assets"
                className="bg-gray-900/80 border-gray-700 text-white rounded-xl"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-white mb-2 block">URL do PDF/Documento</Label>
              <Input
                value={mediaKit.url}
                onChange={(e) => updateConfig({ mediaKit: { ...mediaKit, url: e.target.value } })}
                placeholder="https://.../media-kit.pdf"
                className="bg-gray-900/80 border-gray-700 text-white rounded-xl"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- Social Links Editor ---
function SocialLinksEditor({ config, updateConfig, onSave, isSaving }: EditorProps) {
  const socialLinks = config.socialLinks || [];

  const platformIcons: Record<string, string> = {
    email: '📧',
    tiktok: '🎵',
    instagram: '📷',
    twitter: '🐦',
    youtube: '📺',
    twitch: '🎮',
    discord: '💬',
    github: '💻',
    linkedin: '💼',
    website: '🌐',
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: generateId(),
      platform: 'instagram',
      url: '',
      order: socialLinks.length,
    };
    updateConfig({ socialLinks: [...socialLinks, newLink] });
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    updateConfig({ socialLinks: socialLinks.map(l => l.id === id ? { ...l, ...updates } : l) });
  };

  const removeSocialLink = (id: string) => {
    updateConfig({ socialLinks: socialLinks.filter(l => l.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Redes Sociais</h2>
            <p className="text-sm text-gray-500">Ícones de redes sociais (opcional)</p>
          </div>
        </div>
        <button
          onClick={addSocialLink}
          className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Nova Rede
        </button>
      </div>

      <div className="space-y-3">
        {socialLinks.map((link, index) => (
          <div key={link.id} className="group flex items-center gap-3 p-4 bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30 rounded-xl hover:border-blue-500/30 transition-all">
            <span className="w-7 h-7 flex items-center justify-center bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg shrink-0">
              {index + 1}
            </span>

            <span className="text-2xl">{platformIcons[link.platform]}</span>

            <select
              value={link.platform}
              onChange={(e) => updateSocialLink(link.id, { platform: e.target.value as any })}
              className="bg-gray-900/80 border-gray-700 text-white rounded-lg h-9 text-sm px-3"
            >
              <option value="email">Email</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter/X</option>
              <option value="youtube">YouTube</option>
              <option value="twitch">Twitch</option>
              <option value="discord">Discord</option>
              <option value="github">GitHub</option>
              <option value="linkedin">LinkedIn</option>
              <option value="website">Website</option>
            </select>

            <Input
              value={link.url}
              onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
              placeholder="https://..."
              className="bg-gray-900/80 border-gray-700 text-white rounded-lg h-9 text-sm flex-1"
            />

            <button
              onClick={() => removeSocialLink(link.id)}
              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {socialLinks.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/50 flex items-center justify-center">
              <Share2 className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500 mb-3">Nenhuma rede social adicionada</p>
            <button onClick={addSocialLink} className="text-blue-400 hover:text-blue-300 font-medium">
              + Adicionar primeira rede
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Settings Editor ---
function SettingsEditor({ config, updateConfig, onSave, isSaving, onRefreshPreview }: EditorProps & { user?: { email?: string | null; displayName?: string | null } }) {
  const { toast } = useToast();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleResetClick = () => {
    setResetDialogOpen(true);
  };

  const confirmReset = async () => {
    // Reset to default config (you can customize what gets reset)
    updateConfig({
      maxLinksPerBlock: 6,
    });
    setResetDialogOpen(false);
    await onSave();
    toast({
      title: '🔄 Configurações resetadas!',
      description: 'As configurações foram restauradas para os valores padrão.',
    });
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Configurações</h2>
            <p className="text-sm text-gray-500">Configurações do painel e da conta</p>
          </div>
        </div>

        {/* Block Settings */}
        <div className="p-5 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl space-y-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-violet-400" />
            <h3 className="text-white font-medium">Configurações de Blocos</h3>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium text-white">Máximo de links por bloco</Label>
              <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-lg text-sm font-mono">
                {config.maxLinksPerBlock || 6}
              </span>
            </div>
            <Slider
              value={[config.maxLinksPerBlock || 6]}
              onValueChange={([value]) => updateConfig({ maxLinksPerBlock: value })}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-2">Define o limite de links dentro de cada bloco expansível</p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-5 bg-gradient-to-br from-red-900/10 to-red-900/20 border border-red-900/30 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-400" />
            <h3 className="text-red-400 font-medium">Zona de Perigo</h3>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleResetClick}
              className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-colors"
            >
              Resetar todas as configurações
            </button>
          </div>
        </div>
      </div>

      {/* Reset Settings Confirmation Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent className="bg-[#0d0d14] border border-red-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">⚠️ Resetar Configurações?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Esta ação irá restaurar as configurações para os valores padrão.
              <br /><br />
              <span className="text-red-400 font-bold">Atenção:</span> Esta alteração será salva automaticamente e não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReset}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white"
            >
              Confirmar Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// --- Main Admin Page ---
export default function AdminPage() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeMenu, setActiveMenu] = useState<MenuKey>('blocks');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);

  // Function to refresh the preview
  const refreshPreview = () => {
    setPreviewRefreshKey(k => k + 1);
  };
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

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

  const handlePublish = async () => {
    await handleSave();
    setPublishDialogOpen(false);
    toast({
      title: '🚀 Publicado!',
      description: 'Suas alterações estão visíveis no site público.',
    });
  };

  const menuItems = [
    { key: 'blocks' as MenuKey, label: 'Blocos', icon: LayoutDashboard, color: 'from-violet-500 to-purple-600' },
    { key: 'links' as MenuKey, label: 'Links Soltos', icon: Link, color: 'from-emerald-500 to-teal-600' },
    { key: 'tags' as MenuKey, label: 'Tags', icon: Tags, color: 'from-indigo-500 to-purple-600' },
    { key: 'banner' as MenuKey, label: 'Banner', icon: ImageIcon, color: 'from-rose-500 to-pink-600' },
    { key: 'mediakit' as MenuKey, label: 'Media Kit', icon: FileText, color: 'from-orange-500 to-amber-600' },
    { key: 'social' as MenuKey, label: 'Redes Sociais', icon: Share2, color: 'from-blue-500 to-cyan-600' },
    { key: 'music' as MenuKey, label: 'Música', icon: Music, color: 'from-pink-500 to-rose-600' },
    { key: 'background' as MenuKey, label: 'Background', icon: ImageIcon, color: 'from-cyan-500 to-blue-600' },
    { key: 'profile' as MenuKey, label: 'Perfil', icon: User, color: 'from-amber-500 to-orange-600' },
    { key: 'settings' as MenuKey, label: 'Configurações', icon: Settings, color: 'from-gray-500 to-gray-600' },
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
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed md:relative z-50 h-full w-[280px] border-r flex flex-col transition-transform duration-300 ease-in-out bg-[#0d0d14] border-gray-800/50",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          {/* Logo */}
          <div className="p-6 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-white">Morvarg</h1>
                  <p className="text-xs text-gray-500">Painel de Controle</p>
                </div>
              </div>
              {/* Close button for mobile */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-3">Edição</p>
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveMenu(item.key);
                  setMobileMenuOpen(false);
                }}
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
          <header className="h-16 border-b border-gray-800/50 flex items-center justify-between px-4 md:px-6 bg-[#0d0d14]/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-3">
              {/* Hamburger menu button - mobile only */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="text-gray-400 hidden sm:inline">Editando:</span>
              <span className="font-medium capitalize text-white">{activeMenu}</span>
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
                onClick={() => setPublishDialogOpen(true)}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white rounded-xl transition-all font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {isSaving ? 'Salvando...' : 'Publicar'}
              </button>
            </div>
          </header>

          {/* Content Grid */}
          <main className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
            {/* Editor Panel */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-3xl">
              {activeMenu === 'blocks' && (
                <BlocksEditor config={config} updateConfig={updateConfig} onSave={handleSave} isSaving={isSaving} />
              )}
              {activeMenu === 'links' && (
                <SoloLinksEditor config={config} updateConfig={updateConfig} onSave={handleSave} isSaving={isSaving} />
              )}
              {activeMenu === 'tags' && (
                <TagsEditor config={config} updateConfig={updateConfig} onSave={handleSave} isSaving={isSaving} />
              )}
              {activeMenu === 'banner' && (
                <BannerEditor config={config} updateConfig={updateConfig} onSave={handleSave} isSaving={isSaving} />
              )}
              {activeMenu === 'mediakit' && (
                <MediaKitEditor config={config} updateConfig={updateConfig} onSave={handleSave} isSaving={isSaving} />
              )}
              {activeMenu === 'social' && (
                <SocialLinksEditor config={config} updateConfig={updateConfig} onSave={handleSave} isSaving={isSaving} />
              )}
              {activeMenu === 'music' && (
                <MusicEditor config={config} updateConfig={updateConfig} onSave={handleSave} isSaving={isSaving} />
              )}
              {activeMenu === 'background' && (
                <BackgroundEditor config={config} updateConfig={updateConfig} onSave={handleSave} isSaving={isSaving} />
              )}
              {activeMenu === 'profile' && (
                <ProfileEditor config={config} updateConfig={updateConfig} onSave={handleSave} isSaving={isSaving} />
              )}
              {activeMenu === 'settings' && (
                <SettingsEditor config={config} updateConfig={updateConfig} onSave={handleSave} isSaving={isSaving} onRefreshPreview={refreshPreview} />
              )}
            </div>

            {/* Preview Panel - Fixed */}
            <div className="hidden xl:flex w-[420px] border-l border-gray-800/50 bg-gradient-to-b from-[#0d0d14] to-[#0a0a0f] sticky top-0 h-full">
              <LivePreview externalRefreshKey={previewRefreshKey} config={config} />
            </div>
          </main>
        </div>
      </div>

      {/* Publish Confirmation Dialog */}
      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent className="bg-[#0d0d14] border border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Publicar Alterações?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Suas alterações serão salvas e ficarão visíveis publicamente no site.
              Tem certeza que deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublish}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
            >
              Publicar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthGuard>
  );
}
