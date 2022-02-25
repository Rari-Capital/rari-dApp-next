import { useBreakpointValue } from "@chakra-ui/react";

export const useIsSmallScreen = () => {
  return (
    useBreakpointValue(
      {
        base: true,
        sm: true,
        md: false,
        lg: false,
        xl: false,
      },
      "lg"
    ) ?? false
  );
};
