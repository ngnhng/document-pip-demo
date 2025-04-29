"use client";

import React from "react";
import { WidgetProvider } from "@/lib/widget-context";
import { DragDropProvider } from "@/components/ui/drag-drop-provider";
import { MinimizableWidget } from "@/components/ui/minimizable-widget";
import { PictureInPictureWidget } from "@/components/ui/picture-in-picture-widget";
import { WidgetContent } from "@/components/widget-content";

export function WidgetClientWrapper() {
  return (
    <WidgetProvider>
      <DragDropProvider>
        <MinimizableWidget title="Quick Actions">
          <PictureInPictureWidget>
            <WidgetContent />
          </PictureInPictureWidget>
        </MinimizableWidget>
      </DragDropProvider>
    </WidgetProvider>
  );
}
