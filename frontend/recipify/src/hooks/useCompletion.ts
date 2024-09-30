import { useEffect, useRef, useState } from "react";

export type Completion = { id: string; text: string };

const defaultCompletions = { completions: [] };

const SEARCH_API_URL = import.meta.env.VITE_SEARCH_API_URL as string;
const endpoint = `${SEARCH_API_URL}complete/`;

console.log(SEARCH_API_URL);

export default function useCompletion(query: string): [
  {
    completions: Completion[];
  },
  () => void,
] {
  const [completions, setCompletions] = useState<{ completions: Completion[] }>(
    defaultCompletions,
  );
  const wasReset = useRef(false);

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

        setCompletions({
          completions: data["suggestions"]?.map((s: Completion) => ({
            id: s["id"],
            text: s["text"],
          })),
        });
        wasReset.current = false;
      }
    };

    // Clear completions instantly if query is empty
    if (!query) {
      setCompletions(defaultCompletions);
      wasReset.current = false;
    }

    const timer = setTimeout(() => {
      completion();
      wasReset.current = false;
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const reset = () => {
    wasReset.current = true;
    setCompletions(defaultCompletions);
  };

  return [completions, reset];
}
