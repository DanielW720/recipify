import { useSearchContext } from "../../contexts/useSearchContext";
import { Hit as HitType } from "../../hooks/useSearch";

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
          <Hit key={hit.id} hit={hit} />
        ))}
      </ul>
    </div>
  );
}

const Hit = ({ hit }: { hit: HitType }) => (
  <li
    key={hit.id}
    className="flex w-[300px] flex-col justify-between gap-2 rounded-md border-[1px] border-aqua bg-darkBlue p-2 shadow-black-lg xl:w-[200px]"
  >
    <h2 className="text-center font-semibold tracking-wider text-aqua">
      {hit.title}
    </h2>
    <img
      src={`${API_URL}${hit.image}`}
      alt={`${hit.title} picture`}
      className="h-44 rounded-md object-cover shadow-md xl:h-28"
      sizes="500px"
    />
  </li>
);
