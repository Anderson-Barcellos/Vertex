import { useState, useRef, useEffect } from 'react';
import { CaretDown, Brain, Lightning } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import type { AIProvider } from '@/types/report';

interface ModelConfig {
  id: string;
  name: string;
  description: string;
}

const AI_MODELS: Record<AIProvider, ModelConfig[]> = {
  gemini: [
    { id: 'gemini-2.5-pro-preview-06-05', name: 'Gemini 2.5 Pro', description: 'Mais avançado' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Rápido e eficiente' }
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Multimodal otimizado' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Rápido e econômico' }
  ]
};

const PROVIDER_CONFIG: Record<AIProvider, { icon: typeof Brain; label: string; activeClass: string }> = {
  gemini: {
    icon: Brain,
    label: 'Gemini',
    activeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  openai: {
    icon: Lightning,
    label: 'OpenAI',
    activeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  }
};

interface AIModelSelectorProps {
  currentProvider: AIProvider;
  currentModelId: string;
  onModelChange: (provider: AIProvider, modelId: string) => void;
  className?: string;
  compact?: boolean;
}

export function AIModelSelector({
  currentProvider,
  currentModelId,
  onModelChange,
  className,
  compact = false
}: AIModelSelectorProps) {
  const [openMenu, setOpenMenu] = useState<AIProvider | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getModelName = (provider: AIProvider, modelId: string) => {
    return AI_MODELS[provider].find(m => m.id === modelId)?.name || PROVIDER_CONFIG[provider].label;
  };

  const handleProviderClick = (provider: AIProvider) => {
    if (currentProvider !== provider) {
      onModelChange(provider, AI_MODELS[provider][0].id);
    }
    setOpenMenu(openMenu === provider ? null : provider);
  };

  const handleModelSelect = (provider: AIProvider, modelId: string) => {
    onModelChange(provider, modelId);
    setOpenMenu(null);
  };

  return (
    <div ref={containerRef} className={cn("flex gap-1.5", className)}>
      {(Object.keys(PROVIDER_CONFIG) as AIProvider[]).map((provider) => {
        const config = PROVIDER_CONFIG[provider];
        const Icon = config.icon;
        const isActive = currentProvider === provider;
        const isOpen = openMenu === provider;

        return (
          <div key={provider} className="relative">
            <button
              onClick={() => handleProviderClick(provider)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all border",
                isActive
                  ? config.activeClass
                  : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-gray-300"
              )}
            >
              <Icon size={compact ? 12 : 14} weight={isActive ? "fill" : "regular"} />
              {!compact && (
                <span className="truncate max-w-[70px]">
                  {isActive ? getModelName(provider, currentModelId) : config.label}
                </span>
              )}
              <CaretDown 
                size={10} 
                className={cn(
                  "transition-transform duration-200",
                  isOpen && "rotate-180"
                )} 
              />
            </button>

            <div className={cn(
              "absolute top-full right-0 mt-1 w-44 rounded-lg border border-white/10 bg-[#0c1222] shadow-xl overflow-hidden z-50",
              "transition-all duration-200 origin-top-right",
              isOpen 
                ? "opacity-100 scale-100 translate-y-0" 
                : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
            )}>
              {AI_MODELS[provider].map((model, idx) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(provider, model.id)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-xs transition-colors",
                    "hover:bg-white/5",
                    currentModelId === model.id && isActive && "bg-white/10"
                  )}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <div className={cn(
                    "font-medium",
                    currentModelId === model.id && isActive ? "text-white" : "text-gray-300"
                  )}>
                    {model.name}
                  </div>
                  <div className="text-[10px] text-gray-500">{model.description}</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { AI_MODELS, PROVIDER_CONFIG };
export type { ModelConfig };
