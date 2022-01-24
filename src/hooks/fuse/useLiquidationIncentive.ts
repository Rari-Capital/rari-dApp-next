// Rari
import { useRari } from "context/RariContext";

// Hooks
import { useQuery } from "react-query";
import { createComptroller } from "utils/createComptroller";

export const useLiquidationIncentive = (comptrollerAddress: string) => {
  const { fuse } = useRari();

  const { data } = useQuery(
    comptrollerAddress + " comptrollerData",
    async () => {
      const comptroller = createComptroller(comptrollerAddress, fuse);

      return comptroller.callStatic.liquidationIncentiveMantissa();
    }
  );

  return data;
};
