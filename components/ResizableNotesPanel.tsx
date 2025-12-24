"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { NotesPanel } from "./NotesPanel";

export function ResizableNotesPanel() {
  const [height, setHeight] = useState(256); // Default h-64 = 256px
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const deltaY = startYRef.current - e.clientY;
    const newHeight = Math.max(150, Math.min(600, startHeightRef.current + deltaY));
    setHeight(newHeight);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className="border border-border rounded-lg p-4 flex flex-col"
      style={{ height: `${height}px` }}
    >
      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`w-full h-1 -mt-2 mb-2 cursor-ns-resize group flex items-center justify-center ${
          isDragging ? "bg-accent" : ""
        }`}
      >
        <div className="w-12 h-1 bg-border group-hover:bg-accent rounded-full transition-colors" />
      </div>

      <div className="flex-1 min-h-0">
        <NotesPanel />
      </div>
    </div>
  );
}
