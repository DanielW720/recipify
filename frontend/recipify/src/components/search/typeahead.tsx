import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { useCompletionContext } from "../../contexts/useCompletionContext";
import { QueryContext } from "./search";

const variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
  drop: { transition: { staggerChildren: 0.1 } },
};

const childVariants = {
  drop: { opacity: 1, y: 0 },
};

export default function Typeahead() {
  const { setQuery } = useContext(QueryContext);
  const { completions, reset, activeIndex } = useCompletionContext();

  return (
    <AnimatePresence>
      {completions.length > 0 && (
        <motion.ul
          key="completions-list"
          variants={variants}
          initial="hidden"
          animate={["visible", "drop"]}
          exit="hidden"
          transition={{ duration: 0.1 }}
          className="absolute z-10 mt-[4.5rem] w-full max-w-xs overflow-hidden rounded-md bg-gradient-to-b from-gray to-gray/95 text-xs text-aqua shadow-black-lg md:max-w-sm xl:mt-14 xl:max-w-md xl:text-sm"
        >
          {completions.map((completion, i) => (
            <motion.li
              key={completion.id}
              initial={{ opacity: 0, y: -20 }}
              variants={childVariants}
            >
              <button
                type="button"
                onClick={() => {
                  setQuery(completion.text);
                  reset();
                }}
                className={`p-2 ${activeIndex === i ? "bg-black/30 text-blue" : ""} w-full text-left tracking-wide transition-colors duration-100 hover:bg-black/30 hover:text-blue`}
              >
                {completion.text}
              </button>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}
