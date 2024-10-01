import { useContext } from "react";
import { SearchContext } from "../../contexts/useSearchContext";

export default function Results() {
  const [results, search] = useContext(SearchContext);

  if (!results) {
    return null;
  }

  return (
    <div className="mt-4 text-sm font-semibold text-gray">
      <p className="">{results.total.toLocaleString()} results</p>
      <ul className="mt-10 grid grid-cols-1 justify-items-center gap-6">
        {results.hits.map((hit) => (
          <li
            key={hit.id}
            className="flex w-72 flex-col gap-2 rounded-md bg-aqua px-2 py-1 shadow-black-lg"
          >
            <h2 className="text-center">{hit.title}</h2>
            <img
              src={`${"http://localhost:8000"}${hit.image}`}
              alt={`${hit.title} picture`}
              className="h-36 rounded-md object-cover shadow-md"
              sizes="200px"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}