

import { useRari } from "context/RariContext";
import { useQuery } from "react-query";
import { createComptroller } from "utils/createComptroller";

export const useIsComptrollerAdmin = (comptrollerAddress?: string): boolean => {
  const { fuse, address } = useRari();

  const { data } = useQuery(comptrollerAddress + " admin", async () => {
    if (!comptrollerAddress) return undefined;

    const comptroller = createComptroller(comptrollerAddress, fuse);

    const admin = await comptroller.methods.admin().call();

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

    const comptroller = createComptroller(comptrollerAddress, fuse);

    const pendingAdmin = await comptroller.methods.pendingAdmin().call();

    return pendingAdmin;
  });

  if (!isAuthed) return false;
  return address === data;
};
