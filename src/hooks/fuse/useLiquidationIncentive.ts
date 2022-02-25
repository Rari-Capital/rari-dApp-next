// Rari
import { useRari } from "context/RariContext";

// Hooks
import { useQuery } from "react-query";
import { useCreateComptroller } from "utils/createComptroller";

export const useLiquidationIncentive = (comptrollerAddress: string) => {
  const { fuse, isAuthed } = useRari();

  const { data } = useQuery(
    comptrollerAddress + " comptrollerData",
    async () => {
      const comptroller = useCreateComptroller(
        comptrollerAddress,
        fuse,
        isAuthed
      );

      return comptroller.callStatic.liquidationIncentiveMantissa();
    }
  );

  return data;
};
