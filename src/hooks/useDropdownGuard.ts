import { useEffect, useState, RefObject } from 'react';

type DropdownRegistration<T extends HTMLElement = HTMLElement> = {
  triggerRef?: RefObject<T | null>;
  contentRef?: RefObject<T | null>;
};

type UseDropdownGuardOptions<T extends HTMLElement = HTMLElement> = {
  registrations?: DropdownRegistration<T>[];
  isContextDropdownOpen?: boolean;
};

const registeredDropdowns = new Set<HTMLElement>();
const registrySubscribers = new Set<() => void>();

const notifyRegistrySubscribers = () => {
  registrySubscribers.forEach((fn) => fn());
};

const pruneRegistry = () => {
  let hasPruned = false;
  registeredDropdowns.forEach((node) => {
    if (!node.isConnected) {
      registeredDropdowns.delete(node);
      hasPruned = true;
    }
  });
  if (hasPruned) notifyRegistrySubscribers();
};

const validateDropdownRoot = (el: HTMLElement) => {
  const portalRoot = el.closest('[data-radix-dropdown-menu-content], [data-radix-select-content]');
  if (portalRoot && portalRoot !== el) {
    console.warn('[useDropdownGuard] Registre o nó raiz do dropdown/portal, não um filho.', {
      registeredNode: el,
      portalRoot,
    });
  }
};

const registerDropdownElement = (el: HTMLElement | null) => {
  if (!el) return () => {};
  registeredDropdowns.add(el);
  validateDropdownRoot(el);
  notifyRegistrySubscribers();

  return () => {
    if (registeredDropdowns.delete(el)) {
      notifyRegistrySubscribers();
    }
  };
};

const isDropdownRelated = (el: Element | null): boolean => {
  if (!el) return false;
  pruneRegistry();
  for (const dropdown of registeredDropdowns) {
    if (dropdown === el || dropdown.contains(el)) return true;
  }
  return false;
};

/**
 * useDropdownGuard
 * Observa refs explícitas de dropdowns e uma flag opcional de contexto para inferir se há dropdown aberto.
 */
export function useDropdownGuard<T extends HTMLElement = HTMLElement>({
  registrations = [],
  isContextDropdownOpen = false,
}: UseDropdownGuardOptions<T> = {}) {
  const [isAnyDropdownOpen, setIsAnyDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    registrations.forEach(({ triggerRef, contentRef }) => {
      if (triggerRef?.current) {
        cleanups.push(registerDropdownElement(triggerRef.current));
      }
      if (contentRef?.current) {
        cleanups.push(registerDropdownElement(contentRef.current));
      }
    });

    const refreshState = () => {
      pruneRegistry();
      const hasRegisteredDropdown = registeredDropdowns.size > 0;
      setIsAnyDropdownOpen(isContextDropdownOpen || hasRegisteredDropdown);
    };

    refreshState();

    const unsubscribe = () => registrySubscribers.delete(refreshState);
    registrySubscribers.add(refreshState);

    return () => {
      cleanups.forEach((fn) => fn());
      unsubscribe();
    };
  }, [registrations, isContextDropdownOpen]);

  return { isAnyDropdownOpen, isDropdownRelated, registerDropdownElement } as const;
}

export { isDropdownRelated, registerDropdownElement };

