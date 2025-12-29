"use client";

import { useMemo } from "react";
import { KanbanCard } from "@/types";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface AnalyticsProps {
  cards: KanbanCard[];
}

const COLUMN_COLORS = {
  incoming: "#d8b4c8",
  todo: "#b4a7d6",
  progress: "#a8c5a0",
};

const COLUMN_LABELS = {
  incoming: "Incoming",
  todo: "To Do",
  progress: "In Progress",
};

const PRIORITY_COLORS = {
  high: "#f97316",    // orange (matches card priority)
  medium: "#d946ef",  // magenta (matches card priority)
  low: "#06b6d4",     // cyan (matches card priority)
};

export function Analytics({ cards }: AnalyticsProps) {
  // Calculate totals by column
  const totalsByColumn = useMemo(() => {
    return cards.reduce(
      (acc, card) => {
        acc[card.column] = (acc[card.column] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [cards]);

  // Calculate totals by priority (only count cards WITH a priority set)
  const totalsByPriority = useMemo(() => {
    return cards.reduce(
      (acc, card) => {
        if (card.priority) {
          acc[card.priority] = (acc[card.priority] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );
  }, [cards]);

  const activeTotalsData = useMemo(() => [
    { name: "High", value: totalsByPriority.high || 0, color: PRIORITY_COLORS.high },
    { name: "Medium", value: totalsByPriority.medium || 0, color: PRIORITY_COLORS.medium },
    { name: "Low", value: totalsByPriority.low || 0, color: PRIORITY_COLORS.low },
  ], [totalsByPriority]);

  // Calculate tasks by assignee
  const tasksByAssignee = useMemo(() => {
    const assigneeCounts = cards.reduce((acc, card) => {
      if (card.assignee) {
        acc[card.assignee] = (acc[card.assignee] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by count (descending), limit to top 5
    return Object.entries(assigneeCounts)
      .map(([name, value]) => ({ name, value, color: PRIORITY_COLORS.medium }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [cards]);

  // Calculate tasks by tag
  const tasksByTag = useMemo(() => {
    const tagCounts = cards.reduce((acc, card) => {
      if (card.tags) {
        card.tags.forEach(tag => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by count (descending), limit to top 5
    return Object.entries(tagCounts)
      .map(([name, value]) => ({ name, value, color: PRIORITY_COLORS.low }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [cards]);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 mb-4">
      <h2 className="text-base font-semibold mb-4 text-[var(--color-text-primary)]">
        Task Board Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Totals Chart */}
        <div className="flex flex-col items-center">
          <h3 className="text-xs font-medium mb-3 px-3 py-1.5 bg-[#f4e4b8] text-gray-800 rounded">
            Projects, by priority level
          </h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={activeTotalsData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} label={{ position: 'center', fontSize: 14, fontWeight: 'bold', fill: '#ffffff' }}>
                {activeTotalsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks by Assignee Chart */}
        <div className="flex flex-col items-center">
          <h3 className="text-xs font-medium mb-3 px-3 py-1.5 bg-[#f4e4b8] text-gray-800 rounded">
            Tasks by Assignee
          </h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={tasksByAssignee}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} label={{ position: 'center', fontSize: 14, fontWeight: 'bold', fill: '#ffffff' }}>
                {tasksByAssignee.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks by Tag Chart */}
        <div className="flex flex-col items-center">
          <h3 className="text-xs font-medium mb-3 px-3 py-1.5 bg-[#f4e4b8] text-gray-800 rounded">
            Tasks by Tag
          </h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={tasksByTag}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} label={{ position: 'center', fontSize: 14, fontWeight: 'bold', fill: '#ffffff' }}>
                {tasksByTag.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
