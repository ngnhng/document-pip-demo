import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="max-w-2xl text-center text-lg text-muted-foreground">
          This is a demonstration of the persistent minimizable widget that maintains its state
          across different pages. Try minimizing the widget and navigating between pages.
          The widget will maintain its state and position.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/"
            className="rounded-md border border-solid px-4 py-2 hover:bg-accent transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Notice how the widget stays in the same position and state as you navigate.
        </p>
      </footer>
    </div>
  );
}