import { ALL_MOVIES } from "../data/movies";

/*
 * Simulates an API call to fetch movies
 * Returns a promise that resolves after a delay to simulate network latency
 */

export const fetchMovies = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ALL_MOVIES);
    }, 2000); // Simulate a 2-second delay to simulate API call
  });
};
