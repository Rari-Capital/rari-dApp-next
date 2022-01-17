import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { fetchFuseTVL } from "utils/fetchTVL";
import { Vaults, Fuse } from "../../esm/index";
import { fromWei } from "utils/ethersUtils";
import { BigNumber } from "@ethersproject/bignumber";
import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";

export const fetchFuseNumberTVL = async (fuse: Fuse) => {
  const tvlETH = await fetchFuseTVL(fuse);

  const ethPrice: number = fromWei(await getEthUsdPriceBN()) as any;

  const ans =
    (parseInt((tvlETH ?? BigNumber.from(0)).toString()) / 1e18) * ethPrice;

  return ans;
};

export const useFuseTVL = () => {
  const { fuse, chainId } = useRari();

  return useQuery("fuseTVL chain " + chainId, async () => {
    return fetchFuseNumberTVL(fuse);
  });
};
