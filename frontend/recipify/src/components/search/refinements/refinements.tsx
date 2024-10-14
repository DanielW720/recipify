import { motion } from "framer-motion";
import { useSearchContext } from "../../../contexts/useSearchContext";
import { useState } from "react";
import { ActiveFilters } from "./activeFilters";
import { FilterModal } from "./filterModal";

export default function Refinements() {
  const { results } = useSearchContext();
  const [showFilters, setShowFilters] = useState(false);

  const handleShowFilters = () => setShowFilters((prev) => !prev);

  return (
    <div className="mt-4 w-full max-w-xs justify-evenly text-xs md:max-w-sm md:text-sm xl:flex xl:max-w-xl">
      <div className="flex justify-between gap-4 xl:flex-col xl:justify-start">
        {results ? (
          <p className="py-1 font-semibold tracking-wider text-white/90">
            {results.total.toLocaleString()}{" "}
            {results.total > 1 ? "hits" : "hit"}
          </p>
        ) : (
          <p></p>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleShowFilters}
          className="w-fit rounded-md bg-green-700 px-2 py-1 tracking-wider text-white/90 shadow-black-lg xl:text-lg"
        >
          Filters
        </motion.button>
      </div>
      <ActiveFilters />
      <FilterModal open={showFilters} handleOpen={handleShowFilters} />
    </div>
  );
}
