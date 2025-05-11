"use client";

import React from "react";
import { SixteenSegmentChar } from "./sixteen-segment-char";
import { cn } from "@/lib/utils";

// Helper to convert string of 0s and 1s to boolean array
const s = (str: string): boolean[] => str.split("").map((bit) => bit === "1");

// Character map defining which segments to light for each character
// Order: TLH, TRH, MLH, MRH, BLH, BRH, TLV, BLV, TRV, BRV, TCV, BCV, D_TL_C, D_TR_C, D_BL_C, D_BR_C
//         0    1    2    3    4    5    6    7    8    9    10   11    12      13      14      15
export const CHARACTER_MAP: Record<string, boolean[]> = {
  // Uppercase letters - Updated based on document's reference
  A: s("1111001111100000"),
  B: s("0101110011110010"),
  C: s("1100111000000000"),
  D: s("0100110011110000"),
  E: s("1110111000000000"),
  F: s("1110001000000000"),
  G: s("1101111001000000"),
  H: s("0011001111000000"),
  I: s("1100110000110000"),
  J: s("0100110001000000"),
  K: s("0010001000100011"),
  L: s("0000111000000000"),
  M: s("0000001111001100"),
  N: s("0000001111001001"),
  O: s("1100111111000000"),
  P: s("1111001010000000"),
  Q: s("1100111111000001"),
  R: s("1111001010000001"),
  S: s("1010110101000000"),
  T: s("1100000000110000"),
  U: s("0000111111000000"),
  V: s("0000001001000110"),
  W: s("0000001111000011"),
  X: s("0000000000001111"),
  Y: s("0000000000101100"),
  Z: s("1100110000000110"),

  // Lowercase letters (same as uppercase for simplicity)
  a: s("1111001111100000"),
  b: s("0000110111100000"),
  c: s("0010110100000000"),
  d: s("0010010111100000"),
  e: s("1110111000000000"),
  f: s("1110001000000000"),
  g: s("1111010011000000"),
  h: s("0010001111000000"),
  i: s("0000000000100000"),
  j: s("0000110001000000"),
  k: s("0010001000100011"),
  l: s("0000110000100000"),
  m: s("0010001111001100"),
  n: s("0010000111000000"),
  o: s("0010110111000000"),
  p: s("1110001100000000"),
  q: s("1111000011000000"),
  r: s("0010000100000000"),
  s: s("1010110101000000"),
  t: s("0000111000100000"),
  u: s("0000110111000000"),
  v: s("0000000000000110"),
  w: s("0000001111000011"),
  x: s("0000000000001111"),
  y: s("0001000011101000"),
  z: s("1100110000000110"),

  // Numbers - Updated to better match standard display
  "0": s("1100111111000000"),
  "1": s("0000000011000000"),
  "2": s("1101101001000100"),
  "3": s("1100110011000000"),
  "4": s("0010001011000000"),
  "5": s("1010110101000000"),
  "6": s("1010111111000000"),
  "7": s("1100000011000000"),
  "8": s("1110111111000000"),
  "9": s("1110110011000000"),

  // Special characters - Extended character set based on document
  " ": s("0000000000000000"),
  "-": s("0010100000000000"),
  _: s("0000110000000000"),
  "+": s("0010100000110000"),
  "/": s("0000000000000110"),
  "\\": s("0000000000001001"),
  ".": s("0000000000000000"), // Use showDecimalPoint instead
  ",": s("0000000000000010"),
  ":": s("0000000000110000"),
  ";": s("0000000000100010"),
  "?": s("1100001000100100"),
  "!": s("0000000000110000"),
  "@": s("1111101111000000"),
  "#": s("0010100001110000"),
  $: s("1110110101110000"),
  "%": s("0000000000001111"),
  "&": s("1000111000001011"),
  "*": s("0010100000001111"),
  "(": s("0000000000001100"),
  ")": s("0000000000000011"),
  "[": s("1100111000000000"),
  "]": s("1100110001000000"),
  "{": s("1100111000100000"),
  "}": s("1100110001001000"),
  "<": s("0000000000001100"),
  ">": s("0000000000000011"),
  "=": s("0010110000000000"),
  "'": s("0000000000100000"),
  '"': s("0000000011000000"),
  "|": s("0000000000110000"),
  "~": s("0000000000000000"), // No good representation
  "`": s("0000000001000000"),
  "^": s("0100000000000000"),
};

// Fallback for unknown characters
const FALLBACK_CHAR_SEGMENTS = CHARACTER_MAP["?"] || Array(16).fill(false);

export interface SixteenSegmentTextProps {
  text: string;
  charWidth?: number;
  charHeight?: number;
  litColor?: string;
  unlitColor?: string;
  backgroundColor?: string;
  kerning?: number; // Space between characters
  unknownChar?: string; // Character to display for unknown characters
  className?: string;
  showUnlit?: boolean; // Whether to show unlit segments
  showDecimalPoints?: boolean | boolean[]; // Show decimal points after each character or specified characters
}

export function SixteenSegmentText({
  text,
  charWidth = 28, // Default to smaller size
  charHeight = 44,
  litColor = "#ff4500", // orangered
  unlitColor = "#331000", // dark orange/brown
  backgroundColor,
  kerning = 4,
  unknownChar = "?",
  className,
  showUnlit = true,
  showDecimalPoints = false,
}: SixteenSegmentTextProps) {
  const chars = text.split("");

  // If showDecimalPoints is a boolean, convert to array matching text length
  const decimalPoints = Array.isArray(showDecimalPoints)
    ? showDecimalPoints
    : showDecimalPoints
    ? chars.map(() => true)
    : chars.map(() => false);

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md",
        backgroundColor && "p-2",
        className
      )}
      style={{
        backgroundColor,
        gap: `${kerning}px`,
      }}
    >
      {chars.map((char, index) => {
        const segments =
          CHARACTER_MAP[char] ||
          CHARACTER_MAP[unknownChar] ||
          FALLBACK_CHAR_SEGMENTS;

        // Display decimal point if it's a period or if specified in the decimalPoints array
        const showDecimalPoint =
          char === "." ||
          (decimalPoints.length > index && decimalPoints[index]);

        // If it's a period, don't render the character itself, just the decimal point
        if (char === ".") {
          return (
            <div
              key={`dot-${index}`}
              style={{ width: charWidth / 3, display: "inline-block" }}
            >
              <SixteenSegmentChar
                segments={Array(16).fill(false)}
                width={charWidth / 3}
                height={charHeight}
                litColor={litColor}
                unlitColor="transparent"
                showDecimalPoint={true}
              />
            </div>
          );
        }

        // If showUnlit is false, pass transparent as unlitColor
        const displayUnlitColor = showUnlit ? unlitColor : "transparent";

        return (
          <SixteenSegmentChar
            key={`${char}-${index}`}
            segments={segments}
            width={charWidth}
            height={charHeight}
            litColor={litColor}
            unlitColor={displayUnlitColor}
            showDecimalPoint={showDecimalPoint && char !== "."}
          />
        );
      })}
    </div>
  );
}
