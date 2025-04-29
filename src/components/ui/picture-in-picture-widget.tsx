"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { useWidget } from "@/lib/widget-context";
import { Button } from "./button";

interface PictureInPictureWidgetProps {
  children: React.ReactNode;
}

// Helper function to copy stylesheets
const copyStyles = (sourceDoc: Document, targetDoc: Document) => {
  Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
    try {
      if (styleSheet.cssRules) {
        // for <style> elements
        const newStyleEl = sourceDoc.createElement("style");
        Array.from(styleSheet.cssRules).forEach((rule) => {
          newStyleEl.appendChild(sourceDoc.createTextNode(rule.cssText));
        });
        targetDoc.head.appendChild(newStyleEl);
      } else if (styleSheet.href) {
        // for <link> elements
        const newLinkEl = sourceDoc.createElement("link");
        newLinkEl.rel = "stylesheet";
        newLinkEl.href = styleSheet.href;
        targetDoc.head.appendChild(newLinkEl);
      }
    } catch (e) {
      console.warn("Could not copy stylesheet:", styleSheet.href, e);
    }
  });
  // Add basic styling for the PiP window body
  const bodyStyle = targetDoc.createElement("style");
  bodyStyle.textContent = `
     body { margin: 0; padding: 0; background-color: #f0f0f0; }
     #root { padding: 1rem; } /* Add padding to the root container */
   `;
  targetDoc.head.appendChild(bodyStyle);
};

export function PictureInPictureWidget({
  children,
}: PictureInPictureWidgetProps) {
  const [pipSupported, setPipSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { widgetState, setPictureInPicture } = useWidget();
  const { isPictureInPicture } = widgetState;
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const pipRootRef = useRef<HTMLDivElement | null>(null);

  // Check if Document PiP API is supported
  useEffect(() => {
    // @ts-ignore - documentPictureInPicture might not be in default TS types yet
    setPipSupported(!!window.documentPictureInPicture);
  }, []);

  // Function to open the Document PiP window
  const openPipWindow = useCallback(async () => {
    if (!pipSupported) {
      console.error("Document Picture-in-Picture API is not supported.");
      return;
    }
    setIsLoading(true);

    try {
      // Request the PiP window
      // @ts-ignore
      const requestedPipWindow =
        await window.documentPictureInPicture.requestWindow({
          width: 320, // Initial width (adjust as needed)
          height: 480, // Initial height (adjust as needed)
        });

      // Create a root element in the PiP window
      pipRootRef.current = requestedPipWindow.document.createElement("div");
      pipRootRef.current.id = "root";
      requestedPipWindow.document.body.append(pipRootRef.current);

      // Copy styles from the main document to the PiP window
      copyStyles(document, requestedPipWindow.document);

      // Set the PiP window object in state
      setPipWindow(requestedPipWindow);
      setPictureInPicture(true); // Update context

      // Listen for the PiP window closing
      requestedPipWindow.addEventListener(
        "pagehide",
        () => {
          console.log("PiP window closed.");
          setPipWindow(null);
          pipRootRef.current = null;
          setPictureInPicture(false); // Update context
        },
        { once: true }
      );
    } catch (error) {
      console.error(
        "Failed to open Document Picture-in-Picture window:",
        error
      );
      setPictureInPicture(false); // Ensure state is correct on failure
    } finally {
      setIsLoading(false);
    }
  }, [pipSupported, setPictureInPicture]);

  // Close PiP window programmatically if component unmounts or state changes
  useEffect(() => {
    return () => {
      if (pipWindow) {
        console.log(
          "Closing PiP window due to component unmount or state change."
        );
        pipWindow.close(); // Close the window
        setPipWindow(null);
        pipRootRef.current = null;
        // Ensure context is updated if closed programmatically
        if (isPictureInPicture) {
          setPictureInPicture(false);
        }
      }
    };
  }, [pipWindow, isPictureInPicture, setPictureInPicture]);

  // New useEffect to handle sending text selection
  useEffect(() => {
    const handleSelection = () => {
      if (!pipWindow || pipWindow.closed) return; // Only run if PiP window is open

      const selectedText = window.getSelection()?.toString().trim();

      if (selectedText) {
        console.log("Sending selection to PiP:", selectedText);
        // Send message as an object for better structure
        pipWindow.postMessage(
          { type: "text-selection", text: selectedText },
          "*"
        ); // Use '*' for simplicity, or targetOrigin
      }
    };

    // Listen for mouseup in the main document
    document.addEventListener("mouseup", handleSelection);
    // Optional: Listen for selectionchange for more real-time updates (can be noisy)
    document.addEventListener("selectionchange", handleSelection);

    return () => {
      // Cleanup listener
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("selectionchange", handleSelection);
    };
  }, [pipWindow]); // Re-run this effect if pipWindow changes

  return (
    <>
      {/* Button to enable PiP mode */}
      {pipSupported && !isPictureInPicture && (
        <Button
          size="sm"
          variant="outline"
          onClick={openPipWindow}
          disabled={isLoading}
          className="mb-2 w-full"
        >
          {isLoading ? "Opening PiP..." : "Pop Out Widget (PiP)"}
        </Button>
      )}

      {/* Render children in the main window OR portal them to the PiP window */}
      {pipWindow && pipRootRef.current ? (
        // When PiP is active, render children into the PiP window's root div
        ReactDOM.createPortal(children, pipRootRef.current)
      ) : (
        // When PiP is not active, render children normally
        <div className="pip-content-placeholder">{children}</div>
      )}
    </>
  );
}
