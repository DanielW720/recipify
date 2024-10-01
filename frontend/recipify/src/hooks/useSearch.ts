import { useEffect, useState } from "react";

export type Hit = {
  id: string;
  ingredients: string[];
  title: string;
  instructions: string;
  image: string;
};

export type Pagination = {
  current: string;
  first: string;
  last: string;
  next: string;
  previous: string;
  pages: string[];
};

export type Suggestion = {
  text: string;
  highlighted: string;
};

export type SearchResult = {
  total: number;
  hits: Hit[];
  pagination: Pagination;
  suggestions: Suggestion[];
};

const SEARCH_API_URL = import.meta.env.VITE_SEARCH_API_URL as string;

export default function useSearch(
  query: string,
): [SearchResult | undefined, () => Promise<void>] {
  const [results, setResults] = useState<SearchResult>();

  useEffect(() => {
    const timer = setTimeout(() => {
      search();
    }, 1000);

    return () => clearTimeout(timer);
  }, [query]);

  const search = async () => {
    const response = await fetch(`${SEARCH_API_URL}?query=${query}`, {
      headers: { Accept: "application/json" },
    });
    const data = (await response.json()) as SearchResult;

    setResults(data);
  };

  return [results, search];
}
