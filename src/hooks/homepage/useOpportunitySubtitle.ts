import { useMemo } from "react";
import {
  HomepageOpportunity,
  HomepageOpportunityType,
} from "constants/homepage";
import { usePoolAPY } from "hooks/usePoolAPY";
import { useFusePoolData } from "hooks/useFusePoolData";
import { FusePoolMetric } from "utils/fetchFusePoolData";
import { shortUsdFormatter } from "utils/bigUtils";
import { useFuseTVL } from "hooks/fuse/useFuseTVL";
import { usePoolsAPY } from "hooks/usePoolAPY";
import { usePoolInfos } from "hooks/usePoolInfo";
import { useRari } from "context/RariContext";

export const useOpportunitySubtitle = (
  opportunity: HomepageOpportunity
): string | null => {
  const { fuse, chainId } = useRari()
  // // Earn
  // const earnPoolAPY = usePoolAPY(opportunity.vaultType);
  // const poolInfos = usePoolInfos();
  // const poolsAPY = usePoolsAPY(poolInfos);

  // // Fuse
  // const fusePoolData = useFusePoolData(opportunity.fusePoolId?.toString());
  // const { data: fuseTVL } = useFuseTVL();
    switch (opportunity.type) {
      case HomepageOpportunityType.EarnVault:
        {
          const earnPoolAPY = usePoolAPY(opportunity.vaultType);
          return earnPoolAPY ? `${earnPoolAPY}% APY` : null;
        }
      case HomepageOpportunityType.FusePool: {
        console.log("RUNNING BRRR", {opportunity, fuse, chainId} )
        const fusePoolData = useFusePoolData(opportunity.fusePoolId?.toString());
      
        switch (opportunity.fuseMetric) {
          case FusePoolMetric.TotalBorrowedUSD: 
            return fusePoolData?.totalBorrowedUSD
              ? `${shortUsdFormatter(
                  fusePoolData.totalBorrowedUSD.toNumber()
                )} borrowed`
              : null;
          case FusePoolMetric.TotalSuppliedUSD:
            return fusePoolData?.totalSuppliedUSD
              ? `${shortUsdFormatter(
                  fusePoolData.totalSuppliedUSD.toNumber()
                )} supplied`
              : null;
          case FusePoolMetric.TotalLiquidityUSD:
            return fusePoolData?.totalLiquidityUSD
              ? `${shortUsdFormatter(
                  fusePoolData.totalLiquidityUSD.toNumber()
                )} liquidity`
              : null;
          default:
            return fusePoolData?.totalSuppliedUSD
              ? `${shortUsdFormatter(
                  fusePoolData.totalSuppliedUSD.toNumber()
                )} supplied`
              : null;
        }
      }
      case HomepageOpportunityType.EarnPage: {
        const poolInfos = usePoolInfos();
        const poolsAPY = usePoolsAPY(poolInfos);
        console.log({poolsAPY, poolInfos})
        // @ts-ignore
        const apys = poolsAPY.filter((obj) => obj).map(parseFloat);
        const maxAPY = !!apys.length ? Math.max.apply(null, apys) : null;
        return maxAPY ? `${maxAPY}% APY` : null;
      }
      case HomepageOpportunityType.FusePage: {
        const { data: fuseTVL } = useFuseTVL();
        return (fuseTVL !== undefined || fuseTVL !== null) ? `${shortUsdFormatter(fuseTVL!)} TVL` : null;
      }
      case HomepageOpportunityType.Arbitrum:
        return "Now live!";

      case HomepageOpportunityType.Connext:
        return "via Connext";

      case HomepageOpportunityType.PegExchanger:
        return "Join the Tribe";

      default:
        return null;
}};
