import React, { useContext } from "react";
import { IoSearch } from "react-icons/io5";
import { QueryContext } from "./search";
import { useCompletionContext } from "../../contexts/useCompletionContext";
import { useSearchContext } from "../../contexts/useSearchContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Searchbar() {
  const { search, loading } = useSearchContext();
  const { query, setQuery } = useContext(QueryContext);
  const { load, reset, browseCompletions } = useCompletionContext();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    search();
    reset();
  };

  return (
    <form
      onSubmit={submit}
      method="get"
      className="relative w-full max-w-xs tracking-wide text-aqua md:max-w-sm xl:max-w-md"
    >
      <div className="flex items-center gap-2 rounded-md bg-gray px-2 py-2 text-sm font-semibold shadow-black-lg xl:text-lg">
        <label htmlFor="search" className="hidden">
          Search recipes
        </label>
        <input
          id="search"
          type="text"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={browseCompletions}
          onBlur={reset}
          onClick={load}
          placeholder="Search recipes"
          className="w-full bg-inherit tracking-wide outline-none"
        />
        <button type="submit" className="text-xl xl:text-2xl">
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            <IoSearch />
          )}
        </button>
      </div>
    </form>
  );
}
