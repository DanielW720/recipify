import { motion } from "framer-motion";
import { Lines } from "./components/lines/lines";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d152e] to-[#152659]">
      <header className="relative flex h-32 w-full items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <Lines />
        </div>
        <Title />
      </header>
    </div>
  );
}

const Title = () => (
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
