"use client";

import { useState, useRef, useCallback } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { MovieDisplay } from "@/components/movie";
import type { FilterState, Movie } from "@/lib/global-types";
import { useTheme } from "next-themes";

const DEFAULT_FILTERS: FilterState = {
  genres: "",
  inTheaters: null,
  minRating: 0,
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
//   const [isDarkMode, setIsDarkMode] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const { theme, setTheme } = useTheme();

  // Refs to trigger actions in MovieDisplay
  const addMovieRef = useRef<() => void>(() => {});
  const removeRatingsRef = useRef<() => void>(() => {});

  const registerAddMovie = useCallback((fn: () => void) => {
    addMovieRef.current = fn;
  }, []);

  const registerRemoveRatings = useCallback((fn: () => void) => {
    removeRatingsRef.current = fn;
  }, []);

//   // Sync dark mode with <html> class
//   useEffect(() => {
//     const stored = localStorage.getItem("darkMode");
//     if (stored === "true") {
//       setIsDarkMode(true);
//       document.documentElement.classList.add("dark");
//     }
//   }, []);

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDarkMode = theme === "dark";

  // Compute stats from movies
  const totalMovies = movies.length;
  const avgRating =
    movies.length > 0
      ? movies.reduce((sum, m) => sum + (m.rating ?? 0), 0) / movies.length
      : 0;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalMovies={totalMovies}
        avgRating={avgRating}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
      />

      <div className="flex flex-1">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onAddMovie={() => addMovieRef.current?.()}
          onRemoveRatings={() => removeRatingsRef.current?.()}
          movies={movies}
          filters={filters}
          onFilterChange={setFilters}
        />

        <main className="flex-1 p-6 overflow-auto">
          <MovieDisplay 
            searchQuery ={searchQuery}
            activeFilters={filters}
            onMoviesLoaded={setMovies}
            onRegisterAddMovie={registerAddMovie}
            onRegisterRemoveRatings={registerRemoveRatings}
          />
        </main>
      </div>
    </div>
  );
}
