"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DEBOUNCE_MS = 500;
const NOTES_ID = "main-notes"; // Single notes document

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: number;
  updated_at: number;
}

export function useNotes() {
  const [notes, setNotes] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const noteIdRef = useRef<string>(NOTES_ID);

  // Load notes from Supabase on mount
  useEffect(() => {
    async function loadNotes() {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", NOTES_ID)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No notes exist yet, create initial empty note
          const now = Date.now();
          await supabase.from("notes").insert({
            id: NOTES_ID,
            title: "Notes",
            content: "",
            created_at: now,
            updated_at: now,
          });
          setNotes("");
        } else {
          console.error("Error loading notes:", error);
        }
        setIsLoaded(true);
        return;
      }

      setNotes(data.content);
      setIsLoaded(true);
    }

    loadNotes();
  }, []);

  const saveToDatabase = useCallback(async (value: string) => {
    const now = Date.now();
    const { error } = await supabase
      .from("notes")
      .upsert({
        id: NOTES_ID,
        title: "Notes",
        content: value,
        created_at: now,
        updated_at: now,
      })
      .eq("id", NOTES_ID);

    if (error) {
      console.error("Error saving notes:", error);
    }
  }, []);

  const updateNotes = useCallback(
    (value: string) => {
      setNotes(value);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        saveToDatabase(value);
      }, DEBOUNCE_MS);
    },
    [saveToDatabase]
  );

  const updateNotesImmediate = useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setNotes(value);
      saveToDatabase(value);
    },
    [saveToDatabase]
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
