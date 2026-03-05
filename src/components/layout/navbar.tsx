"use client";

import { Film, Search, Moon, Sun, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavbarProps } from "@/lib/global-types";

export default function Navbar({
  onMenuToggle,
  searchQuery,
  onSearchChange,
  totalMovies,
  avgRating,
  isDarkMode,
  onThemeToggle,
}: NavbarProps) {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b bg-white dark:bg-zinc-900 dark:border-zinc-700 flex items-center px-4 gap-3">
      {/* Hamburger – mobile only */}
      {isMobile && (
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
      )}

      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <Film className="w-6 h-6 text-blue-600" />
        <span className="font-bold text-gray-900 dark:text-white text-base hidden sm:block">
          Movie Rating App
        </span>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-lg mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Stats badges – hidden on mobile */}
      {!isMobile && (
        <div className="flex items-center gap-2 shrink-0">
          <div className="border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-1 text-center min-w-[60px]">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              Movies
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
              {totalMovies}
            </p>
          </div>
          <div className="border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-1 text-center min-w-[80px]">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              Avg Rating
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
              ⭐ {avgRating.toFixed(1)}
            </p>
          </div>
        </div>
      )}

      {/* Theme toggle */}
      <button
        onClick={onThemeToggle}
        className="p-2 rounded-lg border border-gray-200 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-800 transition shrink-0"
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="w-4 h-4 text-yellow-500" />
        ) : (
          <Moon className="w-4 h-4 text-gray-600" />
        )}
      </button>
    </header>
  );
}