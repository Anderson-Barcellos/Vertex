import { useState, useRef, useEffect } from 'react';
import { CaretDown, Brain, Lightning } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import type { AIProvider } from '@/types/report';

interface ModelConfig {
  id: string;
  name: string;
  description: string;
  reasoning?: 'none' | 'low' | 'medium' | 'high';
}

const AI_MODELS: Record<AIProvider, ModelConfig[]> = {
  gemini: [
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', description: 'Preview, reasoning adaptativo' },
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', description: 'Preview, rápido' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Estável, 1M ctx' },
    { id: 'gemini-flash-lite-latest', name: 'Gemini Flash 2.5', description: 'Ultra-rápido, econômico' }
  ],
  openai: [
    { id: 'gpt-5.2-instant', name: 'GPT 5.2 Instant', description: 'Flagship (reasoning: none)', reasoning: 'none' },
    { id: 'gpt-5.2-medium', name: 'GPT 5.2', description: 'Flagship (reasoning: medium)', reasoning: 'medium' },
    { id: 'gpt-5-mini', name: 'GPT-5 Mini', description: 'Rápido e econômico' },
    { id: 'o3', name: 'o3', description: 'Reasoning avançado' },
    { id: 'gpt-4.1', name: 'GPT-4.1', description: 'Coding otimizado, 1M ctx' },
    { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', description: 'Compacto e eficiente' }
  ],
  claude: [
    { id: 'claude-3.5-sonnet-latest', name: 'Claude 3.5 Sonnet', description: 'Balanceado' },
    { id: 'claude-3.5-haiku', name: 'Claude 3.5 Haiku', description: 'Rápido e econômico' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Mais poderoso' }
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
  },
  claude: {
    icon: Brain,
    label: 'Claude',
    activeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
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
