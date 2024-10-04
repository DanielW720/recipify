import { useSearchContext } from "../../contexts/useSearchContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function Results() {
  const { results } = useSearchContext();

  if (!results) {
    return null;
  }

  return (
    <div className="mt-4 text-sm font-semibold text-gray">
      <p className="">{results.total.toLocaleString()} results</p>
      <ul className="mt-14 grid grid-cols-1 justify-items-center gap-14">
        {results.hits.map((hit) => (
          <li
            key={hit.id}
            className="bg-darkBlue flex w-80 flex-col gap-2 rounded-md border-[1px] border-aqua p-2 shadow-black-lg"
          >
            <h2 className="text-center font-semibold tracking-wider text-aqua">
              {hit.title}
            </h2>
            <img
              src={`${API_URL}${hit.image}`}
              alt={`${hit.title} picture`}
              className="h-52 rounded-md object-cover shadow-md"
              sizes="500px"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
