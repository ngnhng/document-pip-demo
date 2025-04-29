import React, { useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { useWidget } from "@/lib/widget-context";
import { cn } from "@/lib/utils";

interface MinimizableWidgetProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function MinimizableWidget({
  title = "Widget",
  children,
  className,
}: MinimizableWidgetProps) {
  const { widgetState, toggleMinimized, updatePosition, setIsDragging } =
    useWidget();
  const { isMinimized, position, isDragging } = widgetState;

  // Client-side only component to avoid hydration issues
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "widget-draggable",
    data: {
      type: "widget",
    },
  });

  useEffect(() => {
    const handleDragStart = () => setIsDragging(true);
    const handleDragEnd = () => setIsDragging(false);
    window.addEventListener("mousedown", handleDragStart);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchstart", handleDragStart);
    window.addEventListener("touchend", handleDragEnd);

    return () => {
      window.removeEventListener("mousedown", handleDragStart);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchstart", handleDragStart);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, []);

  if (!mounted) return null;

  // Apply transform during dragging without updating position state
  const style = {
    transform:
      isDragging && transform ? CSS.Translate.toString(transform) : undefined,
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "fixed z-50 transition-all duration-200 ease-in-out shadow-lg",
        isMinimized
          ? "w-12 h-12 rounded-full bg-primary text-primary-foreground"
          : "w-80 bg-card text-card-foreground border rounded-lg",
        className
      )}
      aria-label={isMinimized ? "Minimized widget, click to expand" : "Widget"}
    >
      {isMinimized ? (
        <button
          onClick={toggleMinimized}
          className="w-full h-full flex items-center justify-center rounded-full cursor-pointer"
          aria-label="Expand widget"
        >
          <Maximize2 size={18} />
        </button>
      ) : (
        <>
          <div
            {...attributes}
            {...listeners}
            className="flex items-center justify-between border-b p-3 cursor-move"
            aria-label="Widget header - drag to move"
          >
            <h3 className="font-medium text-sm">{title}</h3>
            <div className="flex gap-1">
              <button
                onClick={toggleMinimized}
                className="p-1 rounded-sm hover:bg-accent"
                aria-label="Minimize widget"
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={toggleMinimized}
                className="p-1 rounded-sm hover:bg-accent"
                aria-label="Close widget"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="p-4">{children}</div>
        </>
      )}
    </div>
  );
}
