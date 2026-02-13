import {
  Movie,
  MovieFormData,
  MoviesResponse,
  UpdateMovieParams,
} from "@/lib/global-types";

// API functions
export const fetchMovies = async (): Promise<MoviesResponse> => {
  const res = await fetch("/api/movies");
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
};

export const createMovie = async (movieData: MovieFormData): Promise<Movie> => {
  const res = await fetch("/api/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movieData),
  });
  if (!res.ok) throw new Error("Failed to create movie");
  return res.json();
};

export const updateMovie = async ({
  id,
  ...movieData
}: UpdateMovieParams): Promise<Movie> => {
  const res = await fetch(`/api/movies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movieData),
  });
  if (!res.ok) throw new Error("Failed to update movie");
  return res.json();
};

export const deleteMovie = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`/api/movies/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete movie");
  return res.json();
};
