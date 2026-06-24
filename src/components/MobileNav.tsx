"use client";

import { useState } from "react";
import { X, Menu } from "lucide-react";
import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
  active?: boolean;
}

export default function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-slate-500 hover:text-white transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-background border-l border-white/[0.04] p-6 shadow-2xl">
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-slate-500 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col space-y-1.5">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    item.active
                      ? 'bg-amber-500/5 text-amber-300 border border-amber-500/10'
                      : 'text-slate-500 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
