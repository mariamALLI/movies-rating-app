"use client";
// import { useState } from "react";
import { useImmer } from "use-immer";

import { Field, FieldLabel, FieldLegend, FieldSet } from "../ui/field";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useRef } from "react";
import type { MovieFormProps } from "@/lib/global-types";

export default function MovieForm({
  movie = null,
  onSave,
  onCancel,
}: MovieFormProps) {
  const nameInputRef = useRef<HTMLInputElement>(null); // Ref to auto-focus the name input when the form opens

  const [movieFormData, setMovieFormData] = useImmer({
    name: movie ? movie.name : "",
    description: movie ? movie.description : "",
    image: movie ? movie.image : "",
    genres: movie ? movie.genres : [],
    inTheaters: movie ? movie.inTheaters : false,
  });

  // Update form when movie prop changes (for editing existing movie)
  useEffect(() => {
    if (movie) {
      setMovieFormData({
        name: movie.name || "",
        description: movie.description || "",
        image: movie.image || "",
        genres: movie.genres || [],
        inTheaters: movie.inTheaters || false,
      });
    }
  }, [movie, setMovieFormData]);

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
    setMovieFormData((draft) => {
      if (type === "checkbox") {
        (draft[name as keyof typeof draft] as boolean) = checked;
      } else {
        (draft[name as keyof typeof draft] as string) = value;
      }
    });
  };

  // this function handles files upload and converts it to a data URL.
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMovieFormData((draft) => {
          draft.image = reader.result as string;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // this function handles form submission
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // use the controlled state instead of FormData
    onSave(movieFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          name="description"
          value={movieFormData.description || ""}
          onChange={handleChangeInput}
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="image">Image URL</FieldLabel>
        <Input
          type="text"
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
              src={movieFormData.image}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}
      </Field>
      <FieldSet>
        <FieldLegend>Genres (Hold Ctrl/Cmd to select multiple)</FieldLegend>
        <select
          multiple
          id="genres"
          name="genres"
          value={movieFormData.genres || []}
          onChange={(e) =>
            setMovieFormData((draft) => {
              draft.genres = Array.from(
                e.target.selectedOptions,
                (option) => option.value,
              );
            })
          }
          required
          className="w-full border rounded p-2 min-h-[150px]"
          size={8}
        >
          <option value="crime">Crime</option>
          <option value="drama">Drama</option>
          <option value="comedy">Comedy</option>
          <option value="action">Action</option>
          <option value="thriller">Thriller</option>
          <option value="horror">Horror</option>
          <option value="sci-fi">Sci-Fi</option>
          <option value="romance">Romance</option>
          <option value="adventure">Adventure</option>
          <option value="animation">Animation</option>
          <option value="fantasy">Fantasy</option>
          <option value="mystery">Mystery</option>
        </select>
      </FieldSet>
      <Field>
        <div className="flex items-center gap-2">
          <Checkbox
            id="inTheaters"
            name="inTheaters"
            checked={movieFormData.inTheaters}
            onCheckedChange={(checked) => {
              setMovieFormData((draft) => {
                draft.inTheaters = checked as boolean;
              });
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <FieldLabel htmlFor="inTheaters">In Theaters</FieldLabel>
        </div>
      </Field>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="default">
          Save
        </Button>
      </div>
    </form>
  );
}
