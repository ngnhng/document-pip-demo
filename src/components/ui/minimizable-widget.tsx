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
  const { widgetState, toggleMinimized } = useWidget();
  const { isMinimized, position } = widgetState;

  // Client-side only component to avoid hydration issues
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: "widget-draggable",
    data: {
      type: "widget",
    },
  });

  if (!mounted) return null;

  // Apply transform directly from useDraggable when dragging
  // The final position is set by left/top, updated onDragEnd in the provider
  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    left: `${position.x}px`,
    top: `${position.y}px`,
    // Hint browser for optimization during drag
    willChange: isDragging ? 'transform' : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "fixed z-50 shadow-lg",
        // Apply transition only when not dragging
        !isDragging && "transition-all duration-200 ease-in-out",
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
                // Assuming the close button should also minimize for now
                // TODO: Implement actual close functionality if needed
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
