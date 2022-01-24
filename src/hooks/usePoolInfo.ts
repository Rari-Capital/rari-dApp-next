// React
import { useMemo } from "react";
import { useTranslation } from "next-i18next";

// Constants
import { pools, PoolInterface } from "constants/pools";

// Hooks
import { usePoolsAPY } from "./usePoolAPY";
import { usePoolBalances, useTotalPoolsBalance } from "./usePoolBalance";
import { usePoolInterestEarned } from "./usePoolInterest";

// Rari
import { useRari } from "context/RariContext";
import { usePoolType } from "context/PoolContext";

// Utils
import { formatBalanceBN } from "utils/format";
import { shortUsdFormatter } from "utils/bigUtils";
import { PoolInterestEarned } from "utils/fetchPoolInterest";
import { getPoolLogo } from "utils/poolIconUtils";
import { Pool, getPoolName, getPoolCaption } from "utils/poolUtils";

// Ethers
import { BigNumber, constants } from 'ethers'
import useVaultsSDK from "./vaults/useVaultsSDK";

export const usePoolInfo = (poolType: Pool) => {
  const { t } = useTranslation();

  return useMemo(() => {
    const poolName = getPoolName(poolType, t);
    const poolCaption = getPoolCaption(poolType, t);
    const poolLogo = getPoolLogo(poolType);

    return { poolCaption, poolName, poolLogo, poolType };
  }, [poolType, t]);
};

export const usePoolInfoFromContext = () => {
  const poolType = usePoolType();
  return usePoolInfo(poolType);
};

export const usePoolInfos = (): PoolInterface[] => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      pools.map((pool: PoolInterface) => ({
        ...pool,
        title: t(pool.title),
        name: t(pool.name),
        caption: t(pool.caption),
      })),
    [t]
  );
};

export type AggregatePoolInfo = {
  poolInfo: PoolInterface;
  poolAPY: number | null;
  poolBalance: BigNumber | null;
  formattedPoolBalance: string | null;
  poolInterestEarned: BigNumber | null;
  formattedPoolInterestEarned: string | null;
  poolGrowth: number;
  formattedPoolGrowth: string | null;
};

export type PoolTotals = {
  balance: number;
  balanceFormatted: string;
  interestEarned: string | null;
  apy: string;
  growth: string;
};

export type AggregatePoolsInfoReturn = {
  aggregatePoolsInfo: AggregatePoolInfo[];
  totals: PoolTotals;
};

export const useAggregatePoolInfos = (): AggregatePoolsInfoReturn => {
  const { rari } = useVaultsSDK();
  const poolInfos = usePoolInfos();
  const poolAPYs = usePoolsAPY(poolInfos);
  const poolBalances = usePoolBalances(poolInfos);
  const poolsInterestEarned: PoolInterestEarned | undefined =
    usePoolInterestEarned();

  // Totals
  const { data: totalPoolsBalance } = useTotalPoolsBalance();

  const aggregatePoolsInfo = useMemo(
    () =>
      poolInfos.map((poolInfo: PoolInterface, index: number) => {
        // @ts-ignore
        const poolAPY: number | null = poolAPYs[index] ?? null;
        const poolBalance: BigNumber = poolBalances[index]?.data ?? constants.Zero;

        const formattedPoolBalance: string | null = formatBalanceBN(
          rari,
          poolBalance,
          poolInfo.type === Pool.ETH
        );

        // Right now we handle interest earned a little differently
        let poolInterestEarned;
        switch (poolInfo.type) {
          case Pool.STABLE:
            poolInterestEarned =
              poolsInterestEarned?.stablePoolInterestEarned ?? null;
            break;
          case Pool.YIELD:
            poolInterestEarned =
              poolsInterestEarned?.yieldPoolInterestEarned ?? null;
            break;
          default:
            poolInterestEarned =
              poolsInterestEarned?.ethPoolInterestEarnedInETH ?? null;
            break;
        }

        const formattedPoolInterestEarned = formatBalanceBN(
          rari,
          poolInterestEarned,
          poolInfo.type === Pool.ETH
        );

        // Growth for a pool = % increase between balance & (balance - interest earned)
        const poolGrowth: BigNumber =
          poolBalance && poolInterestEarned
            ? !poolBalance.isZero()
              ? constants.One.sub(
                  poolBalance.sub(poolInterestEarned).div(poolBalance)
                )
              : constants.Zero
            : constants.Zero;

        const formattedPoolGrowth = poolGrowth
          ? (parseFloat(poolGrowth.toString()) / 1e18).toFixed(2)
          : null;

        return {
          poolInfo,
          poolAPY: poolAPY ? parseFloat(poolAPY.toString()) : null,
          poolBalance,
          formattedPoolBalance,
          poolInterestEarned,
          formattedPoolInterestEarned,
          poolGrowth: parseFloat(poolGrowth.toString()) / 1e18,
          formattedPoolGrowth,
        };
      }),
    [rari, poolInfos, poolAPYs, poolBalances, poolsInterestEarned]
  );

  const totals = useMemo(
    () => ({
      balance: totalPoolsBalance ?? null,
      balanceFormatted: shortUsdFormatter(totalPoolsBalance) ?? null,
      interestEarned: formatBalanceBN(
        rari,
        poolsInterestEarned?.totalEarnings ?? null
      ),
      apy: "50%",
      growth: "50%",
    }),
    [totalPoolsBalance, poolsInterestEarned, rari]
  );

  return { totals, aggregatePoolsInfo };
};
