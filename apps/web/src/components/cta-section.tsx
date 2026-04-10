import Link from "next/link";
import { FadeIn } from "./fade-in";

export function CtaSection() {
  return (
    <section className="bg-gradient-to-r from-violet-600 via-violet-700 to-indigo-600 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <FadeIn>
          <h2 className="text-[28px] font-semibold tracking-tight text-white text-balance sm:text-[40px]">
            Ready to run your next event?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-violet-200">
            Join Canadian organizations that are done wrestling with bloated
            event software.
          </p>
          <div className="mt-10">
            <Link
              href="/sign-up"
              className="inline-block rounded-full bg-white px-8 py-3 text-base font-semibold text-violet-700 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              Get Started Free
            </Link>
          </div>
          <p className="mt-4 text-sm text-violet-200">
            No credit card required
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
