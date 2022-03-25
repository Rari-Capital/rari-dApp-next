import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";
import { constants } from "ethers";
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";
import { useQuery } from "react-query";

const useCollateralValueUSD = (safe: SafeInfo | undefined) => {
  const { data } = useQuery(
    `Collateral USD Value for ${safe?.safeAddress}`,
    async () => {
      if (!safe) return;
      const ethUSD = await getEthUsdPriceBN();
      //   const collateralPriceETH = safe.collateralAmount.mul(
      //     safe.collateralPrice
      //   );

      const collateralTokenPriceETH = safe.collateralPrice;
      const collateralTokenPriceUSD = collateralTokenPriceETH
        .mul(ethUSD)
        .div(constants.WeiPerEther)
        .div(constants.WeiPerEther);

      const collateralValueUSD = safe.collateralValue
        .mul(ethUSD)
        .div(constants.WeiPerEther)
        .div(constants.WeiPerEther);

      console.log({
        ethUSD,
        collateralTokenPriceETH,
        collateralTokenPriceUSD,
        collateralValueUSD,
        safe,
      });

      return parseFloat(collateralValueUSD.toString());
    }
  );

  return data;
};

export default useCollateralValueUSD;
