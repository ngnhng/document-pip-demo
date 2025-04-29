"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

type Position = {
  x: number;
  y: number;
};

interface WidgetState {
  isMinimized: boolean;
  position: Position;
  isDragging: boolean;
  isPictureInPicture: boolean;
}

interface WidgetContextType {
  widgetState: WidgetState;
  toggleMinimized: () => void;
  updatePosition: (position: Position) => void;
  setIsDragging: (isDragging: boolean) => void;
  setPictureInPicture: (isPip: boolean) => void;
}

// Safe default position that doesn't rely on window
const defaultWidgetState: WidgetState = {
  isMinimized: false,
  position: { x: 20, y: 600 },
  isDragging: false,
  isPictureInPicture: false,
};

const STORAGE_KEY = "widgetState";

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export const WidgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [widgetState, setWidgetState] =
    useState<WidgetState>(defaultWidgetState);
  const [initialized, setInitialized] = useState(false);

  // Initialize state with window values and load from localStorage on client
  useEffect(() => {
    // Set initial position based on window size (only in browser)
    if (!initialized) {
      const defaultY = window.innerHeight ? window.innerHeight - 100 : 600;
      setWidgetState((prev) => ({
        ...prev,
        position: { ...prev.position, y: defaultY },
      }));

      // Try to load saved state
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          setWidgetState(parsedState);
        } catch (error) {
          console.error("Failed to parse widget state", error);
        }
      }

      setInitialized(true);
    }
  }, [initialized]);

  // Save widget state to localStorage whenever it changes (after initialization)
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgetState));
    }
  }, [widgetState, initialized]);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const newState = JSON.parse(event.newValue);
          // Only update if not currently dragging to avoid conflicts
          if (!widgetState.isDragging) {
            setWidgetState((prevState) => ({
              ...newState,
              isDragging: prevState.isDragging, // Preserve local dragging state
              isPictureInPicture: prevState.isPictureInPicture, // Preserve PiP state
            }));
          }
        } catch (error) {
          console.error(
            "Failed to parse widget state from storage event",
            error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [widgetState.isDragging, widgetState.isPictureInPicture]);

  const toggleMinimized = () => {
    setWidgetState((prev) => ({
      ...prev,
      isMinimized: !prev.isMinimized,
    }));
  };

  const updatePosition = (position: Position) => {
    setWidgetState((prev) => ({
      ...prev,
      position,
    }));
  };

  const setIsDragging = (isDragging: boolean) => {
    setWidgetState((prev) => ({
      ...prev,
      isDragging,
    }));
  };

  const setPictureInPicture = (isPip: boolean) => {
    setWidgetState((prev) => ({
      ...prev,
      isPictureInPicture: isPip,
    }));
  };

  return (
    <WidgetContext.Provider
      value={{
        widgetState,
        toggleMinimized,
        updatePosition,
        setIsDragging,
        setPictureInPicture,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidget = (): WidgetContextType => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
