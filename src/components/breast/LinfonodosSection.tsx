import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface LinfonodosSectionProps {
  linfonodoDireito: 'normal' | 'alterado';
  linfonodoEsquerdo: 'normal' | 'alterado';
  onChangeDireito: (valor: 'normal' | 'alterado') => void;
  onChangeEsquerdo: (valor: 'normal' | 'alterado') => void;
}

/**
 * Componente isolado para avaliação de linfonodos axilares
 *
 * Responsabilidades:
 * - Renderizar card com título
 * - Dois selects lado a lado (Direita e Esquerda)
 * - Sem dependências de outros componentes breast
 * - Design minimalista
 *
 * @example
 * ```tsx
 * <LinfonodosSection
 *   linfonodoDireito="normal"
 *   linfonodoEsquerdo="alterado"
 *   onChangeDireito={handleDireito}
 *   onChangeEsquerdo={handleEsquerdo}
 * />
 * ```
 */
export const LinfonodosSection: React.FC<LinfonodosSectionProps> = ({
  linfonodoDireito,
  linfonodoEsquerdo,
  onChangeDireito,
  onChangeEsquerdo,
}) => {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      {/* Título da seção */}
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Linfonodos Axilares
      </h3>

      {/* Grid de 2 colunas */}
      <div className="grid grid-cols-2 gap-6">
        {/* Coluna Direita */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Direita:
          </label>
          <Select value={linfonodoDireito} onValueChange={onChangeDireito}>
            <SelectTrigger
              className={cn(
                'w-full rounded-lg border border-gray-300 bg-white text-gray-900',
                'hover:border-gray-400 transition-colors',
                'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent
              className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-lg"
              position="popper"
              side="bottom"
              sideOffset={8}
            >
              <SelectItem
                value="normal"
                className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors"
              >
                Normal
              </SelectItem>
              <SelectItem
                value="alterado"
                className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors"
              >
                Alterado
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Coluna Esquerda */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Esquerda:
          </label>
          <Select value={linfonodoEsquerdo} onValueChange={onChangeEsquerdo}>
            <SelectTrigger
              className={cn(
                'w-full rounded-lg border border-gray-300 bg-white text-gray-900',
                'hover:border-gray-400 transition-colors',
                'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent
              className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-lg"
              position="popper"
              side="bottom"
              sideOffset={8}
            >
              <SelectItem
                value="normal"
                className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors"
              >
                Normal
              </SelectItem>
              <SelectItem
                value="alterado"
                className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors"
              >
                Alterado
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default LinfonodosSection;
