"use client";

import { useCallback, useRef, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "vibeflow-notes";
const DEBOUNCE_MS = 500;

export function useNotes() {
  const [notes, setNotes, isLoaded] = useLocalStorage<string>(STORAGE_KEY, "");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateNotes = useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setNotes(value);
      }, DEBOUNCE_MS);
    },
    [setNotes]
  );

  const updateNotesImmediate = useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setNotes(value);
    },
    [setNotes]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    notes,
    isLoaded,
    updateNotes,
    updateNotesImmediate,
  };
}
