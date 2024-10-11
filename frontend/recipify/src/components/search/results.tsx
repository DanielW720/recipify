import { useSearchContext } from "../../contexts/useSearchContext";
import { Hit } from "./hit";

const API_URL = import.meta.env.VITE_API_URL;

export default function Results() {
  const { results } = useSearchContext();

  if (!results) {
    return null;
  }

  return (
    <div className="mt-4 text-sm font-semibold text-gray md:mt-8 xl:mt-10">
      <p className="text-xs text-white">
        {results.total.toLocaleString()} results
      </p>
      <ul className="mt-14 grid grid-cols-1 justify-items-center gap-14 md:grid-cols-2 xl:grid-cols-5">
        {results.hits.map((hit) => (
          <Hit key={hit.id} hit={hit} imageUrl={`${API_URL}${hit.image}`} />
        ))}
      </ul>
    </div>
  );
}
