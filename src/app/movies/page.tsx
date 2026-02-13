"use client";

import { MovieDisplay } from "@/components/movie";

export default function MoviesPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <MovieDisplay />
    </div>
  );
}