import React, { useContext } from "react";
import { IoSearch } from "react-icons/io5";
import { QueryContext } from "./search";
import { useCompletionContext } from "../../contexts/useCompletionContext";
import { useSearchContext } from "../../contexts/useSearchContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import * as Switch from "@radix-ui/react-switch";

export default function Searchbar() {
  const { search, loading, setMode } = useSearchContext();
  const { query, setQuery } = useContext(QueryContext);
  const { load, reset, browseCompletions } = useCompletionContext();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    search();
    reset();
  };

  const switchMode = (on: boolean) => setMode(on ? "knn" : "keyword");

  return (
    <form
      onSubmit={submit}
      method="get"
      className="relative w-full max-w-xs tracking-wide text-aqua md:max-w-sm xl:max-w-md"
    >
      <SwitchDemo switchMode={switchMode} />
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

const SwitchDemo = ({ switchMode }: { switchMode: (on: boolean) => void }) => (
  <div className="mb-2 flex items-center gap-2 text-[0.65rem]">
    <p className="text-white">AI Search</p>
    <Switch.Root
      onCheckedChange={(e: boolean) => switchMode(e)}
      className="relative h-[18px] w-[30px] rounded-full border-[1px] border-aqua bg-darkestBlue shadow-md outline-none data-[state=checked]:bg-green-700"
    >
      <Switch.Thumb className="block size-[12px] translate-x-0.5 rounded-full bg-white transition-all duration-200 will-change-transform data-[state=checked]:translate-x-[15px]" />
    </Switch.Root>
  </div>
);
