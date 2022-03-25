import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";
import { constants } from "ethers";
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";
import { useQuery } from "react-query";

const useSafeHealth = (safe: SafeInfo | undefined) => {
  const { data } = useQuery(
    `safe Health for ${safe?.safeAddress}`,
    async () => {
      if (!safe) return;
      const ethUSD = await getEthUsdPriceBN();
      const collateralPriceETH = safe.collateralAmount.mul(
        safe.collateralPrice
      );
      const collateralPriceUSD = collateralPriceETH
        .mul(ethUSD)
        .div(constants.WeiPerEther);
      console.log({ ethUSD, collateralPriceETH, collateralPriceUSD });

      return collateralPriceUSD;
    }
  );

  return data;
};

export default useSafeHealth;
