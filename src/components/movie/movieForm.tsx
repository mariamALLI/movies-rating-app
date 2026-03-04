"use client";

import { Field, FieldLabel } from "../ui/field";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useRef, useState } from "react";
import type { MovieFormProps } from "@/lib/global-types";
import { Star } from "lucide-react";

// Array of genres for the select input
const genresOptions = [
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

export default function MovieForm({
  movie = null,
  onSave,
  onCancel,
}: MovieFormProps) {
  const nameInputRef = useRef<HTMLInputElement>(null); // Ref to auto-focus the name input when the form opens

  const [movieFormData, setMovieFormData] = useState({
    name: movie ? movie.name : "",
    description: movie ? movie.description : "",
    image: movie ? movie.image : "",
    genres: movie ? movie.genres : ([] as string[]),
    inTheaters: movie ? movie.inTheaters : false,
    rating: movie ? movie.rating : 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const isSubmitting = useRef(false); // Ref to track if the form is currently submitting to prevent multiple submissions

  // Update form when movie prop changes (for editing existing movie) with a slight delay to ensure state updates correctly when switching between movies in edit mode.
  useEffect(() => {
    if (movie) {
      const nextFormData = {
        // Ensure we have default values for all fields to avoid uncontrolled input issues
        name: movie.name || "",
        description: movie.description || "",
        image: movie.image || "",
        genres: movie.genres || [],
        inTheaters: movie.inTheaters || false,
        rating: movie.rating || 0,
      };
      const timeoutId = setTimeout(() => {
        // This delay allows the form to reset properly when switching between different movies in edit mode, preventing stale state issues.
        setMovieFormData(nextFormData);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [movie]);

  // Auto-focus the name input when the form opens
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // this function handles input changes for text, textarea, and checkbox fields.
  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked; // for checkbox inputs
    setMovieFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // this function handles files upload and converts it to a data URL.
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMovieFormData((prevState) => ({
          ...prevState,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // this function handles form submission
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
// Prevent multiple submissions if the form is already submitting
    if (isSubmitting.current || isLoading) {
      return;
    }
    // use the controlled state instead of FormData
    isSubmitting.current = true; // Set the submitting ref to true to prevent multiple submissions
    setIsLoading(true);
    setError("");
  
    try {
      // validate ratings
      if (!movieFormData.rating || movieFormData.rating < 1) {
        throw new Error("Rating must be at least 1 star");
      }

      onSave(movieFormData); // Call the onSave callback with the form data to save the movie by the parent component
      onCancel(); // Close the form after saving

      // Reset the submitting ref and loading state after the request is complete
      if (!movie) {
        setMovieFormData({
          name: "",
          description: "",
          image: "",
          genres: [],
          inTheaters: false,
          rating: 0,
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
      isSubmitting.current = false; // Reset the submitting ref to allow future submissions
    }
  };

  // this function handles the genres selection and updates the form state accordingly. It allows multiple genres to be selected by checking the box.
  const handleGenreChange = (genre: string, checked: boolean) => {
    setMovieFormData((prevState) => ({
      ...prevState,
      genres: checked
        ? [...prevState.genres, genre] // Add genre to the array if checked
        : prevState.genres.filter((gr) => gr !== genre), // Remove genre from the array if unchecked
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/*Title*/}
      <h2 className="text-2xl font-bold mb-4">
        {movie ? "Edit Movie" : "Add New Movie"}
      </h2>

      {/* display error message  */}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Movie Name */}
      <Field>
        <FieldLabel htmlFor="name">Movie Name</FieldLabel>
        <Input
          ref={nameInputRef}
          type="text"
          id="name"
          name="name"
          value={movieFormData.name || ""}
          onChange={handleChangeInput}
          required
        />
      </Field>

      {/* Movie Description */}
      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          name="description"
          value={movieFormData.description || ""}
          onChange={handleChangeInput}
          rows={4}
          required
        />
      </Field>

      {/* Image Url */}
      <Field>
        <FieldLabel htmlFor="image">Image URL</FieldLabel>
        <Input
          type="url"
          id="image"
          name="image"
          value={movieFormData.image || ""}
          onChange={handleChangeInput}
          placeholder="Enter image URL or upload below"
        />
        <div className="mt-2">
          <FieldLabel htmlFor="imageFile" className="text-sm text-gray-600">
            Or upload an image
          </FieldLabel>
          <Input
            type="file"
            id="imageFile"
            accept="image/*"
            onChange={handleFileUpload}
            className="mt-1"
          />
        </div>
        {movieFormData.image && (
          <div className="mt-2">
            <img
              src={movieFormData.image || "https://placehold.co/400x600?text=No+Image"}

              alt="Preview"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}
      </Field>

      {/* Genres */}
      <Field>
        <FieldLabel htmlFor="genres">Genres</FieldLabel>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {genresOptions.map((genre) => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={genre}
                checked={movieFormData.genres.includes(genre)}
                onCheckedChange={(checked) =>
                  handleGenreChange(genre, checked as boolean)
                }
              />
              <label
                htmlFor={genre}
                className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {genre}
              </label>
            </div>
          ))}
        </div>
      </Field>

      {/*Movie Ratings */}
      <Field>
        <FieldLabel>Rating *</FieldLabel>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() =>
                setMovieFormData({ ...movieFormData, rating: star })
              }
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (movieFormData.rating ?? 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            </button>
          ))}
        </div>
      </Field>

      {/* In theaters */}
      <Field>
        <div className="flex items-center gap-2">
          <Checkbox
            id="inTheaters"
            name="inTheaters"
            checked={movieFormData.inTheaters}
            onCheckedChange={(checked) => {
              setMovieFormData((prevState) => ({
                ...prevState,
                inTheaters: checked as boolean,
              }));
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <FieldLabel htmlFor="inTheaters">In Theaters</FieldLabel>
        </div>
      </Field>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="cursor-pointer hover:bg-red-400 hover:text-white transition duration-200 scale-100 hover:scale-105"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="default"
          disabled={isLoading}
          className="cursor-pointer hover:bg-green-600 hover:text-white transition duration-200 scale-100 hover:scale-105"
        >
          {isLoading ? "Saving..." : movie ? "Update Movie" : "Add Movie"}
        </Button>
      </div>
    </form>
  );
}
