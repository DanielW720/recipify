import { useContext } from "react";
import { useSearchContext } from "../../contexts/useSearchContext";
import { QueryContext } from "./search";

export default function Suggestions() {
  const { setQuery } = useContext(QueryContext);
  const { results } = useSearchContext();
  const suggestions = results?.suggestions;

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 text-sm text-white">
      Did you mean{" "}
      <span
        className="text-lightBlue underline"
        onClick={() => setQuery(suggestions[0].text)}
      >
        {suggestions[0].text}
      </span>
      ?
    </div>
  );
}
