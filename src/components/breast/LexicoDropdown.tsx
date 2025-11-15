import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

/**
 * Interface para opções do léxico BI-RADS com pontuação
 */
export interface OpcaoLexicoComPontuacao {
  id: string;
  label: string;
  valor: string;
  pontos?: number; // -1 (negativo), 0, 1, 2, 3
  descricao?: string;
}

interface LexicoDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: OpcaoLexicoComPontuacao[];
  placeholder?: string;
  showPoints?: boolean;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Função auxiliar para obter cor baseada em pontos
 */
function getPointColor(points?: number): string {
  if (points === undefined || points === 0) return 'bg-gray-300';
  if (points === -1) return 'bg-green-500';
  if (points === 1) return 'bg-yellow-400';
  if (points === 2) return 'bg-orange-400';
  if (points === 3) return 'bg-red-500';
  return 'bg-gray-300';
}

/**
 * Função auxiliar para obter texto legível de pontos
 */
function getPointsLabel(points?: number): string {
  if (points === undefined) return '-';
  if (points === -1) return 'NEG';
  if (points === 0) return '0';
  if (points === 1) return '+1';
  if (points === 2) return '+2';
  if (points === 3) return '+3';
  return '-';
}

/**
 * Componente de Dropdown reutilizável para léxicos BI-RADS
 *
 * @example
 * ```tsx
 * <LexicoDropdown
 *   label="Forma"
 *   value={forma}
 *   onChange={setForma}
 *   options={OPCOES_FORMA}
 *   showPoints
 * />
 * ```
 */
export const LexicoDropdown: React.FC<LexicoDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecione uma opção...',
  showPoints = false,
  disabled = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Encontrar opção selecionada
  const selectedOption = options.find((opt) => opt.valor === value);

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {/* Select Trigger */}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            'w-full rounded-lg border border-border bg-background text-foreground',
            'hover:border-border/80 transition-colors',
            'focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            value && 'font-medium'
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex items-center gap-2 flex-1">
              <SelectValue placeholder={placeholder} />

              {/* Indicador visual de pontos no trigger */}
              {showPoints && selectedOption && selectedOption.pontos !== undefined && (
                <div
                  className={cn(
                    'ml-auto w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white',
                    getPointColor(selectedOption.pontos)
                  )}
                  title={`${selectedOption.pontos} pontos`}
                >
                  {getPointsLabel(selectedOption.pontos)}
                </div>
              )}
            </div>
          </div>
        </SelectTrigger>

        {/* Select Content */}
        <SelectContent
          className="rounded-lg border border-border bg-popover text-popover-foreground shadow-lg"
          position="popper"
          side="bottom"
          sideOffset={8}
          onOpenChange={setIsOpen}
        >
          {options.length === 0 ? (
            <div className="px-2 py-2 text-sm text-muted-foreground text-center">
              Nenhuma opção disponível
            </div>
          ) : (
            options.map((option) => (
              <SelectItem
                key={option.id}
                value={option.valor}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2 rounded-md',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground',
                  'cursor-pointer transition-colors'
                )}
              >
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{option.label}</span>

                    {/* Descrição em tooltip (visível em hover) */}
                    {option.descricao && (
                      <span className="text-xs text-muted-foreground hidden group-hover:block">
                        {option.descricao}
                      </span>
                    )}
                  </div>

                  {/* Indicador de pontos */}
                  {showPoints && option.pontos !== undefined && (
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0',
                        getPointColor(option.pontos)
                      )}
                      title={`${option.label}: ${getPointsLabel(option.pontos)} ponto(s)`}
                    >
                      {getPointsLabel(option.pontos)}
                    </div>
                  )}
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Descrição da opção selecionada */}
      {selectedOption?.descricao && (
        <div className="mt-1 px-3 py-2 rounded-md bg-secondary/30 border border-secondary/50">
          <p className="text-xs text-muted-foreground">{selectedOption.descricao}</p>
        </div>
      )}

      {/* Indicador de pontuação total */}
      {showPoints && selectedOption && selectedOption.pontos !== undefined && (
        <div className="flex items-center gap-2 mt-1">
          <div
            className={cn(
              'w-4 h-4 rounded-full',
              getPointColor(selectedOption.pontos)
            )}
          />
          <span className="text-xs font-medium text-muted-foreground">
            Pontuação: <strong>{getPointsLabel(selectedOption.pontos)}</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default LexicoDropdown;
