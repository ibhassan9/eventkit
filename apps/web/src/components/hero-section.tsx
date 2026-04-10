import Link from "next/link";
import { DashboardMockup } from "./dashboard-mockup";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-bg">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-40 lg:pb-32 lg:pt-48">
        <div className="mx-auto max-w-3xl text-center">
          {/* Pill badge */}
          <div
            className="animate-fade-in-up inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-1.5 text-[13px] font-medium uppercase tracking-wide text-violet-600"
          >
            ✨ AI-powered event management
          </div>

          {/* Headline */}
          <h1
            className="mt-6 animate-fade-in-up text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-stone-900 text-balance opacity-0 sm:text-5xl lg:text-[64px]"
            style={{ animationDelay: "100ms" }}
          >
            Your event deserves better than a spreadsheet
          </h1>

          {/* Subheadline */}
          <p
            className="mx-auto mt-6 max-w-2xl animate-fade-in-up text-lg leading-[1.7] text-stone-500 text-balance opacity-0"
            style={{ animationDelay: "200ms" }}
          >
            EventKit is the modern event platform for Canadian organizations.
            Registration, payments, beautiful event websites, and on-site
            check-in — set up in minutes, not days.
          </p>

          {/* Buttons */}
          <div
            className="mt-10 flex animate-fade-in-up flex-col items-center justify-center gap-4 opacity-0 sm:flex-row"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/sign-up"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 via-violet-700 to-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/30"
            >
              Start Free
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center rounded-full border border-stone-300 px-8 py-3 text-base font-semibold text-stone-900 transition-all hover:bg-stone-100"
            >
              See it in action
            </Link>
          </div>

          {/* Trust text */}
          <p
            className="mt-6 animate-fade-in-up text-sm text-stone-400 opacity-0"
            style={{ animationDelay: "400ms" }}
          >
            No credit card required · Free for up to 50 attendees
          </p>
        </div>

        {/* Dashboard mockup */}
        <div
          className="relative mx-auto mt-20 max-w-5xl animate-fade-in-up opacity-0"
          style={{ animationDelay: "500ms" }}
        >
          {/* Violet glow behind mockup */}
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-violet-500/10 blur-3xl" />
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
