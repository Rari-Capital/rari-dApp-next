import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { fromWei } from "utils/ethersUtils";
import { Vaults } from "../../esm/index";
import { ChainID } from "esm/utils/networks";

export const fetchPool2UnclaimedRGT = async ({
  rari,
  address,
}: {
  rari: Vaults;
  address: string;
}) => {
  return parseFloat(
    fromWei(
      await rari.governance.rgt.sushiSwapDistributions.getUnclaimed(address)
    )
  );
};

export const usePool2UnclaimedRGT = () => {
  const { rari, address, chainId } = useRari();

  const { data: earned } = useQuery(
    address + " pool2Unclaimed RGT " + chainId,
    async () => {
      if (chainId !== ChainID.ETHEREUM) return 0;
      return await fetchPool2UnclaimedRGT({ rari, address });
    }
  );

  return earned;
};
