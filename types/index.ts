export type ColumnId = "todo" | "inProgress" | "complete";

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  column: ColumnId;
  order: number;
  createdAt: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
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
