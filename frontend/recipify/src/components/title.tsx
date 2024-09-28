import { motion } from "framer-motion";

export default function Title() {
  return (
    <motion.h1
      className="relative z-10 flex h-full items-center justify-center bg-gradient-to-r from-lightBlue via-pink to-lightBlue bg-[length:200%_100%] bg-clip-text text-6xl font-bold tracking-[15px] text-transparent"
      variants={{
        bgPosition: {
          backgroundPosition: ["200% 0%", "-200% 0%"],
          scale: [1, 0.98, 1],
          transition: {
            duration: 5,
            repeat: Infinity,
          },
        },
      }}
      animate="bgPosition"
    >
      Recipify
    </motion.h1>
  );
}
