"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MovieCard from "@/components/movie/movieCard";
import MovieCardSkeleton from "@/components/movie/movieCardSkeleton";
import Modal from "@/components/modal";
import MovieForm from "@/components/movie/movieForm";
import { Button } from "../ui/button";
import { Movie, MovieFormData, MovieDisplayProps } from "@/lib/global-types";
import {
  fetchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from "@/lib/movies-api";

export default function MovieDisplay({
  searchQuery = "",
  activeFilters,
  onMoviesLoaded,
  onRegisterAddMovie,
  onRegisterRemoveRatings,
}: MovieDisplayProps) {
  const queryClient = useQueryClient();
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  // Query for fetching movies
  const { data, isLoading, error } = useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
    refetchOnWindowFocus: false, // prevent refetching when window regains focus
    staleTime: 5 * 60 * 1000, // cache data for 5 minutes to reduce unnecessary API calls
  });

  // Notify parent about loaded movies (for stats)
  const prevMoviesRef = useRef<Movie[]>([]);
  useEffect(() => {
    if (data?.items && onMoviesLoaded) {
      // Only call if movies actually changed to avoid infinite loops
      if (
        JSON.stringify(data.items) !== JSON.stringify(prevMoviesRef.current)
      ) {
        prevMoviesRef.current = data.items;
        onMoviesLoaded(data.items);
      }
    }
  }, [data?.items, onMoviesLoaded]);

  // Mutations for creating, updating, and deleting movies
  const createMutation = useMutation({
    mutationFn: createMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      setShowMovieForm(false);
      setEditingMovie(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      setShowMovieForm(false);
      setEditingMovie(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });

  // register handlers with parent component (AppLayout -> Sidebar) for triggering add movie and remove ratings actions
  
  // This function will be called by the parent component to open the add movie form
  const handleAddNewMovie = useCallback(() => {
    setEditingMovie(null);
    setShowMovieForm(true);
  }, []);

  // This function will be called by the parent component to remove all ratings from movies
  const handleRemoveAllRatings = useCallback(() => {
      if (!data?.items) return;

      data.items.forEach((movie) => {
        updateMutation.mutate({
          id: movie.id,
          name: movie.name,
          description: movie.description,
          image: movie.image,
          genres: movie.genres,
          inTheaters: movie.inTheaters,
          rating: 0,
        });
      });
    }, [data, updateMutation]);

    useEffect(() => {
      onRegisterAddMovie?.(handleAddNewMovie);
    }, [onRegisterAddMovie, handleAddNewMovie]);

    useEffect(() => {
      onRegisterRemoveRatings?.(handleRemoveAllRatings);
    }, [onRegisterRemoveRatings, handleRemoveAllRatings]);


   // Handlers for editing, deleting, and changing rating of movies 
  const handleEditMovie = (movie: Omit<Movie, "userId">) => {
    setEditingMovie(movie as Movie);
    setShowMovieForm(true);
  };

  const handleSaveMovie = (movieData: MovieFormData) => {
    if (editingMovie?.id) {
      updateMutation.mutate({ id: editingMovie.id, ...movieData });
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

// Handler to close the movie form modal
  const handleCloseModal = () => {
    setShowMovieForm(false);
    setEditingMovie(null);
  };


  // client-side filtering based on search query and active filters
    const filteredMovies = (data?.items ?? []).filter((movie) => {
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !movie.name.toLowerCase().includes(q) &&
          !movie.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      // Genre filter
      if (activeFilters?.genres) {
        if (!movie.genres.includes(activeFilters.genres)) return false;
      }

      // In-theaters filter
      if (
        activeFilters?.inTheaters !== null &&
        activeFilters?.inTheaters !== undefined
      ) {
        if (movie.inTheaters !== activeFilters.inTheaters) return false;
      }

      // Min rating filter
      if (activeFilters?.minRating && activeFilters.minRating > 0) {
        if ((movie.rating ?? 0) < activeFilters.minRating) return false;
      }

      return true;
    });


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

      <Modal
        isOpen={showMovieForm}
        title={editingMovie?.id ? "Edit Movie" : "Add New Movie"}
        onClose={handleCloseModal}
      >
        <MovieForm
          movie={editingMovie}
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
        ) : filteredMovies.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ||
              activeFilters?.genres ||
              activeFilters?.inTheaters !== null ||
              (activeFilters?.minRating ?? 0) > 0
                ? "No movies match your search/filters."
                : "No movies yet. Add your first movie!"}
            </p>
          </div>
        ) : (
          filteredMovies.map((movie: Movie) => (
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
