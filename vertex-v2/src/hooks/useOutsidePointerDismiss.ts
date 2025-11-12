import { RefObject, useEffect } from 'react';
import { isDropdownRelated } from './useDropdownGuard';

type UseOutsidePointerDismissParams = {
  containerRef: RefObject<HTMLElement>;
  isDisabled?: boolean;
  isDropdownOpen?: boolean;
  extraSafeSelectors?: string[];
  onDismiss: () => void;
};

/**
 * useOutsidePointerDismiss
 * Dispara `onDismiss` ao clicar fora de `containerRef`, ignorando cliques
 * que partem de elementos de dropdown/portal (Radix) e seletores extras.
 */
export function useOutsidePointerDismiss({
  containerRef,
  isDisabled = false,
  isDropdownOpen = false,
  extraSafeSelectors = [],
  onDismiss
}: UseOutsidePointerDismissParams) {
  useEffect(() => {
    if (isDisabled) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;

      // Clique partiu de dentro do container
      if (containerRef.current && target && containerRef.current.contains(target)) {
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
      // Se não houver dropdown aberto, seguimos normalmente; se houver e o clique não foi no dropdown, 
      // permitimos o dismiss para não bloquear interação fora.

      // Seletores extras seguros (ex.: triggers customizados)
      if (target && extraSafeSelectors.some(sel => target.closest(sel))) return;

      onDismiss();
    };

    document.addEventListener('pointerdown', handlePointerDown, { capture: true });
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, { capture: true } as any);
    };
  }, [containerRef, isDisabled, isDropdownOpen, extraSafeSelectors, onDismiss]);
}
