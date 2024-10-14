import { AnimatePresence, motion } from "framer-motion";
import { IoIosRemoveCircle } from "react-icons/io";
import { useSearchContext } from "../../../contexts/useSearchContext";

export const ActiveFilters = () => {
  const { filters, removeFilter, clearFilters } = useSearchContext();

  return (
    <AnimatePresence>
      {filters.length && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.5,
          }}
          className="mt-4 rounded-md bg-darkestBlue p-2 shadow-black-lg xl:mt-0 xl:min-w-80"
        >
          <div className="mb-4 flex justify-between">
            <h3 className="text-sm font-semibold tracking-wider text-blue">
              Active filters
            </h3>
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 rounded-md bg-blue p-1 text-xs"
            >
              Clear all
              <IoIosRemoveCircle className="text-red-500" />
            </button>
          </div>
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
