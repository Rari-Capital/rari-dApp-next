import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { fetchFuseTVL } from "utils/fetchTVL";
import { Vaults, Fuse } from "../../esm/index";
import { fromWei } from "utils/ethersUtils";
import { BigNumber } from "@ethersproject/bignumber";
import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";

export const fetchFuseNumberTVL = async (rari: Vaults, fuse: Fuse) => {
  const tvlETH = await fetchFuseTVL(fuse);
  // console.log("fetchFuseNumberTVL", { tvlETH });

  const ethPrice: number = fromWei(await getEthUsdPriceBN()) as any;
  // console.log("fetchFuseNumberTVL", { ethPrice });

  const ans =
    (parseInt((tvlETH ?? BigNumber.from(0)).toString()) / 1e18) * ethPrice;
  // console.log("fetchFuseNumberTVL", { ans });

  return ans;
};

export const useFuseTVL = () => {
  const { rari, fuse } = useRari();

  return useQuery("fuseTVL", async () => {
    return fetchFuseNumberTVL(rari, fuse);
  });
};
