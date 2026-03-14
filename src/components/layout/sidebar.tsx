"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Filter,
  ChevronDown,
  ChevronUp,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import type { SidebarProps } from "@/lib/global-types";

const GENRES = [
  "action",
  "adventure",
  "comedy",
  "crime",
  "drama",
  "fantasy",
  "horror",
  "romance",
  "sci-fi",
  "thriller",
  "animation",
  "mystery",
];


export default function Sidebar({
  isOpen,
  onClose,
  onAddMovie,
  onRemoveRatings,
  filters,
  onFilterChange,
}: SidebarProps) {
  const { data: session } = useSession();
  const [filterOpen, setFilterOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleGenreChange = (genre: string) => {
    onFilterChange({
      ...filters,
      genres: filters.genres === genre ? "" : genre,
    });
  };

  const handleInTheatersChange = (value: boolean | null) => {
    onFilterChange({ ...filters, inTheaters: value });
  };

  const handleMinRatingChange = (value: number) => {
    onFilterChange({ ...filters, minRating: value });
  };

  const handleRemoveRatings = () => {
    if (confirm("Are you sure you want to remove all ratings?")) {
      onRemoveRatings();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b dark:border-zinc-700">
        <h2 className="font-semibold text-gray-900 dark:text-white text-base">
          Menu
        </h2>
        {/* Close button on mobile */}
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 px-4 pt-5">
        {/* Add Movie */}
        <button
          onClick={() => {
            onAddMovie();
            onClose();
          }}
          className="flex items-center gap-2 w-full bg-black text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" />
          Add Movie
        </button>

        {/* Remove Ratings */}
        <button
          onClick={handleRemoveRatings}
          className="flex items-center gap-2 w-full bg-red-600 text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-red-700 transition"
        >
          <Trash2 className="w-4 h-4" />
          Remove Ratings
        </button>

        {/* Filter Movies */}
        <div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center justify-between w-full border border-gray-200 dark:border-zinc-600 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
          >
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter Movies
            </span>
            {filterOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Filter Panel */}
          {filterOpen && (
            <div className="mt-2 border border-gray-200 dark:border-zinc-600 rounded-lg p-3 space-y-4 bg-gray-50 dark:bg-zinc-800">
              {/* Genre filter */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Genre
                </p>
                <div className="flex flex-wrap gap-1">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreChange(genre)}
                      className={`px-2 py-1 rounded-full text-xs capitalize transition ${
                        filters.genres === genre
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-600 dark:text-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Theaters filter */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Availability
                </p>
                <div className="flex gap-2">
                  {[
                    { label: "All", value: null },
                    { label: "In Theaters", value: true },
                    { label: "Not in Theaters", value: false },
                  ].map(({ label, value }) => (
                    <button
                      key={label}
                      onClick={() => handleInTheatersChange(value)}
                      className={`px-2 py-1 rounded-full text-xs transition ${
                        filters.inTheaters === value
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-600 dark:text-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Rating filter */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Min Rating:{" "}
                  {filters.minRating === 0 ? "Any" : `${filters.minRating}★`}
                </p>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={1}
                  value={filters.minRating}
                  onChange={(e) =>
                    handleMinRatingChange(Number(e.target.value))
                  }
                  className="w-full accent-black dark:accent-white"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Any</span>
                  <span>5★</span>
                </div>
              </div>

              {/* Clear Filters */}
              {(filters.genres ||
                filters.inTheaters !== null ||
                filters.minRating > 0) && (
                <button
                  onClick={() =>
                    onFilterChange({
                      genres: "",
                      inTheaters: null,
                      minRating: 0,
                    })
                  }
                  className="w-full text-xs text-red-600 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User Profile */}
      <div className="border-t dark:border-zinc-700 px-4 py-3">
        {/* Profile dropdown panel */}
        {profileOpen && (
          <div className="mb-2 border border-gray-200 dark:border-zinc-600 rounded-lg overflow-hidden bg-white dark:bg-zinc-800 shadow-sm">
            <div className="px-3 py-2 border-b dark:border-zinc-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                My Account
              </p>
            </div>
            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
              <User className="w-4 h-4" />
              Profile
            </button>
            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}

        {/* Profile trigger */}
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-3 w-full hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg p-1 transition"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200 shrink-0">
            {session?.user?.image ? (
              <Image
                src={session.user.image as string}
                alt={session.user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-zinc-600">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              View Profile
            </p>
          </div>
          {profileOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-72 border-r dark:border-zinc-700 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <div className="relative z-10 w-72 h-full shadow-xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
