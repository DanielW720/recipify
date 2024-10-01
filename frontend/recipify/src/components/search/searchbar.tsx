import React, { useContext, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { QueryContext } from "./search";
import { CompletionContext } from "../../contexts/useCompletionContext";
import Typeahead from "./typeahead";
import { SearchContext } from "../../contexts/useSearchContext";

export default function Searchbar() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [query, setQuery] = useContext(QueryContext);
  const [completions, reset] = useContext(CompletionContext);
  const [_, search] = useContext(SearchContext);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const length = completions.completions.length;

    if (length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev >= length - 1 ? -1 : prev + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev <= -1 ? length - 1 : prev - 1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        setQuery(completions.completions[activeIndex].text);
        setActiveIndex(-1);
        reset();
      } else if (e.key === "Enter") {
        search();
        reset();
      } else if (e.key === "Escape") {
        setActiveIndex(-1);
        reset();
      }
    }
  };

  return (
    <form
      onSubmit={submit}
      method="get"
      className="relative w-full max-w-xs tracking-wide text-aqua"
    >
      <div className="flex items-center gap-2 rounded-md bg-gray px-2 py-2 text-sm font-semibold shadow-black-lg">
        <label htmlFor="search" className="hidden">
          Search recipes
        </label>
        <input
          id="search"
          type="text"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            if (e.target.value === "") setActiveIndex(-1);
            setQuery(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search recipes"
          className="w-full bg-inherit tracking-wide outline-none"
        />
        <button type="submit">
          <IoSearch className="text-xl" />
        </button>
      </div>
      <Typeahead
        completions={completions.completions}
        setQuery={setQuery}
        activeIndex={activeIndex}
      />
    </form>
  );
}
