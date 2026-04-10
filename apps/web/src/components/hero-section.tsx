import Link from "next/link";
import { Button } from "@eventkit/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <HeroBackground />
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Now in public beta
          </span>
        </div>
        <h1
          className="mt-8 text-5xl font-bold leading-tight tracking-tight text-zinc-900 opacity-0 sm:text-6xl lg:text-7xl animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          Event management,{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            powered by AI.
          </span>
        </h1>
        <p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500 opacity-0 sm:text-xl animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          Describe your event and get a stunning website, registration forms,
          and printable badges in minutes. Built for Canadian organizers who
          want to move fast.
        </p>
        <div
          className="mt-10 flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <Button
            className="h-12 rounded-xl bg-indigo-600 px-8 text-base font-semibold text-white hover:bg-indigo-700"
            render={<Link href="/sign-up" />}
          >
            Get Started Free
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-xl px-8 text-base font-semibold"
            render={<Link href="#demo" />}
          >
            See Demo
          </Button>
        </div>
        <p
          className="mt-6 text-sm text-zinc-400 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          Free forever for 1 event. No credit card required.
        </p>
      </div>
    </section>
  );
}

function HeroBackground() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-white to-white" />
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <svg
          className="absolute inset-0 h-full w-full animate-grid-move"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hero-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgb(99 102 241 / 0.3)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="200%" fill="url(#hero-grid)" />
        </svg>
      </div>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-indigo-400/10 blur-3xl" />
      <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-purple-400/10 blur-3xl" />
    </div>
  );
}
