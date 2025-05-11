"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SixteenSegmentCharProps {
  segments: boolean[]; // Array of 16 booleans indicating which segments are lit
  width?: number;
  height?: number;
  litColor?: string;
  unlitColor?: string;
  strokeWidth?: number;
  className?: string;
  showDecimalPoint?: boolean; // Optional decimal point
}

// Defines the coordinate system for the sixteen segments
// ViewBox dimensions are 56x88
export const SixteenSegmentChar: React.FC<SixteenSegmentCharProps> = ({
  segments,
  width = 56, // Default width
  height = 88, // Default height
  litColor = "#ff4500", // Default lit color (orangered)
  unlitColor = "#331000", // Default unlit color (dark orange/brown)
  strokeWidth = 0, // If using filled paths, stroke might not be needed
  className,
  showDecimalPoint = false,
}) => {
  const viewBox = "0 0 56 88"; // Defines the coordinate system

  // Path definitions for the 16 segments - refined to match the document's guidance
  // The segments are ordered logically based on standard 16-segment display layout:
  // 0-5: Horizontal segments (top-left, top-right, middle-left, middle-right, bottom-left, bottom-right)
  // 6-11: Vertical segments (top-left, bottom-left, top-right, bottom-right, top-center, bottom-center)
  // 12-15: Diagonal segments (connecting corners to center)
  const segmentPaths = [
    // 0: Top-Left Horizontal
    "M4,4 L23,4 L27,0 L23,-4 L4,-4 L0,0 Z",
    // 1: Top-Right Horizontal
    "M33,4 L52,4 L56,0 L52,-4 L33,-4 L29,0 Z",
    // 2: Middle-Left Horizontal
    "M4,44 L23,44 L27,40 L23,36 L4,36 L0,40 Z",
    // 3: Middle-Right Horizontal
    "M33,44 L52,44 L56,40 L52,36 L33,36 L29,40 Z",
    // 4: Bottom-Left Horizontal
    "M4,84 L23,84 L27,80 L23,76 L4,76 L0,80 Z",
    // 5: Bottom-Right Horizontal
    "M33,84 L52,84 L56,80 L52,76 L33,76 L29,80 Z",

    // 6: Top-Left Vertical
    "M4,8 L4,36 L0,40 L-4,36 L-4,8 L0,4 Z",
    // 7: Bottom-Left Vertical
    "M4,52 L4,80 L0,84 L-4,80 L-4,52 L0,48 Z",
    // 8: Top-Right Vertical
    "M52,8 L52,36 L48,40 L44,36 L44,8 L48,4 Z",
    // 9: Bottom-Right Vertical
    "M52,52 L52,80 L48,84 L44,80 L44,52 L48,48 Z",
    // 10: Top-Center Vertical
    "M28,8 L28,36 L24,40 L20,36 L20,8 L24,4 Z",
    // 11: Bottom-Center Vertical
    "M28,52 L28,80 L24,84 L20,80 L20,52 L24,48 Z",

    // 12: Diagonal: Top-Left to Center
    "M8,8 L24,36 L20,36 L4,8 Z",
    // 13: Diagonal: Top-Right to Center
    "M48,8 L32,36 L36,36 L52,8 Z",
    // 14: Diagonal: Bottom-Left to Center
    "M8,80 L24,52 L20,52 L4,80 Z",
    // 15: Diagonal: Bottom-Right to Center
    "M48,80 L32,52 L36,52 L52,80 Z",
  ];

  // Decimal point path
  const decimalPointPath =
    "M58,84 C58,80.5 61,80.5 61,84 C61,87.5 58,87.5 58,84 Z";

  // Transforms to position each segment correctly in the viewbox
  const segmentTransforms = [
    "translate(0, 4)", // 0: Top-Left H
    "translate(0, 4)", // 1: Top-Right H
    "translate(0, 0)", // 2: Middle-Left H
    "translate(0, 0)", // 3: Middle-Right H
    "translate(0, 4)", // 4: Bottom-Left H
    "translate(0, 4)", // 5: Bottom-Right H

    "translate(4, 0)", // 6: Top-Left V
    "translate(4, 0)", // 7: Bottom-Left V
    "translate(0, 0)", // 8: Top-Right V
    "translate(0, 0)", // 9: Bottom-Right V

    "translate(0, 0)", // 10: Top-Center V
    "translate(0, 0)", // 11: Bottom-Center V

    "translate(0, 0)", // 12: Diag TL
    "translate(0, 0)", // 13: Diag TR
    "translate(0, 0)", // 14: Diag BL
    "translate(0, 0)", // 15: Diag BR
  ];

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
      style={{ display: "inline-block", margin: "0 2px" }}
    >
      {/* Render all segments based on the segments array */}
      {segmentPaths.map((pathData, index) => (
        <path
          key={index}
          d={pathData}
          fill={segments[index] ? litColor : unlitColor}
          transform={segmentTransforms[index]}
          stroke={
            strokeWidth > 0 ? (segments[index] ? litColor : unlitColor) : "none"
          }
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* Render decimal point if needed */}
      {showDecimalPoint && (
        <path
          d={decimalPointPath}
          fill={litColor}
          stroke={strokeWidth > 0 ? litColor : "none"}
          strokeWidth={strokeWidth}
        />
      )}
    </svg>
  );
};
