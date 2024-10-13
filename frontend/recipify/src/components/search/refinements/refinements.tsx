import { AnimatePresence, motion } from "framer-motion";
import { useSearchContext } from "../../../contexts/useSearchContext";
import { useState } from "react";
import RangeFilters from "./filters/rangeFilters";
import { RiCloseLargeLine } from "react-icons/ri";
import { IoIosRemoveCircle } from "react-icons/io";

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

const ActiveFilters = () => {
  const { filters, removeFilter } = useSearchContext();

  if (!filters.length) return;

  return (
    <div className="mt-4 rounded-md bg-darkestBlue p-2 shadow-black-lg xl:mt-0">
      <h3 className="mb-1 text-sm font-semibold tracking-wider text-blue">
        Active filters
      </h3>
      <ul className="flex flex-wrap justify-evenly gap-4">
        {filters.map((filter) => {
          const label = dict[filter.key];

          if (!label) {
            console.error("No label found for filter key", filter.key);
            return;
          }

          return (
            <li key={filter.key} className="py-1 text-white/90">
              <h4 className="mb-1 font-semibold">{label}</h4>
              {filter.value.map((value) => (
                <div key={value} className="flex gap-1">
                  <p>{value}</p>
                  <button
                    onClick={() => removeFilter(filter.key, value)}
                    className="text-sm text-red-500 xl:text-lg"
                  >
                    <IoIosRemoveCircle />
                  </button>
                </div>
              ))}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const FilterModal = ({
  open,
  handleOpen,
}: {
  open: boolean;
  handleOpen: () => void;
}) => {
  const close = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      handleOpen();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className={`fixed inset-0 z-50 flex justify-center bg-black/50`}
        >
          <motion.div className="relative mt-52 h-fit w-full max-w-xs rounded-md bg-darkBlue p-4 text-xs shadow-black-lg md:max-w-md md:px-8 md:pb-8 md:text-sm xl:max-w-2xl xl:text-lg">
            <h2 className="mb-4 text-center text-lg font-semibold tracking-wider text-blue md:mb-8 md:text-2xl xl:mb-12 xl:text-4xl">
              Filter Results
            </h2>
            <button
              type="button"
              onClick={handleOpen}
              className="absolute inset-2 h-fit w-fit text-xl text-blue xl:inset-4 xl:text-3xl"
            >
              <RiCloseLargeLine />
            </button>
            <RangeFilters />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// This dictionary is used to map filter keys to human-readable labels.
const dict: Record<string, string> = {
  start_date: "Start Date",
  end_date: "End Date",
};
