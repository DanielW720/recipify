import { AnimatePresence, motion } from "framer-motion";
import { Completion } from "../../hooks/useCompletion";

export default function Typeahead({
  completions,
  setQuery,
  activeIndex,
}: {
  completions: Completion[];
  setQuery: (q: string) => void;
  activeIndex: number;
}) {
  const variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
    drop: { transition: { staggerChildren: 0.1 } },
  };

  const childVariants = {
    drop: { opacity: 1, y: 0 },
  };

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
          className="from-gray to-gray/95 shadow-black-lg absolute z-10 mt-2 w-full overflow-hidden rounded-md bg-gradient-to-b text-xs"
        >
          {completions.map((completion, i) => (
            <motion.li
              key={completion.id}
              initial={{ opacity: 0, y: -20 }}
              variants={childVariants}
            >
              <button
                type="button"
                onClick={() => setQuery(completion.text)}
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
