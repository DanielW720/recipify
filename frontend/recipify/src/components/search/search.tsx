import { createContext, useState } from "react";
import Searchbar from "./searchbar";
import { SearchProvider } from "../../contexts/useSearchContext";
import { CompletionProvider } from "../../contexts/useCompletionContext";
import Results from "./results";

export const QueryContext = createContext<
  [string, React.Dispatch<React.SetStateAction<string>>]
>(["", () => {}]);

/**
 * Parent component for the searchbar, results, typeahead, filters etc.
 */
export default function Search() {
  const [query, setQuery] = useState("");

  return (
    <QueryContext.Provider value={[query, setQuery]}>
      <CompletionProvider query={query}>
        <SearchProvider query={query}>
          <Searchbar />
          <Results />
        </SearchProvider>
      </CompletionProvider>
    </QueryContext.Provider>
  );
}
