import { motion } from "framer-motion";
import { SVGProps } from "react";

const duration = 10;

export const Lines = (props: SVGProps<SVGSVGElement>) => (
  <motion.div
    className="blur-[2px] animate-stroke-animation-10s"
    animate={{
      scale: [1, 1.1, 1],
      rotateY: [0, 10, 0],
      rotateX: [0, 10, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "loop",
      ease: "linear",
    }}
  >
    <Svg {...props} />
  </motion.div>
);

const Svg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 150 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g id="blue" clipPath="url(#clip0_1_3)">
      <g id="Line 4" filter="url(#filter0_d_1_3)">
        <path
          d="M0 23.1433C16.271 20.2957 88.3214 25.1512 88.3214 25.1512C88.3214 25.1512 165.294 29.0567 110.87 7.6729C56.4453 -13.7109 82.2574 67.0325 17.2504 22.2492M29.6523 22.3876C69.8457 -13.6512 60.5891 22.3876 150 23.1433"
          shapeRendering="crispEdges"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_1_3"
        x={-4.08619}
        y={3.49306}
        width={158.09}
        height={41.014}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0196078 0 0 0 0 0.760784 0 0 0 0 0.921569 0 0 0 0.05 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1_3"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1_3"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_1_3">
        <rect width={150} height={40} fill="white" />
      </clipPath>
    </defs>
  </svg>
);
