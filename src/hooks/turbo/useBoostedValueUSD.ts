import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";
import { constants } from "ethers";
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";
import { useQuery } from "react-query";

export const useBoostedValueUSD = (safe: SafeInfo | undefined) => {
  const { data } = useQuery(
    `Boosted USD Value for ${safe?.safeAddress}`,
    async () => {
      if (!safe) return;
      const ethUSD = await getEthUsdPriceBN();

      const boostedTokenPriceETH = safe.feiPrice;
      const boostedTokenPriceUSD = boostedTokenPriceETH
        .mul(ethUSD)
        .div(constants.WeiPerEther)
        .div(constants.WeiPerEther);

      const boostedValueUSD = safe.boostedAmount
        .mul(safe.feiPrice)
        .mul(ethUSD)
        .div(constants.WeiPerEther)
        .div(constants.WeiPerEther)
        .div(constants.WeiPerEther);

      // console.log({
      //   ethUSD,
      //   boostedTokenPriceETH,
      //   boostedTokenPriceUSD,
      //   boostedValueUSD,
      //   safe,
      // });

      return parseFloat(boostedValueUSD.toString());
    }
  );

  return data;
};

export default useBoostedValueUSD;
