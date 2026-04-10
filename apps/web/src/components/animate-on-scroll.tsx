"use client";

import { useScrollAnimation } from "@eventkit/ui/hooks/use-scroll-animation";
import { cn } from "@eventkit/lib/utils";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  staggerIndex?: number;
}

export function AnimateOnScroll({
  children,
  className,
  staggerIndex,
}: AnimateOnScrollProps) {
  const { ref, isVisible } = useScrollAnimation();

  const staggerClass = staggerIndex
    ? `stagger-${Math.min(staggerIndex, 6)}`
    : undefined;

  return (
    <div
      ref={ref}
      className={cn(
        "scroll-hidden",
        isVisible && "scroll-visible",
        staggerClass,
        className
      )}
    >
      {children}
    </div>
  );
}
