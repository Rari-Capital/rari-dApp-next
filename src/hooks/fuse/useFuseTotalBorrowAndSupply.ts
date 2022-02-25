import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { Fuse } from "../../esm/index";
import { fromWei } from "utils/ethersUtils";
import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";

export const fetchFuseTotalBorrowAndSupply = async ({
  fuse,
  address,
}: {
  fuse: Fuse;
  address: string;
}) => {
  const [{ 0: supplyETH, 1: borrowETH }, ethPrice] = await Promise.all([
    fuse.contracts.FusePoolLens.callStatic.getUserSummary(address),

    fromWei(await getEthUsdPriceBN()) as any,
  ]);

  return {
    totalSuppliedUSD: (supplyETH / 1e18) * ethPrice,
    totalBorrowedUSD: (borrowETH / 1e18) * ethPrice,
  };
};

export const useFuseTotalBorrowAndSupply = () => {
  const { fuse, address } = useRari();

  const { data, isLoading, isError } = useQuery(
    address + " totalBorrowAndSupply",
    async () => fetchFuseTotalBorrowAndSupply({ fuse, address })
  );

  return { data, isLoading, isError };
};
