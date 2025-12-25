"use client";

import { useCallback, useEffect, useState } from "react";
import { TodoItem } from "@/types";
import { supabase } from "@/lib/supabase";

export function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load todos from Supabase on mount
  useEffect(() => {
    async function loadTodos() {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading todos:", error);
        setIsLoaded(true);
        return;
      }

      const transformedTodos: TodoItem[] = (data || []).map((row) => ({
        id: row.id,
        text: row.text,
        completed: row.completed,
        dueDate: row.due_date || undefined,
      }));

      setTodos(transformedTodos);
      setIsLoaded(true);
    }

    loadTodos();
  }, []);

  const addTodo = useCallback(async (text: string) => {
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };

    const { error } = await supabase.from("todos").insert({
      id: newTodo.id,
      text: newTodo.text,
      completed: newTodo.completed,
      due_date: newTodo.dueDate,
    });

    if (error) {
      console.error("Error adding todo:", error);
      return;
    }

    setTodos((prev) => [...prev, newTodo]);
  }, []);

  const toggleTodo = useCallback(async (id: string) => {
    const todo = await supabase.from("todos").select("*").eq("id", id).single();

    if (todo.error) {
      console.error("Error fetching todo:", todo.error);
      return;
    }

    const { error } = await supabase
      .from("todos")
      .update({ completed: !todo.data.completed })
      .eq("id", id);

    if (error) {
      console.error("Error toggling todo:", error);
      return;
    }

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting todo:", error);
      return;
    }

    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const restoreTodo = useCallback(async (todo: TodoItem) => {
    const { error } = await supabase.from("todos").insert({
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      due_date: todo.dueDate,
    });

    if (error) {
      console.error("Error restoring todo:", error);
      return;
    }

    setTodos((prev) => [...prev, todo]);
  }, []);

  const clearCompleted = useCallback(async () => {
    const completedIds = todos.filter((t) => t.completed).map((t) => t.id);

    if (completedIds.length === 0) return;

    const { error } = await supabase
      .from("todos")
      .delete()
      .in("id", completedIds);

    if (error) {
      console.error("Error clearing completed todos:", error);
      return;
    }

    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, [todos]);

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
