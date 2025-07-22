import { useEffect, useState } from "react";

export const KEY = "a25920f3";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      callback?.();

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const url = `http://omdbapi.com/?apikey=${KEY}&s=${query}`;
          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies!");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found!");
          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 2) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query, callback]
  );

  return { movies, isLoading, error };
}
