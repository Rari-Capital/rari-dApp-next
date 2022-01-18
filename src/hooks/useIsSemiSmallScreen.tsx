import { useBreakpointValue } from "@chakra-ui/react";

export const useIsSemiSmallScreen = () => {
  return useBreakpointValue({
    base: true,
    sm: true,
    md: true,
    lg: false,
  })
};
