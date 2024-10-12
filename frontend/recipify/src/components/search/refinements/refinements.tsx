import { AnimatePresence, motion } from "framer-motion";
import { useSearchContext } from "../../../contexts/useSearchContext";
import { useState } from "react";
import RangeFilters from "./filters/rangeFilters";

export default function Refinements() {
  const { results } = useSearchContext();
  const [showFilters, setShowFilters] = useState(false);

  const handleShowFilters = () => setShowFilters((prev) => !prev);

  return (
    <div className="w-full">
      <div className="mt-4 flex w-full max-w-xs justify-evenly">
        {results && (
          <p className="py-1 text-xs font-semibold tracking-wider text-white/90">
            {results.total.toLocaleString()} hits
          </p>
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
          <motion.div className="mt-[50%] h-fit w-full max-w-xs rounded-md bg-darkBlue p-4 shadow-black-lg">
            <h2 className="text-center font-semibold tracking-wider text-aqua">
              Filter Results
            </h2>
            <RangeFilters />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
