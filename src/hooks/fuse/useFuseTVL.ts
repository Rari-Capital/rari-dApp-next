import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { fetchFuseTVL } from "utils/fetchTVL";
import { Vaults, Fuse } from "../../esm/index";
import { fromWei } from "utils/ethersUtils";
import { BigNumber } from "@ethersproject/bignumber";

export const fetchFuseNumberTVL = async (rari: Vaults, fuse: Fuse) => {
  const tvlETH = await fetchFuseTVL(fuse);

  const ethPrice: number = fromWei(await rari.getEthUsdPriceBN()) as any;

  return (parseInt((tvlETH ?? BigNumber.from(0)).toString()) / 1e18) * ethPrice;
};

export const useFuseTVL = () => {
  const { rari, fuse } = useRari();

  return useQuery("fuseTVL", async () => {
    return fetchFuseNumberTVL(rari, fuse);
  });
};
