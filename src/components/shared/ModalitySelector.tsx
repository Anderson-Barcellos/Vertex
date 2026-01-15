import React from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export interface ModalityOption {
  id: string;
  name: string;
  examType: string;
}

interface ModalitySelectorProps {
  options: ModalityOption[];
  selected: string;
  onChange: (modalityId: string) => void;
  className?: string;
}

export default function ModalitySelector({
  options,
  selected,
  onChange,
  className
}: ModalitySelectorProps) {
  const selectedOption = options.find(o => o.id === selected) || options[0];

  return (
    <div className={cn('relative inline-block', className)}>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'appearance-none bg-slate-800/50 border border-slate-600/50 rounded-lg',
          'px-4 py-2 pr-10 text-sm font-medium text-slate-200',
          'hover:bg-slate-700/50 hover:border-slate-500/50',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
          'transition-all duration-200 cursor-pointer'
        )}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id} className="bg-slate-800">
            {option.name}
          </option>
        ))}
      </select>
      <CaretDown 
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" 
        size={16} 
        weight="bold"
      />
    </div>
  );
}
