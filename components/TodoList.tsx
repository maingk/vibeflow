"use client";

import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { useTodos } from "@/hooks/useTodos";

export function TodoList() {
  const { todos, isLoaded, addTodo, toggleTodo, deleteTodo, clearCompleted } =
    useTodos();
  const [newTodo, setNewTodo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo("");
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;

  if (!isLoaded) {
    return (
      <div className="p-4">
        <div className="text-text-secondary text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
          Quick Tasks
        </h2>
        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            className="text-xs text-text-secondary hover:text-accent transition-colors"
          >
            Clear done
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors"
          />
          <button
            type="submit"
            disabled={!newTodo.trim()}
            className="p-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-1">
        {todos.length === 0 ? (
          <p className="text-sm text-text-secondary/50 text-center py-4">
            No tasks yet
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="group flex items-center gap-2 p-2 rounded-lg hover:bg-surface transition-colors"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  todo.completed
                    ? "bg-accent border-accent text-white"
                    : "border-border hover:border-accent"
                }`}
              >
                {todo.completed && <Check size={12} />}
              </button>
              <span
                className={`flex-1 text-sm ${
                  todo.completed
                    ? "text-text-secondary line-through"
                    : "text-text-primary"
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="p-1 text-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
