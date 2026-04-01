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
    rating?: number;
  } | null;
  onSave: (movieData: {
    name: string;
    description: string;
    image: string;
    genres: string[];
    inTheaters: boolean;
    rating?: number;
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

// Filter State for sidebar
export interface FilterState {
  genres: string; //empty string means no filter "all"
  inTheaters: boolean | null; // null means no filter "all"
  minRating: number; // 0 means "all"
}

// NavbarProps for Navbar component
export interface NavbarProps {
  onMenuToggle: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalMovies: number;
  avgRating: number;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

// SidebarProps for Sidebar component
export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMovie: () => void;
  onRemoveRatings: () => void;
  movies: Movie[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

// MovieDisplayProps for MovieDisplay component
export interface MovieDisplayProps {
  searchQuery?: string;
  activeFilters?: FilterState;
  onMoviesLoaded?: (movies: Movie[]) => void;
  onRegisterAddMovie?: (fn: () => void) => void;
  onRegisterRemoveRatings?: (fn: () => void) => void;
}

export interface VerifyEmailProps {
  verificationUrl: string;
  email: string;
}