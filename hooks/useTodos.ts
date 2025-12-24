"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { TodoItem } from "@/types";

const STORAGE_KEY = "vibeflow-todos";

export function useTodos() {
  const [todos, setTodos, isLoaded] = useLocalStorage<TodoItem[]>(
    STORAGE_KEY,
    []
  );

  const addTodo = useCallback(
    (text: string) => {
      const newTodo: TodoItem = {
        id: crypto.randomUUID(),
        text,
        completed: false,
      };
      setTodos((prev) => [...prev, newTodo]);
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [setTodos]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    },
    [setTodos]
  );

  const restoreTodo = useCallback(
    (todo: TodoItem) => {
      setTodos((prev) => [...prev, todo]);
    },
    [setTodos]
  );

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, [setTodos]);

  return {
    todos,
    isLoaded,
    addTodo,
    toggleTodo,
    deleteTodo,
    restoreTodo,
    clearCompleted,
  };
}
