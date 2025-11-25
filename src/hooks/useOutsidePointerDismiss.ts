import { RefObject, useEffect, useRef } from 'react';
import { isDropdownRelated } from './useDropdownGuard';

type UseOutsidePointerDismissParams<T extends HTMLElement = HTMLElement> = {
  containerRef: RefObject<T | null>;
  isDisabled?: boolean;
  isDropdownOpen?: boolean;
  extraSafeSelectors?: string[];
  onDismiss: () => void;
};

/**
 * useOutsidePointerDismiss
 * Dispara `onDismiss` ao clicar fora de `containerRef`, ignorando cliques
 * que partem de elementos de dropdown/portal (Radix) e seletores extras.
 * 
 * Fix: Previne minimização ao clicar em trigger de dropdown já aberto.
 */
export function useOutsidePointerDismiss<T extends HTMLElement = HTMLElement>({
  containerRef,
  isDisabled = false,
  isDropdownOpen = false,
  extraSafeSelectors = [],
  onDismiss
}: UseOutsidePointerDismissParams<T>) {
  const pointerDownOnTriggerRef = useRef(false);
  const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isDisabled) return;

    const isTriggerElement = (target: HTMLElement | null): boolean => {
      if (!target) return false;
      return !!(
        target.closest('[data-radix-select-trigger]') ||
        target.closest('[data-radix-dropdown-menu-trigger]') ||
        target.closest('[aria-haspopup]') ||
        target.closest('select') ||
        target.closest('[role="combobox"]') ||
        target.closest('[data-slot="select-trigger"]')
      );
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;

      // Marca se o pointerdown foi em um trigger
      pointerDownOnTriggerRef.current = isTriggerElement(target);

      // Clique partiu de dentro do container
      if (containerRef.current && target && containerRef.current.contains(target)) {
        return;
      }

      // Se há um input/textarea focado dentro do container, não fechar
      const activeElement = document.activeElement;
      if (
        activeElement &&
        containerRef.current?.contains(activeElement) &&
        (activeElement.tagName === 'INPUT' || 
         activeElement.tagName === 'TEXTAREA' ||
         activeElement.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      // Se clicou em um trigger, não fazer nada agora (aguardar pointerup)
      if (pointerDownOnTriggerRef.current) {
        return;
      }

      // composedPath para checar a cadeia
      const path: EventTarget[] = typeof (event as any).composedPath === 'function'
        ? (event as any).composedPath()
        : [];

      // Path tem elemento relacionado a dropdown?
      const pathHasDropdown = path.some((node) => node instanceof Element && isDropdownRelated(node));
      
      // Se houver dropdown aberto, só ignoramos se o clique foi no próprio dropdown
      if (isDropdownOpen && pathHasDropdown) return;

      // Seletores extras seguros (ex.: triggers customizados)
      if (target && extraSafeSelectors.some(sel => target.closest(sel))) return;

      // Limpa timeout anterior se existir
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }

      // Pequeno delay para permitir que Radix processe eventos
      dismissTimeoutRef.current = setTimeout(() => {
        onDismiss();
      }, 10);
    };

    const handlePointerUp = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;

      // Se o pointerdown foi em um trigger e o pointerup também
      // significa que foi um clique completo no trigger
      if (pointerDownOnTriggerRef.current && isTriggerElement(target)) {
        // Cancela qualquer dismiss pendente
        if (dismissTimeoutRef.current) {
          clearTimeout(dismissTimeoutRef.current);
          dismissTimeoutRef.current = null;
        }
        // Não dismissar - deixar o Radix gerenciar o dropdown
        pointerDownOnTriggerRef.current = false;
        return;
      }

      // Reset do flag
      pointerDownOnTriggerRef.current = false;
    };

    document.addEventListener('pointerdown', handlePointerDown, { capture: true });
    document.addEventListener('pointerup', handlePointerUp, { capture: true });
    
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, { capture: true } as any);
      document.removeEventListener('pointerup', handlePointerUp, { capture: true } as any);
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }
    };
  }, [containerRef, isDisabled, isDropdownOpen, extraSafeSelectors, onDismiss]);
}
