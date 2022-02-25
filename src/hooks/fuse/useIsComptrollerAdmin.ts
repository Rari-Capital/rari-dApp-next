import { useRari } from "context/RariContext";
import { useQuery } from "react-query";
import { useCreateComptroller } from "utils/createComptroller";

export const useIsComptrollerAdmin = (comptrollerAddress?: string): boolean => {
  const { fuse, address, isAuthed } = useRari();

  const { data } = useQuery(comptrollerAddress + " admin", async () => {
    if (!comptrollerAddress) return undefined;

    const comptroller = useCreateComptroller(
      comptrollerAddress,
      fuse,
      isAuthed
    );

    const admin = await comptroller.callStatic.admin();

    return admin;
  });

  return address === data;
};

export const useIsComptrollerPendingAdmin = (
  comptrollerAddress?: string
): boolean => {
  const { fuse, address, isAuthed } = useRari();

  const { data } = useQuery(comptrollerAddress + " pending admin", async () => {
    if (!comptrollerAddress) return undefined;

    const comptroller = useCreateComptroller(
      comptrollerAddress,
      fuse,
      isAuthed
    );

    const pendingAdmin = await comptroller.callStatic.pendingAdmin();

    return pendingAdmin;
  });

  if (!isAuthed) return false;
  return address === data;
};
