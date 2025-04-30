"use client";

import React from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragMoveEvent,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  Modifiers,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useWidget } from "@/lib/widget-context";

interface DragDropProviderProps {
  children: React.ReactNode;
}

export function DragDropProvider({ children }: DragDropProviderProps) {
  const { widgetState, updatePosition } = useWidget();
  const { position } = widgetState;

  // Configure sensors for drag detection with improved settings
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum drag distance before activation
      },
    })
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event;
    if (delta) {
      const newPosition = {
        x: Math.max(0, Math.min(window.innerWidth - 80, position.x + delta.x)),
        y: Math.max(0, Math.min(window.innerHeight - 80, position.y + delta.y)),
      };
      updatePosition(newPosition);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      {children}
    </DndContext>
  );
}
