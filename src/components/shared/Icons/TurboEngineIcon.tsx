import { Box, usePrefersReducedMotion } from "@chakra-ui/react";

const speeds = {
    "slow": "2000ms",
    "medium": "1250ms",
    "fast": "500ms"
}

const TurboEngineIcon = ({
  fill = "grey",
  animate = false,
  animateSpeed = "medium",
  ...boxProps
}: {
  fill: string;
  animate?: boolean;
  animateSpeed?: "slow"| "medium" | "fast"
  [x: string]: any;
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <>
      <Box {...boxProps}>
        <svg
          viewBox="0 0 463 383"
          fill="grey"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="TURBO">
            <path
              id="Outer"
              fill-rule="grey"
              clip-rule="evenodd"
              d="M383 18C383 8.05888 391.059 0 401 0H445C454.941 0 463 8.05888 463 18V158C463 167.941 454.941 176 445 176H401C391.059 176 383 167.941 383 158V18ZM351 207.5C351 304.426 272.426 383 175.5 383C78.574 383 0 304.426 0 207.5C0 112.706 75.1562 35.4647 169.133 32.1134L169 32H175.5H351V143H338.768C346.662 162.966 351 184.727 351 207.5Z"
              fill={`${fill}`}
            />
            <path
              id="Spinner"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M252.043 232.497C254.612 224.628 256 216.226 256 207.5C256 168.343 228.043 135.716 191 128.491V197L190.891 197.191L252.043 232.497ZM236.244 260.326L175.014 224.975L175 225L174.971 224.95L174.822 224.863L114.305 259.803C129.069 277.061 151.007 288 175.5 288C199.745 288 221.486 277.282 236.244 260.326ZM159 197L159.021 197.036L98.7441 231.836C96.312 224.159 95 215.983 95 207.5C95 168.696 122.455 136.305 159 128.693V197ZM175.5 320C237.632 320 288 269.632 288 207.5C288 145.368 237.632 95 175.5 95C113.368 95 63 145.368 63 207.5C63 269.632 113.368 320 175.5 320Z"
              fill="#101010"
            />
          </g>
        </svg>
      </Box>
      <style jsx>{`
        #Spinner {
          animation-name: ${animate && !prefersReducedMotion ? "spin" : "none"};
          animation-duration: ${speeds[animateSpeed]};
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          transform-origin: center;
          transform-box: fill-box;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default TurboEngineIcon;
