import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "AI Website Builder", href: "/#demo" },
    { label: "Badge Designer", href: "/#features" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "mailto:hello@eventkit.ca" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/docs/api" },
    { label: "Status", href: "https://status.eventkit.ca" },
    { label: "Changelog", href: "/changelog" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "PIPEDA Compliance", href: "/privacy#pipeda" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
} as const;

type FooterCategory = keyof typeof FOOTER_LINKS;

export function Footer() {
  const categories = Object.keys(FOOTER_LINKS) as FooterCategory[];

  return (
    <footer className="border-t border-zinc-100 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {categories.map((category) => (
            <FooterColumn
              key={category}
              title={category}
              links={FOOTER_LINKS[category]}
            />
          ))}
        </div>
      </div>
      <div className="border-t border-zinc-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <p className="text-sm text-zinc-400">
            Built in Canada. &copy; 2024-{new Date().getFullYear()} EventKit. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-zinc-400">
            <span>Made with care in</span>
            <span>Toronto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
