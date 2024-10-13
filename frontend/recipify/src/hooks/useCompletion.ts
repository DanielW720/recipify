import { useEffect, useState } from "react";

export type Completion = { id: string; text: string };

const SEARCH_API_URL = import.meta.env.VITE_SEARCH_API_URL as string;
const endpoint = `${SEARCH_API_URL}complete/`;

export type UseCompletionType = {
  completions: Completion[];
  load: () => Promise<void>;
  reset: () => void;
  browseCompletions: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  activeIndex: number;
};

export default function useCompletion(
  query: string,
  setQuery: React.Dispatch<React.SetStateAction<string>>,
): UseCompletionType {
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  /**
   * Fetch completions when query changes and is not empty.
   * Debounce the query to prevent too many requests.
   */
  useEffect(() => {
    // Clear completions instantly if query is empty
    if (!query) {
      setCompletions([]);
    }

    const timer = setTimeout(() => {
      load();
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  /**
   * Reset browse index when query is empty
   */
  useEffect(() => {
    if (!query) {
      setActiveIndex(-1);
    }
  }, [query]);

  /**
   * Fetch completions from the API
   */
  const load = async () => {
    console.log("(load) query:", query);

    if (query) {
      const url = `${endpoint}?query=${query}`;
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();

      setCompletions(
        data["suggestions"]?.map((s: Completion) => ({
          id: s["id"],
          text: s["text"],
        })),
      );
    }
  };

  const reset = () => {
    setCompletions([]);
  };

  /**
   * Handle keyboard events for navigating completions
   */
  const browseCompletions = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const length = completions.length;

    if (length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev >= length - 1 ? -1 : prev + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev <= -1 ? length - 1 : prev - 1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        setQuery(completions[activeIndex].text);
        setActiveIndex(-1);
        reset();
      } else if (e.key === "Escape") {
        setActiveIndex(-1);
        reset();
      }
    }
  };

  return { completions, load, reset, browseCompletions, activeIndex };
}
