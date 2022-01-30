import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { useCreateComptroller } from "utils/createComptroller";

export const useIsUpgradeable = (comptrollerAddress: string) => {
  const { fuse, isAuthed } = useRari();

  const { data } = useQuery(comptrollerAddress + " isUpgradeable", async () => {
    const comptroller = useCreateComptroller(comptrollerAddress, fuse, isAuthed);

    const isUpgradeable: boolean =
      await comptroller.callStatic.adminHasRights();

    return isUpgradeable;
  });

  return data;
};
