import { AnimatePresence, motion } from "framer-motion";
import { RiCloseLargeLine } from "react-icons/ri";
import RangeFilters from "./filters/rangeFilters";

export const FilterModal = ({
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
