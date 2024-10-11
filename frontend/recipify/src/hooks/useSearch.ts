import { useEffect, useState } from "react";

export type Hit = {
  id: string;
  ingredients: string[];
  title: string;
  instructions: string;
  image: string;
  published: string;
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

export type UseSearchType = {
  results: SearchResult | undefined;
  search: () => Promise<void>;
  loading: boolean;
};

export default function useSearch(query: string): UseSearchType {
  const [results, setResults] = useState<SearchResult>();
  const [loading, setLoading] = useState(false);

  /**
   * Debounce the search query to prevent too many requests
   */
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(async () => {
      await search();
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      setLoading(false);
    };
  }, [query]);

  const search = async () => {
    const response = await fetch(`${SEARCH_API_URL}?query=${query}`, {
      headers: { Accept: "application/json" },
    });
    const data = (await response.json()) as SearchResult;

    setResults(data);
  };

  return { results, search, loading };
}
