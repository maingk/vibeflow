export type ColumnId = "todo" | "inProgress" | "complete";

export type Priority = "low" | "medium" | "high";

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  column: ColumnId;
  order: number;
  createdAt: number;
  priority?: Priority;
  tags?: string[];
  dueDate?: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: number;
}

export interface Column {
  id: ColumnId;
  title: string;
}

export const COLUMNS: Column[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress" },
  { id: "complete", title: "Complete" },
];
