import { AnimatePresence, motion } from "framer-motion";
import { useSearchContext } from "../../../contexts/useSearchContext";
import { useState } from "react";
import RangeFilters from "./filters/rangeFilters";
import { RiCloseLargeLine } from "react-icons/ri";

export default function Refinements() {
  const { results } = useSearchContext();
  const [showFilters, setShowFilters] = useState(false);

  const handleShowFilters = () => setShowFilters((prev) => !prev);

  return (
    <div className="w-full">
      <div className="mx-auto mt-4 flex w-full max-w-xs justify-between">
        {results ? (
          <p className="py-1 text-xs font-semibold tracking-wider text-white/90">
            {results.total.toLocaleString()} hits
          </p>
        ) : (
          <p></p>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleShowFilters}
          className="rounded-md bg-green-700 px-2 py-1 text-sm tracking-wider text-white/90 shadow-black-lg"
        >
          Filter Results
        </motion.button>
      </div>
      <FilterModal open={showFilters} handleOpen={handleShowFilters} />
    </div>
  );
}

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
