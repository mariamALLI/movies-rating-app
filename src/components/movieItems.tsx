import { Pencil, Trash2 } from "lucide-react";
import type { MovieCardProps } from "@/lib/global-types";

const starIcon = "★";
const emptyStarIcon = "☆";
const starRating = 5;


export default function MovieCard({
  movie,
  onEdit,
  onDelete,
  onRatingChange,
}: MovieCardProps) {
  function handleStarClick(rating: number) {
    // Placeholder function for star click handling
    // Toggle rating: if clicked star is the same as current rating, reset to 0
    const newRating = movie.rating === rating ? rating - 1 : rating + 0;
    onRatingChange(movie.id, newRating);
  }

  return (
    <div
      key={movie.id}
      className="relative movie-card max-w-[350px] p-4 border border-gray-300 rounded-lg shadow-md"
    >
      <img
        className="w-[300px] h-[450px] mx-auto mb-6 rounded-lg shadow-lg"
        src={movie ? movie.image : "https://placehold.co/400"}
        alt={movie ? movie.name : "No Title"}
      />
      {/* now playing badge */}
      {movie.inTheaters ? (
        <span className="absolute top-12 left-8 bg-red-500 text-white px-4 py-1 rounded-full mb-2 inline-block">
          <p className="text-[12px]">Now playing</p>
        </span>
      ) : (
        ""
      )}
      {/* star rating badge */}
      <div className="rating-bagde">
        <span
          className={`text-6xl absolute top-10 right-10 ${
            movie.rating > 0 ? " text-yellow-500" : "text-gray-400"
          }`}
        >
          {starIcon}
        </span>
        <p className="absolute top-15 right-17">
          {movie.rating > 0 ? movie.rating : "-"}
        </p>
      </div>
      <h2>{movie.name}</h2>
      <p className="mb-2">
        {movie.genres.map((genre) => (
          <span
            key={genre}
            className="mr-2 bg-blue-400 rounded-lg px-2 py-1 text-white text-shadow-sm"
          >
            {genre}
          </span>
        ))}
      </p>
      <p>{movie.description}</p>
      <div className="flex gap-4 items-center mt-4">
        <p>
          Rating: {movie.rating}/ {starRating}{" "}
        </p>
        {/* buttons for increasing or decreasing star rating */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleStarClick(star)}
              className={`text-2xl transition ${
                star <= movie.rating ? "text-yellow-500" : "text-gray-400"
              } hover:scale-110`}
            >
              {star <= movie.rating ? starIcon : emptyStarIcon}
            </button>
          ))}
        </div>

        <div className="ml-auto flex">
          <button
            className="py-2 px-4 cursor-pointer"
            onClick={() => onEdit(movie)}
          >
            <Pencil className="w-5 h-8 text-gray-500 hover:text-yellow-400 transition" />
          </button>
          <button
            className=" p-2 cursor-pointer"
            onClick={() => onDelete(movie.id)}
          >
            <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-600 transition" />
          </button>
        </div>
      </div>
    </div>
  );
}
