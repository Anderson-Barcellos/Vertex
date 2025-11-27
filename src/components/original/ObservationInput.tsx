import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from '@phosphor-icons/react';

interface ObservationInputProps {
  organId: string;
  observations: string[];
  onAddObservation: (organId: string, text: string) => void;
  onRemoveObservation: (organId: string, index: number) => void;
}

export default function ObservationInput({
  organId,
  observations,
  onAddObservation,
  onRemoveObservation
}: ObservationInputProps) {
  const [isExpanded, setIsExpanded] = useState(observations.length > 0);
  const [inputText, setInputText] = useState('');

  const handleAdd = () => {
    if (inputText.trim()) {
      onAddObservation(organId, inputText.trim());
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAdd();
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-border/50">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`obs-${organId}`}
          checked={isExpanded}
          onCheckedChange={(checked) => setIsExpanded(checked === true)}
        />
        <label
          htmlFor={`obs-${organId}`}
          className="text-sm font-medium text-muted-foreground cursor-pointer"
        >
          Observações extras
        </label>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {observations.length > 0 && (
            <div className="space-y-2">
              {observations.map((obs, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 bg-muted/50 rounded-md text-sm"
                >
                  <span className="flex-1">{obs}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveObservation(organId, idx)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X size={16} weight="bold" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite uma observação adicional..."
              className="min-h-[60px] text-sm"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              disabled={!inputText.trim()}
              className="shrink-0"
            >
              <Plus size={16} weight="bold" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Ctrl+Enter para adicionar</p>
        </div>
      )}
    </div>
  );
}
