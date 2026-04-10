"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { WebsiteSection } from "@/types";

const SECTION_IDS: Record<WebsiteSection["type"], string> = {
  hero: "hero",
  about: "about",
  schedule: "schedule",
  speakers: "speakers",
  location: "location",
  faq: "faq",
};

const SECTION_LABELS: Record<WebsiteSection["type"], string> = {
  hero: "Home",
  about: "About",
  schedule: "Schedule",
  speakers: "Speakers",
  location: "Location",
  faq: "FAQ",
};

interface EventNavProps {
  eventName: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  sections: WebsiteSection[];
}

export function EventNav({
  eventName,
  slug,
  primaryColor,
  secondaryColor,
  sections,
}: EventNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navSections = sections.filter((s) => s.type !== "hero");

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? `${primaryColor}f5` : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : undefined,
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span
          className="text-sm font-semibold tracking-tight"
          style={{ color: scrolled ? "#ffffff" : primaryColor }}
        >
          {eventName}
        </span>
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-5 md:flex">
            {navSections.map((section) => (
              <a
                key={section.type}
                href={`#${SECTION_IDS[section.type]}`}
                className="text-xs font-medium transition-opacity hover:opacity-80"
                style={{ color: scrolled ? "#ffffffcc" : `${primaryColor}99` }}
              >
                {SECTION_LABELS[section.type]}
              </a>
            ))}
          </div>
          <Link
            href={`/${slug}/register`}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: secondaryColor }}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
