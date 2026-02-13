"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import MovieCard from "@/components/movie/movieItems";
import MovieCardSkeleton from "@/components/movie/movieCardSkeleton";
import Modal from "@/components/modal";
import MovieForm from "@/components/movie/movieForm";
import { Button } from "../ui/button";
import { Movie, MovieFormData } from "@/lib/global-types";
import {
  fetchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from "@/lib/movies-api";

export default function MovieDisplay() {
  const queryClient = useQueryClient();
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  // Query for fetching movies
  const { data, isLoading, error } = useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      setShowMovieForm(false);
      setCurrentMovie(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      setShowMovieForm(false);
      setCurrentMovie(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });

  const handleAddNewMovie = () => {
    setCurrentMovie(null);
    setShowMovieForm(true);
  };

  const handleEditMovie = (movie: Omit<Movie, "userId">) => {
    setCurrentMovie(movie as Movie);
    setShowMovieForm(true);
  };

  const handleSaveMovie = (movieData: MovieFormData) => {
    if (currentMovie?.id) {
      updateMutation.mutate({ id: currentMovie.id, ...movieData });
    } else {
      createMutation.mutate(movieData);
    }
  };

  const handleDeleteMovie = (id: string) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleRatingChange = (id: string, rating: number) => {
    const movie = data?.items.find((m) => m.id === id);
    if (movie) {
      updateMutation.mutate({
        id,
        name: movie.name,
        description: movie.description,
        image: movie.image,
        genres: movie.genres,
        inTheaters: movie.inTheaters,
        rating: rating,
      });
    }
  };

  const handleCloseModal = () => {
    setShowMovieForm(false);
    setCurrentMovie(null);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading movies. Please try again.</p>
        <Button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["movies"] })
          }
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="w-full flex justify-center">
        <Button
          onClick={handleAddNewMovie}
          className="flex items-center gap-2 mb-4"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4" />
          Add Movie
        </Button>
      </div>

      <Modal
        isOpen={showMovieForm}
        title={currentMovie?.id ? "Edit Movie" : "Add New Movie"}
        onClose={handleCloseModal}
      >
        <MovieForm
          movie={currentMovie}
          onSave={handleSaveMovie}
          onCancel={handleCloseModal}
        />
      </Modal>

      <div className="movie-display grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <>
            <MovieCardSkeleton />
            <MovieCardSkeleton />
            <MovieCardSkeleton />
          </>
        ) : data?.items.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">
              No movies yet. Add your first movie!
            </p>
          </div>
        ) : (
          data?.items.map((movie: Movie) => (
            <MovieCard
              key={movie.id}
              movie={{ ...movie, rating: movie.rating ?? 0 }}
              onEdit={handleEditMovie}
              onDelete={handleDeleteMovie}
              onRatingChange={handleRatingChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
