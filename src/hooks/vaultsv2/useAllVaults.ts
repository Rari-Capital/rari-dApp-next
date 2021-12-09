import { useEffect, useState } from "react";
import { fetchVaults, GetVaultsResult_Vault } from "lib/vaultsv2/vaults";

const useAllVaults = () => {
  const [vaults, setVaults] = useState<GetVaultsResult_Vault[]>([]);

  useEffect(() => {
    fetchVaults().then(setVaults);
  }, []);

  return vaults;
};

export default useAllVaults;
