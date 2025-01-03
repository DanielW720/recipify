import { createContext, ReactNode, useContext } from "react";
import useSearch, { UseSearchType } from "../hooks/useSearch";

const SearchContext = createContext<UseSearchType | null>(null);

export const SearchProvider = ({
  query,
  children,
}: {
  query: string;
  children: ReactNode;
}) => {
  const {
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
  } = useSearch(query);

  return (
    <SearchContext.Provider
      value={{
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
      }}
    >
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
