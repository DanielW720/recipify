import { motion } from "framer-motion";
import { Lines } from "./components/lines/lines";

function App() {
  return (
    <div className="bg-gradient-to-b from-[#0d152e] to-[#152659] min-h-screen">
      <header className="relative w-full h-32 flex justify-center items-center">
        <div className="absolute inset-0 overflow-hidden">
          <Lines />
        </div>
        <Title />
      </header>
    </div>
  );
}

export default App;

const titleVariants = {
  animate: {
    // Background position: x% y%, where 0% 0% is top left (default)
    backgroundPosition: ["200% 0%", "-200% 0%"],
    // backgroundPosition: ["200% 200%", "-200% 0%"],
    transition: {
      duration: 5,
      repeat: Infinity,
      delay: 2,
      repeatDelay: 3,
    },
  },
};

const Title = () => (
  <motion.h1
    // Using a gradient background to animate the text
    // Background size makes the gradient larger than the text width
    className="text-6xl tracking-[15px] relative z-10 font-bold text-transparent bg-clip-text bg-gradient-to-r from-lightBlue via-pink to-lightBlue h-full flex items-center justify-center bg-[length:200%_100%]"
    variants={titleVariants}
    animate="animate"
  >
    Recipify
  </motion.h1>
);
