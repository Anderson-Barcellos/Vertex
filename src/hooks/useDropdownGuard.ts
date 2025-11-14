import { useEffect, useState, RefObject } from 'react';

const isDropdownRelated = (el: Element | null): boolean => {
  if (!el) return false;
  const role = el.getAttribute('role');
  const slot = el.getAttribute('data-slot');
  const dataState = el.getAttribute('data-state');
  const ariaExpanded = el.getAttribute('aria-expanded');

  if (
    el.closest('[data-radix-portal]') ||
    el.closest('[data-radix-popper-content-wrapper]') ||
    el.closest('[data-radix-select-content]') ||
    el.closest('[data-radix-dropdown-menu-content]')
  ) return true;

  if (
    role === 'listbox' || role === 'option' || role === 'combobox' ||
    role === 'menu' || role === 'menuitem'
  ) return true;

  if (dataState === 'open' || ariaExpanded === 'true') return true;
  if (slot === 'select-content' || slot === 'select-trigger' || slot === 'select-item') return true;

  return false;
};

/**
 * useDropdownGuard
 * Observa o DOM por sinais de dropdowns/portais abertos (Radix) e retorna booleano.
 */
export function useDropdownGuard<T extends HTMLElement = HTMLElement>(refs: RefObject<T | null>[] = []) {
  const [isAnyDropdownOpen, setIsAnyDropdownOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const open =
        document.querySelector('[data-state="open"]') !== null ||
        document.querySelector('[aria-expanded="true"]') !== null ||
        document.querySelector('[data-custom-dropdown="open"]') !== null ||
        document.querySelector('[data-radix-dropdown-menu-content]') !== null ||
        document.querySelector('[data-radix-select-content]') !== null;
      setIsAnyDropdownOpen(!!open);
    };

    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-state', 'aria-expanded', 'data-custom-dropdown'],
      subtree: true,
      childList: true
    });
    refs.forEach(r => {
      if (r.current) {
        observer.observe(r.current, {
          attributes: true,
          attributeFilter: ['data-state', 'aria-expanded', 'data-custom-dropdown'],
          subtree: true
        });
      }
    });

    // Atualiza no mount também
    update();

    return () => observer.disconnect();
  }, [refs]);

  return { isAnyDropdownOpen, isDropdownRelated };
}

export { isDropdownRelated };

