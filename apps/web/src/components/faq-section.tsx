import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@eventkit/ui/accordion";
import { AnimateOnScroll } from "./animate-on-scroll";

const FAQ_ITEMS = [
  {
    question: "How does the AI website generation work?",
    answer:
      "You provide a description of your event — the name, date, location, and what it is about — and our AI generates a complete, professional event website with sections for the schedule, speakers, venue, and registration. You can customize every section after generation.",
  },
  {
    question: "What does the Free plan include?",
    answer:
      "The Free plan lets you create one event with up to 50 attendees. You get a basic event website, email confirmations, and QR code check-in. It is perfect for testing EventKit before committing to a paid plan.",
  },
  {
    question: "How is my data protected?",
    answer:
      "EventKit is built with privacy by design. All data is stored in Canadian data centres with PIPEDA-compliant practices. We use encryption at rest and in transit, and never sell or share your attendee data with third parties.",
  },
  {
    question: "How do Stripe payments work?",
    answer:
      "EventKit uses Stripe Connect so payments go directly to your Stripe account. We support Canadian dollars natively, and attendees can pay with credit cards, debit cards, and Apple Pay. You receive funds on your normal Stripe payout schedule.",
  },
  {
    question: "Can I integrate EventKit with other tools?",
    answer:
      "EventKit supports webhook notifications for key events like new registrations and check-ins. Enterprise plans include custom integrations and a data export API. We are also building native integrations with popular tools.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "Free plans get community support through our documentation and forums. Pro plans include priority email support with a 24-hour response time. Enterprise plans get a dedicated account manager and SLA guarantees.",
  },
];

export function FaqSection() {
  return (
    <section className="bg-zinc-50 py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <AnimateOnScroll className="text-center">
          <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll className="mt-12">
          <Accordion>
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger className="text-left text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-zinc-500 leading-relaxed">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
