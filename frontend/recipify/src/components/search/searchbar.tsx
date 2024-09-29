import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import useCompletion from "../../hooks/useCompletion";
import Typeahead from "./typeahead";

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const completions = useCompletion(query);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const length = completions.length;

    if (length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev >= length - 1 ? -1 : prev + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev <= -1 ? length - 1 : prev - 1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        setQuery(completions[activeIndex]);
        setActiveIndex(-1);
      } else if (e.key === "Escape") {
        setActiveIndex(-1);
      }
    }
  };

  return (
    <form
      onSubmit={submit}
      method="get"
      className="w-64 tracking-wide text-aqua"
    >
      <div className="shadow-black-lg bg-gray flex items-center gap-2 rounded-md px-4 py-2 font-semibold">
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
          className="w-full bg-inherit outline-none"
        />
        <button type="submit">
          <IoSearch className="text-xl" />
        </button>
      </div>
      <Typeahead completions={completions} activeIndex={activeIndex} />
    </form>
  );
}
