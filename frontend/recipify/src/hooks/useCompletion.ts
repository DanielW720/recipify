import { useEffect, useRef, useState } from "react";

export type Completion = { id: string; text: string };

const SEARCH_API_URL = import.meta.env.VITE_SEARCH_API_URL as string;
const endpoint = `${SEARCH_API_URL}complete/`;

export type UseCompletionType = {
  completions: Completion[];
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
  const wasReset = useRef(false);

  /**
   * Fetch completions
   */
  useEffect(() => {
    const completion = async () => {
      if (query && !wasReset.current) {
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
        wasReset.current = false;
      }
    };

    // Clear completions instantly if query is empty
    if (!query) {
      setCompletions([]);
      wasReset.current = false;
    }

    const timer = setTimeout(() => {
      completion();
      wasReset.current = false;
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

  const reset = () => {
    wasReset.current = true;
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

  return { completions, reset, browseCompletions, activeIndex };
}
