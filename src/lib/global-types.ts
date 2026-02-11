// Movie types based on Prisma schema
export interface Movie {
  id: string;
  name: string;
  description: string;
  image: string;
  genres: string[];
  inTheaters: boolean;
  rating?: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response types
export interface MoviesResponse {
  items: Movie[];
}

export interface MovieResponse {
  movie: Movie;
}

// Form data types (without id and metadata)
export interface MovieFormData {
  name: string;
  description: string;
  image: string;
  genres: string[];
  inTheaters: boolean;
}

// Update types
export interface UpdateMovieParams extends MovieFormData {
  id: string;
  rating?: number;
}

// User types (if needed)
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// API Error types
export interface ApiError {
  message: string;
  error?: string;
}

// MovieFormProps for MovieForm component
export interface MovieFormProps {
  movie?: {
    name: string;
    description: string;
    image: string;
    genres: string[];
    inTheaters: boolean;
  } | null;
  onSave: (movieData: {
    name: string;
    description: string;
    image: string;
    genres: string[];
    inTheaters: boolean;
  }) => void;
  onCancel: () => void;
}

// MovieCardProps for MovieCard component
export interface MovieCardProps {
  movie: {
    id: string;
    name: string;
    description: string;
    genres: string[];
    rating: number;
    inTheaters: boolean;
    image: string;
  };
  onEdit: (movie: MovieCardProps["movie"]) => void;
  onDelete: (id: string) => void;
  onRatingChange: (id: string, newRating: number) => void;
}

// ModalProps for Modal component
export interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}