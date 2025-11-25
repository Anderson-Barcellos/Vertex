import { useEffect, useCallback, useRef } from 'react';
import { SelectedFinding, FindingInstance } from '@/types/report';

interface ExamState {
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  tempFindingDetails: Record<string, Record<string, { severity?: string; instances?: FindingInstance[] }>>;
  lastSaved: number;
}

const STORAGE_PREFIX = 'vertex_exam_';
const DEBOUNCE_MS = 1000;

export function useAutoSave(
  examKey: string,
  selectedFindings: SelectedFinding[],
  normalOrgans: string[],
  tempFindingDetails: Record<string, Record<string, { severity?: string; instances?: FindingInstance[] }>>,
  onRestore?: (state: ExamState) => void
) {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `${STORAGE_PREFIX}${examKey}`;

  const saveState = useCallback(() => {
    const state: ExamState = {
      selectedFindings,
      normalOrgans,
      tempFindingDetails,
      lastSaved: Date.now()
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) {
      console.warn('Auto-save failed:', e);
    }
  }, [selectedFindings, normalOrgans, tempFindingDetails, storageKey]);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(saveState, DEBOUNCE_MS);
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [selectedFindings, normalOrgans, tempFindingDetails, saveState]);

  const loadState = useCallback((): ExamState | null => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved) as ExamState;
      }
    } catch (e) {
      console.warn('Auto-load failed:', e);
    }
    return null;
  }, [storageKey]);

  const clearState = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn('Clear state failed:', e);
    }
  }, [storageKey]);

  useEffect(() => {
    const savedState = loadState();
    if (savedState && onRestore) {
      const timeSinceSave = Date.now() - savedState.lastSaved;
      const ONE_HOUR = 60 * 60 * 1000;
      if (timeSinceSave < ONE_HOUR) {
        onRestore(savedState);
      } else {
        clearState();
      }
    }
  }, []);

  return { loadState, clearState, saveState };
}
