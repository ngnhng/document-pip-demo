"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { useWidget } from "@/lib/widget-context";

// Define a type for project ideas
interface ProjectIdea {
  id: string;
  text: string;
  timestamp: number;
  projectId?: string; // Optional associated project
  source?: string; // Optional source description
}

// Key for localStorage
const PROJECT_IDEAS_STORAGE_KEY = "projectIdeas";

// Placeholder for summarization logic
async function summarizeText(text: string): Promise<string> {
  console.log("Summarizing:", text);
  await new Promise((resolve) => setTimeout(resolve, 100));
  return `Summary for: "${text.substring(0, 30)}${
    text.length > 30 ? "..." : ""
  }"`;
}

export function WidgetContent() {
  const [selectedText, setSelectedText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]);
  const [newIdeaText, setNewIdeaText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("insights");
  const [currentProjectId, setCurrentProjectId] = useState<string | undefined>(
    undefined
  );
  const { widgetState, setPictureInPicture } = useWidget();
  const { isPictureInPicture } = widgetState;
  // Add state for current time
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  // Add state to track hover on the PiP close button area
  const [isCloseButtonHovered, setIsCloseButtonHovered] =
    useState<boolean>(false);

  // Load ideas from localStorage on mount
  useEffect(() => {
    const storedIdeas = localStorage.getItem(PROJECT_IDEAS_STORAGE_KEY);
    if (storedIdeas) {
      try {
        setProjectIdeas(JSON.parse(storedIdeas));
      } catch (error) {
        console.error(
          "Failed to parse project ideas from localStorage:",
          error
        );
        setProjectIdeas([]);
      }
    }
  }, []);

  // Save ideas to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        PROJECT_IDEAS_STORAGE_KEY,
        JSON.stringify(projectIdeas)
      );
    }
  }, [projectIdeas]);

  // Listen for messages from parent window about current project
  useEffect(() => {
    const handleProjectSelection = (event: MessageEvent) => {
      if (event.data && event.data.type === "current-project-changed") {
        setCurrentProjectId(event.data.projectId);
      }
    };

    window.addEventListener("message", handleProjectSelection);
    return () => window.removeEventListener("message", handleProjectSelection);
  }, []);

  // Handle messages (e.g., from PiP text selection)
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      console.log("Received message:", event.data);

      if (event.data && event.data.type === "text-selection") {
        const newText = event.data.text;
        console.log("PiP received text:", newText);
        setSelectedText(newText);
        setSummary("");
        setIsSummarizing(true);
        try {
          const result = await summarizeText(newText);
          setSummary(result);
        } catch (error) {
          console.error("Summarization failed:", error);
          setSummary("Error summarizing text.");
        } finally {
          setIsSummarizing(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Add timer effect to update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddIdea = (text?: string) => {
    const ideaText = text || newIdeaText;
    if (ideaText.trim() === "") return;

    const newIdea: ProjectIdea = {
      id: crypto.randomUUID(),
      text: ideaText.trim(),
      timestamp: Date.now(),
      projectId: currentProjectId, // Associate with current project if available
    };

    setProjectIdeas((prevIdeas) => [...prevIdeas, newIdea]);
    setNewIdeaText("");
  };

  const handleDeleteIdea = (idToDelete: string) => {
    setProjectIdeas((prevIdeas) =>
      prevIdeas.filter((idea) => idea.id !== idToDelete)
    );
  };

  const saveSelectionAsIdea = () => {
    if (selectedText) {
      handleAddIdea(selectedText);
      setActiveTab("ideas"); // Switch to ideas tab after saving
    }
  };

  // Filter ideas by project or show all if no project is selected
  const filteredIdeas = projectIdeas.filter(
    (idea) =>
      !currentProjectId ||
      !idea.projectId ||
      idea.projectId === currentProjectId
  );

  // Format date for display
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const togglePictureInPicture = () => {
    // Toggle PiP mode off when button is clicked in PiP mode
    if (isPictureInPicture) {
      // This will close the PiP window through the effect in PictureInPictureWidget
      setPictureInPicture(false);
    }
  };

  return (
    <div className="w-full">
      {/* PiP Exit Button - Only show when in PiP mode and hovered, uses no space when not hovered */}
      {isPictureInPicture && (
        <div
          className="relative w-full"
          onMouseEnter={() => setIsCloseButtonHovered(true)}
          onMouseLeave={() => setIsCloseButtonHovered(false)}
          style={{
            height: isCloseButtonHovered ? "1.5rem" : 0,
            marginBottom: isCloseButtonHovered ? "0.5rem" : 0,
            transition: "height 0.2s, margin-bottom 0.2s",
          }}
        >
          <Button
            size="sm"
            variant="ghost"
            onClick={togglePictureInPicture}
            className={`w-full absolute top-0 left-0 transition-opacity duration-200 ${
              isCloseButtonHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            Close PiP Window
          </Button>
        </div>
      )}

      <Tabs
        defaultValue="insights"
        className="w-full p-1"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights" className="text-xs">
            Insights
          </TabsTrigger>
          <TabsTrigger value="ideas" className="text-xs">
            Project Ideas
          </TabsTrigger>
          <TabsTrigger value="clock" className="text-xs">
            Clock
          </TabsTrigger>
        </TabsList>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-3 pt-3">
          {selectedText && (
            <div className="p-2 border rounded bg-secondary/50 text-xs">
              <p className="font-medium text-muted-foreground">Received:</p>
              <p className="italic">"{selectedText}"</p>

              {/* Add button to save selection as project idea */}
              <div className="mt-2 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={saveSelectionAsIdea}
                >
                  Save as Project Idea
                </Button>
              </div>
            </div>
          )}
          {isSummarizing && (
            <p className="text-xs text-muted-foreground">Summarizing...</p>
          )}
          {summary && (
            <div className="p-2 border rounded bg-primary/10 text-xs">
              <p className="font-medium text-muted-foreground">Summary:</p>
              <p>{summary}</p>
            </div>
          )}

          {!selectedText && !summary && !isSummarizing && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              Select text on the main page to see insights here.
            </p>
          )}
        </TabsContent>

        {/* Project Ideas Tab */}
        <TabsContent value="ideas" className="space-y-3 pt-3">
          {/* Project context indicator */}
          {currentProjectId && (
            <div className="p-1.5 bg-muted rounded-sm text-xs text-center mb-2">
              Ideas for current project
            </div>
          )}

          <div className="flex w-full items-center space-x-1.5">
            <Input
              type="text"
              placeholder="Add a new project idea..."
              value={newIdeaText}
              onChange={(e) => setNewIdeaText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddIdea()}
              className="h-8 text-xs"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => handleAddIdea()}
              className="h-8 px-2.5"
            >
              Add
            </Button>
          </div>

          {filteredIdeas.length > 0 ? (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredIdeas
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((idea) => (
                  <div
                    key={idea.id}
                    className="flex flex-col p-1.5 border rounded bg-background text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex-grow pr-1">{idea.text}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 flex-shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteIdea(idea.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1 flex justify-between">
                      <span>{formatDate(idea.timestamp)}</span>
                      {idea.projectId && (
                        <span className="italic">Project note</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center pt-3">
              {currentProjectId
                ? "No project ideas saved for this project yet."
                : "No project ideas saved yet."}
            </p>
          )}
        </TabsContent>

        {/* Clock Tab */}
        <TabsContent value="clock" className="space-y-3 pt-3">
          <div className="text-center text-xl font-bold">
            {currentTime.toLocaleTimeString()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
