"use client";
import Link from "next/link";
import { useState } from "react";
export default function Nav() {
  const [o, s] = useState(false);
  const L = [
    ["/", "Home"],
    ["/services", "Services"],
    ["/students", "Students"],
    ["/project-builder", "Build a project"],
    ["/track", "Track order"],
    ["/contact", "Contact"],
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#030407]/90 text-lab-text backdrop-blur-xl">
      <div className="mx-auto flex h-[75px] w-full max-w-page items-center justify-between gap-5 px-6 sm:px-8">
        <Link
          className="flex shrink-0 items-center gap-2.5"
          href="/"
          aria-label="sparse.lab home"
        >
          <img className="h-9 w-9 object-contain" src="/logo.png" alt="" />
          <span className="font-display text-[15px] font-semibold tracking-[-0.04em] text-white">
            sparse<span className="text-lab-gold">.</span>lab
          </span>
        </Link>
        <button
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 px-3 text-sm font-medium text-lab-text transition-colors hover:border-lab-gold/40 hover:text-lab-gold lg:hidden"
          aria-label="Menu"
          aria-expanded={o}
          onClick={() => s(!o)}
        >
          {o ? "Close" : "Menu"}
        </button>
        <nav
          className={`${o ? "absolute inset-x-0 top-full flex flex-col border-b border-white/10 bg-[#050609] p-4 shadow-2xl lg:static lg:flex-row lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none" : "hidden lg:flex"} items-stretch gap-1 lg:items-center lg:gap-1`}
          aria-label="Main navigation"
        >
          {L.map(([h, t]) => (
            <Link
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors lg:py-2 ${
                h === "/contact"
                  ? "border border-lab-gold/30 bg-lab-gold/[0.07] text-lab-gold hover:bg-lab-gold/[0.13]"
                  : "text-lab-muted hover:bg-white/[0.04] hover:text-white"
              }`}
              key={h}
              href={h}
              onClick={() => s(false)}
            >
              {t}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
