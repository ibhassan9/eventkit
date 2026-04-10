import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Changelog", href: "/changelog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  Support: [
    { label: "Docs", href: "/docs" },
    { label: "Contact", href: "mailto:hello@eventkit.ca" },
    { label: "Status", href: "https://status.eventkit.ca" },
  ],
};

type FooterCategory = keyof typeof FOOTER_LINKS;

export function Footer() {
  const categories = Object.keys(FOOTER_LINKS) as FooterCategory[];

  return (
    <footer className="bg-stone-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-stone-300">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {FOOTER_LINKS[category].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone-500 transition-colors hover:text-stone-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-stone-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <p className="text-sm text-stone-500">
            &copy; {new Date().getFullYear()} EventKit. Built in Canada 🇨🇦
          </p>
          <div className="flex items-center gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full bg-stone-800"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
