"use client";

import React from "react";
import { SixteenSegmentText } from "@/components/ui/sixteen-segment-text";
import Link from "next/link";

export default function SixteenSegmentPage() {
  return (
    <div className="container mx-auto p-8 grid grid-rows-[auto_1fr_auto] min-h-screen gap-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">Sixteen Segment Display</h1>
        <p className="text-muted-foreground">
          A retro-style sixteen-segment display component
        </p>
      </header>

      <main className="space-y-12">
        {/* Basic example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Basic Example</h2>
          <div className="p-6 bg-card border rounded-lg shadow-sm flex flex-col items-center gap-4">
            <SixteenSegmentText
              text="HELLO WORLD"
              backgroundColor="#000"
              charWidth={30}
              charHeight={47}
            />
          </div>
        </section>

        {/* Different colors */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Color Variants</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 bg-card border rounded-lg shadow-sm flex flex-col items-center gap-4">
              <h3 className="text-lg font-medium">Green (LCD)</h3>
              <SixteenSegmentText
                text="GREEN"
                litColor="#00ff00"
                unlitColor="#003300"
                backgroundColor="#111"
                charWidth={30}
                charHeight={47}
              />
            </div>
            <div className="p-6 bg-card border rounded-lg shadow-sm flex flex-col items-center gap-4">
              <h3 className="text-lg font-medium">Blue (VFD)</h3>
              <SixteenSegmentText
                text="BLUE"
                litColor="#00ffff"
                unlitColor="#003333"
                backgroundColor="#112"
                charWidth={30}
                charHeight={47}
              />
            </div>
            <div className="p-6 bg-card border rounded-lg shadow-sm flex flex-col items-center gap-4">
              <h3 className="text-lg font-medium">Red (LED)</h3>
              <SixteenSegmentText
                text="RED"
                litColor="#ff0000"
                unlitColor="#330000"
                backgroundColor="#111"
                charWidth={30}
                charHeight={47}
              />
            </div>
            <div className="p-6 bg-card border rounded-lg shadow-sm flex flex-col items-center gap-4">
              <h3 className="text-lg font-medium">Amber (Vintage LED)</h3>
              <SixteenSegmentText
                text="AMBER"
                litColor="#ffbf00"
                unlitColor="#332200"
                backgroundColor="#111"
                charWidth={30}
                charHeight={47}
              />
            </div>
          </div>
        </section>

        {/* Character showcase */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Character Showcase</h2>
          <div className="p-6 bg-card border rounded-lg shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Numbers</h3>
              <SixteenSegmentText
                text="0123456789"
                litColor="#ff4500"
                backgroundColor="#111"
                charWidth={24}
                charHeight={38}
                kerning={6}
              />
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Uppercase Letters</h3>
              <SixteenSegmentText
                text="ABCDEFGHIJKLM"
                litColor="#ff4500"
                backgroundColor="#111"
                charWidth={24}
                charHeight={38}
                kerning={6}
              />
              <div className="mt-4">
                <SixteenSegmentText
                  text="NOPQRSTUVWXYZ"
                  litColor="#ff4500"
                  backgroundColor="#111"
                  charWidth={24}
                  charHeight={38}
                  kerning={6}
                />
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Lowercase Letters</h3>
              <SixteenSegmentText
                text="abcdefghijklm"
                litColor="#ff4500"
                backgroundColor="#111"
                charWidth={24}
                charHeight={38}
                kerning={6}
              />
              <div className="mt-4">
                <SixteenSegmentText
                  text="nopqrstuvwxyz"
                  litColor="#ff4500"
                  backgroundColor="#111"
                  charWidth={24}
                  charHeight={38}
                  kerning={6}
                />
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Special Characters</h3>
              <SixteenSegmentText
                text="!@#$%^&*()_+-=[]{}|;:,./<>?"
                litColor="#ff4500"
                backgroundColor="#111"
                charWidth={24}
                charHeight={38}
                kerning={6}
              />
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Decimal Points</h3>
              <SixteenSegmentText
                text="3.14159"
                litColor="#00ff00"
                unlitColor="#003300"
                backgroundColor="#111"
                charWidth={24}
                charHeight={38}
                kerning={3}
              />
              <div className="mt-4">
                <SixteenSegmentText
                  text="PRICE: $29.99"
                  litColor="#00ffff"
                  unlitColor="#003333"
                  backgroundColor="#111"
                  charWidth={24}
                  charHeight={38}
                  kerning={3}
                />
              </div>
              <div className="mt-4">
                <SixteenSegmentText
                  text="TIME: 12:30"
                  litColor="#ffbf00"
                  unlitColor="#332200"
                  backgroundColor="#111"
                  charWidth={24}
                  charHeight={38}
                  kerning={3}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Try It Yourself</h2>
          <div className="p-6 bg-card border rounded-lg shadow-sm">
            <InteractiveDemo />
          </div>
        </section>
      </main>

      <footer className="text-center">
        <Link
          href="/"
          className="inline-flex rounded-md border border-solid border-black/[.08] dark:border-white/[.145] transition-colors items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-9 px-4"
        >
          Back to Home
        </Link>
      </footer>
    </div>
  );
}

function InteractiveDemo() {
  const [text, setText] = React.useState("TYPE HERE");
  const [litColor, setLitColor] = React.useState("#ff4500");
  const [showUnlit, setShowUnlit] = React.useState(true);
  const [size, setSize] = React.useState(30);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-black rounded-lg flex justify-center">
        <SixteenSegmentText
          text={text || " "}
          litColor={litColor}
          backgroundColor="#000"
          charWidth={size}
          charHeight={size * 1.57}
          showUnlit={showUnlit}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border rounded-md bg-background"
            maxLength={20}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Color</label>
          <div className="flex gap-4">
            <button
              onClick={() => setLitColor("#ff4500")}
              className="px-3 py-2 border rounded-md bg-[#ff4500] text-white"
            >
              Orange
            </button>
            <button
              onClick={() => setLitColor("#00ff00")}
              className="px-3 py-2 border rounded-md bg-[#00ff00] text-black"
            >
              Green
            </button>
            <button
              onClick={() => setLitColor("#00ffff")}
              className="px-3 py-2 border rounded-md bg-[#00ffff] text-black"
            >
              Blue
            </button>
            <button
              onClick={() => setLitColor("#ff0000")}
              className="px-3 py-2 border rounded-md bg-[#ff0000] text-white"
            >
              Red
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <input
            type="range"
            min={15}
            max={50}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Display</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showUnlit}
              onChange={(e) => setShowUnlit(e.target.checked)}
              className="rounded"
            />
            Show unlit segments
          </label>
        </div>
      </div>
    </div>
  );
}
