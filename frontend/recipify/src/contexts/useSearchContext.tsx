import { createContext, ReactNode, useContext } from "react";
import useSearch, { SearchResult } from "../hooks/useSearch";

export const SearchContext = createContext<
  [SearchResult | undefined, () => Promise<void>]
>([undefined, async () => {}]);

export const SearchProvider = ({
  query,
  children,
}: {
  query: string;
  children: ReactNode;
}) => {
  const [results, search] = useSearch(query);

  return (
    <SearchContext.Provider value={[results, search]}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }

  return context;
};
