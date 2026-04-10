import { AnimateOnScroll } from "./animate-on-scroll";

const ORGANIZATIONS = [
  "University of Toronto",
  "TechTO",
  "MaRS Discovery",
  "Collision Conf",
  "Shopify",
  "RBC Innovation",
];

export function SocialProofBar() {
  return (
    <section className="border-y border-zinc-100 bg-zinc-50/50 py-12">
      <AnimateOnScroll>
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-zinc-400">
            Trusted by Canadian organizations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {ORGANIZATIONS.map((org, i) => (
              <div
                key={org}
                className="flex h-10 items-center rounded-lg bg-zinc-200/60 px-5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="text-sm font-medium text-zinc-400">
                  {org}
                </span>
              </div>
            ))}
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
