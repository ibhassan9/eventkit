import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: readonly string[];
  highlighted?: boolean;
  cta: string;
  ctaHref: string;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  cta,
  ctaHref,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col",
        highlighted &&
          "ring-2 ring-indigo-600 shadow-lg shadow-indigo-100"
      )}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <p className="text-sm text-zinc-500">{description}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="mb-6">
          <span className="text-4xl font-bold text-zinc-900">{price}</span>
          {period && (
            <span className="ml-1 text-sm text-zinc-400">{period}</span>
          )}
        </div>
        <ul className="mb-8 flex-1 space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <CheckIcon />
              <span className="text-zinc-600">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className={cn(
            "h-11 w-full rounded-xl text-base font-semibold",
            highlighted
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-zinc-900 text-white hover:bg-zinc-800"
          )}
          render={<Link href={ctaHref} />}
        >
          {cta}
        </Button>
      </CardContent>
    </Card>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
