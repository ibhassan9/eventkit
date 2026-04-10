"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { FaqData, WebsiteConfig } from "@/types";

interface FaqSectionProps {
  data: FaqData;
  theme: WebsiteConfig["theme"];
}

export function FaqSection({ data, theme }: FaqSectionProps) {
  if (data.items.length === 0) return null;

  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2
            className="mb-2 text-sm font-semibold tracking-widest uppercase"
            style={{ color: theme.secondaryColor }}
          >
            FAQ
          </h2>
          <h3
            className="text-3xl font-bold tracking-tight"
            style={{ color: theme.primaryColor }}
          >
            Frequently Asked Questions
          </h3>
        </div>
        <Accordion>
          {data.items.map((item, index) => (
            <AccordionItem key={index} value={String(index)}>
              <AccordionTrigger
                className="text-left text-base font-medium"
                style={{ color: theme.primaryColor }}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: `${theme.primaryColor}99` }}
                >
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
