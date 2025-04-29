"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Placeholder for your summarization logic
async function summarizeText(text: string): Promise<string> {
  console.log("Summarizing:", text);
  // Replace with actual API call or local processing
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async work
  return `Summary for: "${text.substring(0, 30)}${
    text.length > 30 ? "..." : ""
  }"`;
}

export function WidgetContent() {
  const [selectedText, setSelectedText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Optional: Add origin check for security
      // if (event.origin !== window.location.origin) return;
      console.log("Received message:", event.data);

      if (event.data && event.data.type === "text-selection") {
        const newText = event.data.text;
        console.log("PiP received text:", newText);
        setSelectedText(newText);
        setSummary(""); // Clear previous summary
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

    // Add listener when component mounts (in PiP window context)
    window.addEventListener("message", handleMessage);

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="space-y-4">
      {/* Display received text and summary */}
      {selectedText && (
        <div className="p-3 border rounded bg-secondary/50">
          <p className="text-xs font-medium text-muted-foreground">Received:</p>
          <p className="text-sm italic">"{selectedText}"</p>
        </div>
      )}
      {isSummarizing && (
        <p className="text-sm text-muted-foreground">Summarizing...</p>
      )}
      {summary && (
        <div className="p-3 border rounded bg-primary/10">
          <p className="text-xs font-medium text-muted-foreground">Summary:</p>
          <p className="text-sm">{summary}</p>
        </div>
      )}

      {/* Keep original widget content if needed */}
      {!selectedText && !summary && !isSummarizing && (
        <>
          <p className="text-sm text-muted-foreground">
            Select text on the main page to see insights here.
          </p>
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="default" className="w-full">
              Dashboard
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              Settings
            </Button>
            <Button size="sm" variant="secondary" className="w-full">
              Help Center
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
