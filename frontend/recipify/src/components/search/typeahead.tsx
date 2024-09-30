import { AnimatePresence, motion } from "framer-motion";
import { Completion } from "../../hooks/useCompletion";

export default function Typeahead({
  completions,
  activeIndex,
}: {
  completions: Completion[];
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
          className="bg-gray/70 shadow-black-lg absolute z-10 mt-2 overflow-hidden rounded-md text-xs"
        >
          {completions.map((completion, i) => (
            <motion.li
              key={completion.id}
              initial={{ opacity: 0, y: -20 }}
              variants={childVariants}
              className={`${i % 2 ? "" : ""} px-4 py-2 ${activeIndex === i ? "bg-black/30 text-blue" : ""} transition-colors duration-100`}
            >
              {completion.text}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}
