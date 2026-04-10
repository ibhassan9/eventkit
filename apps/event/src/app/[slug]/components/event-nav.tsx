"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LogOut, Ticket, User } from "lucide-react";
import type { WebsitePages } from "@eventkit/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@eventkit/ui/dropdown-menu";
import { LoginModal } from "./login-modal";
import { logoutAction } from "../auth/actions";

interface EventNavProps {
  eventName: string;
  slug: string;
  pages: WebsitePages["pages"];
  primaryColor: string;
  accentColor: string;
  ctaText?: string;
  user?: { id: string; email: string; firstName: string } | null;
  isRegistered?: boolean;
}

export function EventNav({
  eventName,
  slug,
  pages,
  primaryColor,
  ctaText,
  user,
  isRegistered,
}: EventNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

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
  const isMyRegPage = pathname === `/${slug}/my-registration`;
  const showRegister = !isRegisterPage && !isMyRegPage;

  function isActive(href: string) {
    if (href === `/${slug}`) {
      return pathname === `/${slug}`;
    }
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    await logoutAction({});
    router.refresh();
  }

  const ctaHref = user && isRegistered ? `/${slug}/my-registration` : `/${slug}/register`;
  const ctaLabel = user && isRegistered ? "View Ticket" : (ctaText || "Register Now");

  return (
    <>
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

            {/* Auth section */}
            {!user ? (
              <button
                onClick={() => setLoginOpen(true)}
                className="text-xs font-medium transition-opacity hover:opacity-80"
                style={{ color: scrolled ? "#ffffffcc" : `${primaryColor}99` }}
              >
                Log In
              </button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80 outline-none"
                  style={{ color: scrolled ? "#ffffffcc" : `${primaryColor}99` }}
                >
                  <User className="size-3.5" />
                  {user.firstName}
                  <ChevronDown className="size-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="min-w-[200px]">
                  <DropdownMenuLabel className="font-normal text-xs text-zinc-500 truncate">
                    Logged in as {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isRegistered && (
                    <DropdownMenuItem
                      onClick={() => router.push(`/${slug}/my-registration`)}
                    >
                      <Ticket className="size-4" />
                      My Registration
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="size-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {showRegister && (
              <Link
                href={ctaHref}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                {ctaLabel}
              </Link>
            )}
          </div>

          {/* Mobile nav */}
          <div className="flex items-center gap-3 md:hidden">
            {showRegister && (
              <Link
                href={ctaHref}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                {ctaLabel}
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
              {!user ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setLoginOpen(true);
                  }}
                  className="text-left text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ color: "#ffffffaa" }}
                >
                  Log In
                </button>
              ) : (
                <>
                  {isRegistered && (
                    <Link
                      href={`/${slug}/my-registration`}
                      className="text-sm font-medium transition-opacity hover:opacity-80"
                      style={{
                        color: isActive(`/${slug}/my-registration`)
                          ? "#ffffff"
                          : "#ffffffaa",
                      }}
                    >
                      My Registration
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-sm font-medium transition-opacity hover:opacity-80"
                    style={{ color: "#ffffffaa" }}
                  >
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        slug={slug}
        primaryColor={primaryColor}
      />
    </>
  );
}
