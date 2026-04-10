import { FadeIn } from "./fade-in";

const ORGANIZATIONS = [
  "University of Toronto",
  "Canadian Medical Association",
  "MaRS Discovery",
  "TechTO",
  "Startup Canada",
  "GovCan",
];

export function SocialProofBar() {
  return (
    <section className="border-y border-stone-100 bg-stone-100/50 py-12">
      <FadeIn>
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-8 text-center text-[13px] font-medium uppercase tracking-wide text-stone-400">
            Trusted by teams across Canada
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {ORGANIZATIONS.map((org) => (
              <span
                key={org}
                className="px-4 py-2 text-[15px] font-medium text-stone-400"
              >
                {org}
              </span>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
