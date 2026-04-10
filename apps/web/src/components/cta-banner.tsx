import Link from "next/link";
import { Button } from "@eventkit/ui/button";
import { AnimateOnScroll } from "./animate-on-scroll";

export function CtaBanner() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <AnimateOnScroll>
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 px-8 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to run your next event?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
              Join hundreds of Canadian organizers who save hours on every
              event with AI-powered tools.
            </p>
            <div className="mt-8">
              <Button
                className="h-12 rounded-xl bg-white px-8 text-base font-semibold text-indigo-700 hover:bg-indigo-50"
                render={<Link href="/sign-up" />}
              >
                Get Started Free
              </Button>
            </div>
            <p className="mt-4 text-sm text-indigo-200">
              No credit card required. Free forever for 1 event.
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
