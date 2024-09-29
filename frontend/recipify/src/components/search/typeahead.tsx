import { AnimatePresence, motion } from "framer-motion";

export default function Typeahead({
  completions,
  activeIndex,
}: {
  completions: string[];
  activeIndex: number;
}) {
  const variants = {
    hidden: { opacity: 0, scale: 0.9 },
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
          className="bg-gray/70 shadow-black-lg relative z-10 overflow-hidden rounded-md text-sm"
        >
          {completions.map((completion, i) => (
            <motion.li
              key={completion}
              initial={{ opacity: 0, y: -20 }}
              variants={childVariants}
              className={`${i % 2 ? "" : ""} px-4 py-1 ${activeIndex === i ? "bg-black/30 text-blue" : ""} transition-colors duration-100`}
            >
              {completion}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}
