import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'vertex_last_exam';

interface LastExamData {
  route: string;
  name: string;
  timestamp: number;
}

export function useLastExam() {
  const [lastExam, setLastExam] = useState<LastExamData | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved) as LastExamData;
        const ONE_DAY = 24 * 60 * 60 * 1000;
        if (Date.now() - data.timestamp < ONE_DAY) {
          setLastExam(data);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.warn('Failed to load last exam:', e);
    }
  }, []);

  const saveLastExam = useCallback((route: string, name: string) => {
    const data: LastExamData = { route, name, timestamp: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLastExam(data);
    } catch (e) {
      console.warn('Failed to save last exam:', e);
    }
  }, []);

  return { lastExam, saveLastExam };
}
