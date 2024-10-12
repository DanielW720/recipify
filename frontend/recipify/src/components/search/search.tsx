import { createContext, useState } from "react";
import Searchbar from "./searchbar";
import { SearchProvider } from "../../contexts/useSearchContext";
import { CompletionProvider } from "../../contexts/useCompletionContext";
import Results from "./results";
import Typeahead from "./typeahead";
import Suggestions from "./suggestions";
import Refinements from "./refinements/refinements";

export type QueryContextType = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

export const QueryContext = createContext<QueryContextType>({
  query: "",
  setQuery: () => {},
});

/**
 * Parent component for the searchbar, results, typeahead, filters etc.
 */
export default function Search() {
  const [query, setQuery] = useState("");

  return (
    <QueryContext.Provider value={{ query, setQuery }}>
      <SearchProvider query={query}>
        <CompletionProvider query={query} setQuery={setQuery}>
          <Searchbar />
          <Refinements />
          <Suggestions />
          <Typeahead />
          <Results />
        </CompletionProvider>
      </SearchProvider>
    </QueryContext.Provider>
  );
}
