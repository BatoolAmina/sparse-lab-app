import "./globals.css";
import Link from "next/link";
import Nav from "../components/Nav";
const siteUrl = process.env.SITE_URL || "http://localhost:3000";
export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "sparse.lab",
  title: {
    default: "sparse.lab | AI research and digital engineering",
    template: "%s | sparse.lab",
  },
  description:
    "AI research, publication support and thoughtfully engineered software—connected in one collaborative studio.",
  openGraph: {
    type: "website",
    siteName: "sparse.lab",
    title: "sparse.lab | AI research and digital engineering",
    description:
      "Research, AI and product engineering in one collaborative studio.",
  },
  twitter: {
    card: "summary_large_image",
    title: "sparse.lab | AI research and digital engineering",
  },
};
export default function L({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Instrument+Sans:wght@400;600&display=swap"
        />
      </head>
      <body className="min-h-screen overflow-x-clip bg-lab-black font-sans text-lab-text antialiased [&_*:focus-visible]:outline-2 [&_*:focus-visible]:outline-offset-4 [&_*:focus-visible]:outline-lab-blue">
        <Nav />
        {children}
        <footer className="border-t border-white/10 bg-[#040508]">
          <div className="mx-auto grid w-full max-w-page grid-cols-1 gap-9 px-6 py-12 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr] md:gap-12 md:py-16">
            <div className="flex items-start gap-4">
              <Link
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-2 transition-colors hover:border-lab-gold/40"
                href="/"
                aria-label="sparse.lab home"
              >
                <img
                  className="h-full w-full object-contain"
                  src="/logo.png"
                  alt=""
                />
              </Link>
              <div className="pt-1">
                <strong className="font-display text-base font-semibold tracking-tight text-white">
                  Ideas worth building.
                </strong>
                <p className="mt-2 max-w-xs text-sm leading-6 text-lab-muted">
                  Independent AI research &amp; product studio.
                </p>
              </div>
            </div>
            <nav
              className="flex flex-col items-start gap-3 text-sm text-lab-muted"
              aria-label="Footer"
            >
              <Link
                className="transition-colors hover:text-lab-gold"
                href="/services"
              >
                Services
              </Link>
              <Link
                className="transition-colors hover:text-lab-gold"
                href="/contact"
              >
                Contact
              </Link>
              <Link
                className="transition-colors hover:text-lab-gold"
                href="/track"
              >
                Track a request
              </Link>
              <Link
                className="transition-colors hover:text-lab-gold"
                href="/invite"
              >
                Get an invite
              </Link>
            </nav>
            <div className="flex flex-col items-start gap-3 text-sm">
              <span className="text-lab-muted">Have a project in mind?</span>
              <a
                className="font-medium text-white transition-colors hover:text-lab-gold"
                href="mailto:sparselab@gmail.com"
              >
                sparselab@gmail.com
              </a>
              <Link
                className="text-xs text-lab-muted transition-colors hover:text-lab-gold"
                href="/admin"
              >
                Admin
              </Link>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-page flex-col gap-2 border-t border-white/[0.07] px-6 py-5 text-xs text-lab-muted sm:px-8 md:flex-row md:items-center md:justify-between">
            <span className="leading-5">
              © {new Date().getFullYear()} sparse.lab. Thoughtfully made.
            </span>
            <span className="leading-5">Research meets real-world making.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
