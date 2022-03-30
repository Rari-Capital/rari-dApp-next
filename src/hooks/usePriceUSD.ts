import { useQuery } from "react-query";
import { BigNumber } from "ethers";
import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";

export const usePriceUSD = (
    priceETH: BigNumber,
): number | undefined => {
    const { data: priceUSD } = useQuery(
        `price ${priceETH} in USD`,
        async () => {
            if (!priceETH) return
            const ethUSD = await getEthUsdPriceBN();
            const priceUSD = parseFloat(ethUSD.toString()) * parseFloat(priceETH.toString()) / 1e36
            return priceUSD
        }
    );
    return priceUSD;
};
