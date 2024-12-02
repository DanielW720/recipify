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

export type Filter = {
  key: string;
  value: string[];
};

export type Mode = "keyword" | "knn" | undefined;

const API_URL = import.meta.env.VITE_API_URL as string;
const SEARCH_API_URL = import.meta.env.VITE_SEARCH_API_URL as string;

export type UseSearchType = {
  results: SearchResult | undefined;
  search: () => Promise<void>;
  loading: boolean;
  filters: Filter[];
  addFilter: (key: string, value: string) => void;
  removeFilter: (key: string, value?: string) => void;
  setFilterParameter: (key: string, value: string) => void;
  clearFilters: () => void;
  scroll: () => Promise<void>;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<"keyword" | "knn" | undefined>>;
};

export default function useSearch(query: string): UseSearchType {
  const [results, setResults] = useState<SearchResult>();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [filterParams, setFilterParams] = useState<string>("");
  const [mode, setMode] = useState<Mode>();

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
  }, [query, filterParams]);

  /**
   * Update the filter parameters when filters change
   */
  useEffect(() => {
    if (filters.length === 0) {
      setFilterParams("");
      return;
    }

    const params = filters
      .map((filter) => `${filter.key}=${filter.value.join(",")}`)
      .join("&");

    setFilterParams(`&${params}`);
  }, [filters]);

  /**
   * Add a filter to the search query
   */
  const addFilter = (key: string, value: string) => {
    setFilters((prev) => {
      const filter = prev.find((f) => f.key === key);

      if (filter) {
        filter.value.push(value);
        return [...prev];
      }

      return [...prev, { key, value: [value] }];
    });
  };

  /**
   * Set a filter parameter. Using this function will replace the current values of the filter.
   */
  const setFilterParameter = (key: string, value: string) => {
    setFilters((prev) => {
      const filter = prev.find((f) => f.key === key);

      if (filter) {
        filter.value = [value];
        return [...prev];
      }

      return [...prev, { key, value: [value] }];
    });
  };

  /**
   * Remove a filter from the search query. If no value is provided, the entire filter will be removed.
   */
  const removeFilter = (key: string, value?: string) => {
    setFilters((prev) => {
      const filter = prev.find((f) => f.key === key);

      if (filter) {
        if (!value) {
          // Remove the entire filter if no value is provided
          return prev.filter((f) => f.key !== key);
        }

        // Remove the value from the filter
        filter.value = filter.value.filter((v) => v !== value);

        if (filter.value.length === 0) {
          return prev.filter((f) => f.key !== key);
        }

        return [...prev];
      }

      return prev;
    });
  };

  /**
   * Execute the search query
   */
  const search = async () => {
    const url = new URL(SEARCH_API_URL);
    if (query) {
      url.searchParams.append("query", query);
    }
    filters.forEach((filter) =>
      url.searchParams.append(filter.key, filter.value.join(",")),
    );

    url.searchParams.append("mode", mode || "keyword");

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    const data = (await response.json()) as SearchResult;

    setResults(data);
  };

  const clearFilters = () => {
    setFilters([]);
  };

  /**
   * Scroll to the next page of results.
   * Appends the next page of results to the current results, useful for infinite scrolling.
   */
  const scroll = async () => {
    if (!results?.pagination.next) {
      return;
    }

    const url = `${API_URL.replace(/\$/, "")}${results.pagination.next}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    const data = (await response.json()) as SearchResult;

    data.hits = [...results.hits, ...data.hits];

    setResults(data);
  };

  return {
    results,
    search,
    loading,
    filters,
    addFilter,
    removeFilter,
    setFilterParameter,
    clearFilters,
    scroll,
    mode,
    setMode,
  };
}
