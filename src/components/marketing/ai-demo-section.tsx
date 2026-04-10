"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnimateOnScroll } from "./animate-on-scroll";
import { DemoResultContent } from "./demo-result-content";

const PLACEHOLDER =
  "A two-day technology conference in Toronto focused on AI and startups. We expect 1,200 attendees, with keynotes, workshops, and networking events. The venue is the Metro Toronto Convention Centre.";

export function AiDemoSection() {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleGenerate = useCallback(() => {
    if (isGenerating) return;

    setIsGenerating(true);
    setShowResult(true);
    setVisibleLines(0);

    const totalLines = 7;
    let current = 0;

    const reveal = () => {
      current += 1;
      setVisibleLines(current);
      if (current < totalLines) {
        timerRef.current = setTimeout(reveal, 350);
      } else {
        setIsGenerating(false);
      }
    };

    timerRef.current = setTimeout(reveal, 600);
  }, [isGenerating]);

  return (
    <section id="demo" className="bg-zinc-50 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <AnimateOnScroll className="text-center">
          <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Live Demo
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            See AI generation in action
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-500">
            Type a description of your event and watch as EventKit
            generates a complete event website in seconds.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll className="mt-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <DemoInput
              description={description}
              onDescriptionChange={setDescription}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
            <DemoOutput
              showResult={showResult}
              visibleLines={visibleLines}
              isGenerating={isGenerating}
            />
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

function DemoInput({
  description,
  onDescriptionChange,
  onGenerate,
  isGenerating,
}: {
  description: string;
  onDescriptionChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm font-medium text-zinc-700">
        Describe your event
      </label>
      <Textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder={PLACEHOLDER}
        className="min-h-[180px] resize-none text-base"
      />
      <Button
        onClick={onGenerate}
        disabled={isGenerating}
        className="h-11 rounded-xl bg-indigo-600 text-base font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {isGenerating ? "Generating..." : "Generate Website"}
      </Button>
    </div>
  );
}

function DemoOutput({
  showResult,
  visibleLines,
  isGenerating,
}: {
  showResult: boolean;
  visibleLines: number;
  isGenerating: boolean;
}) {
  if (!showResult) {
    return (
      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-white p-12">
        <p className="text-center text-zinc-400">
          Your generated website preview will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
      <DemoResultContent
        visibleLines={visibleLines}
        isGenerating={isGenerating}
      />
    </div>
  );
}
