"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Check, ClipboardList, Calendar, AlertCircle } from "lucide-react";
import { useTodos } from "@/hooks/useTodos";
import { useToast } from "@/contexts/ToastContext";
import { EmptyState } from "./EmptyState";
import { SearchBar } from "./SearchBar";

function isOverdue(timestamp: number): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(timestamp);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
}

function formatDueDate(timestamp: number): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(timestamp);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7) return `${diffDays}d`;

  return dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function TodoList() {
  const { todos, isLoaded, addTodo, toggleTodo, deleteTodo, restoreTodo, clearCompleted } =
    useTodos();
  const { addToast } = useToast();
  const [newTodo, setNewTodo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo("");
    }
  };

  const handleDeleteTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    deleteTodo(id);
    addToast({
      message: `"${todo.text}" deleted`,
      type: "success",
      action: {
        label: "Undo",
        onClick: () => restoreTodo(todo),
      },
    });
  };

  // Filter todos based on search query
  const filteredTodos = useMemo(() => {
    if (!searchQuery.trim()) return todos;

    const query = searchQuery.toLowerCase();
    return todos.filter((todo) => todo.text.toLowerCase().includes(query));
  }, [todos, searchQuery]);

  const completedCount = filteredTodos.filter((t) => t.completed).length;

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
            className="text-xs text-text-secondary hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded px-1"
          >
            Clear done
          </button>
        )}
      </div>

      <div className="mb-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search tasks..."
        />
      </div>

      <form onSubmit={handleSubmit} className="mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-colors"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!newTodo.trim()}
            className="p-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Add new task"
          >
            <Plus size={18} />
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-1">
        {filteredTodos.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No quick tasks"
            description="Add tasks for things you need to do quickly"
          />
        ) : (
          filteredTodos.map((todo) => {
            const todoIsOverdue = todo.dueDate && !todo.completed && isOverdue(todo.dueDate);

            return (
              <div
                key={todo.id}
                className={`group flex items-center gap-2 p-2 rounded-lg hover:bg-surface transition-colors ${
                  todoIsOverdue ? "bg-red-500/5 border border-red-500/20" : ""
                }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${
                    todo.completed
                      ? "bg-accent border-accent text-white"
                      : "border-border hover:border-accent"
                  }`}
                  aria-label={todo.completed ? `Mark "${todo.text}" as incomplete` : `Mark "${todo.text}" as complete`}
                >
                  {todo.completed && <Check size={12} />}
                </button>
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-sm ${
                      todo.completed
                        ? "text-text-secondary line-through"
                        : "text-text-primary"
                    }`}
                  >
                    {todo.text}
                  </span>
                  {todo.dueDate && (
                    <div
                      className={`inline-flex items-center gap-1 ml-2 text-xs ${
                        todoIsOverdue
                          ? "text-red-400"
                          : todo.completed
                          ? "text-text-secondary/50"
                          : "text-text-secondary"
                      }`}
                    >
                      {todoIsOverdue ? (
                        <AlertCircle size={10} />
                      ) : (
                        <Calendar size={10} />
                      )}
                      <span>{formatDueDate(todo.dueDate)}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="p-1 text-text-secondary opacity-30 group-hover:opacity-100 hover:text-red-400 transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-background rounded"
                  aria-label={`Delete task: ${todo.text}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
