"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { WebsitePages } from "@eventkit/types";

interface EventNavProps {
  eventName: string;
  slug: string;
  pages: WebsitePages["pages"];
  primaryColor: string;
  accentColor: string;
  ctaText?: string;
}

export function EventNav({
  eventName,
  slug,
  pages,
  primaryColor,
  ctaText,
}: EventNavProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks: { href: string; label: string }[] = [
    { href: `/${slug}`, label: "Home" },
  ];
  if (pages.schedule.visible) {
    navLinks.push({
      href: `/${slug}/schedule`,
      label: pages.schedule.title || "Schedule",
    });
  }
  if (pages.speakers.visible) {
    navLinks.push({
      href: `/${slug}/speakers`,
      label: pages.speakers.title || "Speakers",
    });
  }

  const isRegisterPage = pathname === `/${slug}/register` || pathname.startsWith(`/${slug}/register/`);
  const showRegister = !isRegisterPage;

  function isActive(href: string) {
    if (href === `/${slug}`) {
      return pathname === `/${slug}`;
    }
    return pathname.startsWith(href);
  }

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? `${primaryColor}f5` : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : undefined,
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href={`/${slug}`}
          className="text-sm font-semibold tracking-tight"
          style={{ color: scrolled ? "#ffffff" : primaryColor }}
        >
          {eventName}
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-xs font-medium transition-opacity hover:opacity-80"
                style={{ color: scrolled ? "#ffffffcc" : `${primaryColor}99` }}
              >
                {link.label}
                {isActive(link.href) && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: scrolled ? "#ffffff" : primaryColor }}
                  />
                )}
              </Link>
            ))}
          </div>
          {showRegister && (
            <Link
              href={`/${slug}/register`}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              {ctaText || "Register Now"}
            </Link>
          )}
        </div>

        {/* Mobile nav */}
        <div className="flex items-center gap-3 md:hidden">
          {showRegister && (
            <Link
              href={`/${slug}/register`}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              {ctaText || "Register Now"}
            </Link>
          )}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1"
            style={{ color: scrolled ? "#ffffff" : primaryColor }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div
          className="border-t px-6 py-4 md:hidden"
          style={{
            backgroundColor: `${primaryColor}f5`,
            backdropFilter: "blur(12px)",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  color: isActive(link.href) ? "#ffffff" : "#ffffffaa",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
