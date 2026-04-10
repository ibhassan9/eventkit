import Link from "next/link";
import { formatDateRange } from "@eventkit/lib/utils";
import type { HeroData, WebsiteConfig } from "@eventkit/types";

interface HeroSectionProps {
  data: HeroData;
  theme: WebsiteConfig["theme"];
  event: { name: string; startDate: Date; endDate: Date; timezone: string };
  slug: string;
}

export function HeroSection({ data, theme, event, slug }: HeroSectionProps) {
  const dateRange = formatDateRange(
    event.startDate,
    event.endDate,
    event.timezone
  );

  return (
    <section
      id="hero"
      className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{ backgroundColor: theme.primaryColor }}
    >
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full blur-3xl"
          style={{ backgroundColor: theme.secondaryColor }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full blur-3xl"
          style={{ backgroundColor: theme.secondaryColor }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl animate-[fadeInUp_0.8s_ease-out]">
        <p className="mb-4 text-sm font-medium tracking-widest uppercase text-white/60">
          {dateRange}
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          {data.title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
          {data.subtitle}
        </p>
        <div className="mt-10">
          <Link
            href={`/${slug}/register`}
            className="inline-flex items-center rounded-xl px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            {data.ctaText}
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
