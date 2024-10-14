import { useEffect, useRef } from "react";
import { useSearchContext } from "../../contexts/useSearchContext";
import { Hit } from "./hit";
import { useInView } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

export default function Results() {
  const { results, scroll } = useSearchContext();

  if (!results) {
    return null;
  }

  console.log(results.hits.length);

  return (
    <div className="text-sm font-semibold text-gray">
      <ul className="mt-14 grid grid-cols-1 justify-items-center gap-14 md:grid-cols-2 xl:grid-cols-5">
        {results.hits.map((hit) => (
          <Hit key={hit.id} hit={hit} imageUrl={`${API_URL}${hit.image}`} />
        ))}
        <NextPage fetchNextBatch={scroll} />
      </ul>
    </div>
  );
}

const NextPage = ({ fetchNextBatch }: { fetchNextBatch: () => void }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      fetchNextBatch();
    }
  }, [isInView]);

  return <li ref={ref}></li>;
};
