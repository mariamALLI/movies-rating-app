"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#personalize", label: "Personalize" },
    { href: "#features", label: "Archivist Features" },
    // { href: "#journal", label: "The Journal" },
    { href: "#vault", label: "Why This Vault" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-sm bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-amber-600/20 group-hover:bg-amber-600/30 transition-colors">
              <Film className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">
              My Movie Storage
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/signin">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                Open Your Vault
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10">
            <div className="flex flex-col gap-3 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors px-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 pt-2">
                <Link href="/auth/signin" className="flex-1">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-300 hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" className="flex-1">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                    Vault
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
