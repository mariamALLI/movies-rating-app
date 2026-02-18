"use client";

import { Star, Pencil, Trash2 } from "lucide-react";
import type { MovieCardProps } from "@/lib/global-types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// const starIcon = "★";
// const emptyStarIcon = "☆";
// const starRating = 5;

export default function MovieCard({
  movie,
  onEdit,
  onRatingChange,
}: MovieCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this movie?")) {
      return;
    }

    setIsDeleting(true);

    // using try catch to call and handle delete movie API
    try {
      const response = await fetch(`/api/movies/${movie.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete movie.");
      }
      router.refresh(); // refresh the page to reflect changes
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Failed to delete movie. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  function handleStarClick(rating: number) {
    //   // Placeholder function for star click handling
    //   // Toggle rating: if clicked star is the same as current rating, reset to 0
    const newRating = movie.rating === rating ? rating - 1 : rating + 0;
    onRatingChange(movie.id, newRating);
  }

  return (
    <div
      key={movie.id}
      className="group flex flex-col overflow-hidden relative movie-card max-w-[350px] h-100vh p-4 border border-gray-300 rounded-lg shadow-md bg-card text-card-foreground transition-all hover:shadow-lg"
    >
      {/* Image and badge container */}
      <div className="relative h-[400px] w-full mb-4">
        <Image
          src={movie.image || "https://placehold.co/400x600?text=No+Image"}
          alt={movie.name || "No Title"}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* now playing badge */}
        {movie.inTheaters ? (
          <span className="absolute top-12 left-8 bg-red-500 text-white px-4 py-1 rounded-full mb-2 inline-block">
            <p className="text-[12px]">Now playing</p>
          </span>
        ) : null}
        {/* star rating badge */}
        <div className="rating-bagde">
          <span
            className={`text-6xl absolute top-10 right-10 ${
              movie.rating > 0 ? " text-yellow-500" : "text-gray-400"
            }`}
          >
            <Star className="h-8 w-8 fill-yellow-400 text-gray-800" />
          </span>
          <p className="absolute top-15 right-17">
            {movie.rating > 0 ? movie.rating : "-"}
          </p>
        </div>
      </div>

      {/* Movie title */}
      <h2 className="line-clamp-1 text-lg font-semibold">{movie.name}</h2>

      {/* Movie genre */}
      {movie.genres && movie.genres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {movie.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium"
            >
              {genre}
            </span>
          ))}
        </div>
      )}

      {/* Movie description */}
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {movie.description}
      </p>

      {/* star rating */}
      <div className="flex gap-4 items-center mt-4">
        <p>
          Rating: 
        </p>
        {/* buttons for increasing or decreasing star rating */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, star) => (
            <Star
              key={star}
              onClick={() => handleStarClick(star)}
              className={`h-4 w-4 transition ${
                star < movie.rating ? "text-yellow-500" : "text-gray-300"
              } hover:scale-110`}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {movie.rating}/5
          </span>
        </div>

        {/* Edit & delete button */}
        <div className=" flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <Button
            variant="outline"
            size="sm"
            className="p-2 cursor-pointer flex-1"
            onClick={() => onEdit(movie)}
          >
            <Pencil className="w-4 h-4 mr-2" />
          </Button>
          <Button
            variant="destructive"
            className=" p-2 cursor-pointer"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
