import { BigNumber } from "ethers";
import { formatEther, formatUnits } from "ethers/lib/utils";
import useSafeAvgAPY from "hooks/turbo/useSafeAvgAPY";
import { useSafeInfo } from "hooks/turbo/useSafeInfo";
import { useUserIsSafeOwner } from "hooks/turbo/useSafeOwner";
import useShouldBoostSafe from "hooks/turbo/useShouldBoostSafe";
import {
  StrategyInfosMap,
  useERC4626StrategiesDataAsMap,
} from "hooks/turbo/useStrategyInfo";
import { useUserFeiOwed } from "hooks/turbo/useUserFeiOwed";
import { TokenData, useTokenData } from "hooks/useTokenData";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import {
  filterUsedStrategies,
  StrategyInfo,
} from "lib/turbo/fetchers/strategies/formatStrategyInfo";
import { createContext, useContext, ReactNode, useMemo } from "react";

export const getSafeColor = (safeHealth: BigNumber | undefined) => {
  return safeHealth?.lte(40)
    ? "#4DD691"
    : safeHealth?.lte(60)
    ? "#4DD691"
    : safeHealth?.lte(80)
    ? "orange"
    : "#DB6464";
};

type TurboSafeContextData = {
  // Raw safe data from Lens
  safe: SafeInfo | undefined;

  // USD Priced safe Data from lens
  usdPricedSafe: USDPricedTurboSafe | undefined;

  // Fetched token data about collateral asset
  collateralTokenData: TokenData | undefined;

  // Loading state
  loading: boolean;

  // List of Active Strats
  activeStrategies: StrategyInfo[];

  // Fuse ERC 4626 Data about strategies
  getERC4626StrategyData: StrategyInfosMap;

  // Net APY of safe
  netAPY: number;

  // bools
  isAtLiquidationRisk: boolean;
  shouldBoost: boolean;
  isUserAdmin: boolean;

  // Colors to display based on safe Health
  colorScheme: string;

  totalFeiOwed: BigNumber;
};

export const TurboSafeContext = createContext<TurboSafeContextData | undefined>(
  undefined
);

export const TurboSafeProvider = ({
  safeAddress,
  children,
}: {
  safeAddress: string;
  children: ReactNode;
}) => {
  /** General Safe Data **/
  const safe = useSafeInfo(safeAddress);
  const collateralTokenData = useTokenData(safe?.collateralAsset);
  const isUserAdmin = useUserIsSafeOwner(safeAddress);
  const loading = !collateralTokenData || !safe;

  // Strategies
  const activeStrategies = filterUsedStrategies(safe?.strategies);
  const getERC4626StrategyData = useERC4626StrategiesDataAsMap(
    safe?.strategies.map((strat) => strat.strategy) ?? []
  );

  // Average APY across all active Fuse strategies
  const netAPY = useSafeAvgAPY(
    activeStrategies,
    getERC4626StrategyData,
    parseFloat(formatEther(safe?.tribeDAOFee ?? 0))
  );

  /** Safe metadata **/
  const isAtLiquidationRisk = safe?.safeUtilization?.gt(80) ?? false;
  const shouldBoost = useShouldBoostSafe(safe);
  const safeHealth = safe?.safeUtilization;
  const colorScheme = useMemo(
    () => getSafeColor(safe?.safeUtilization),
    [safeHealth]
  );

  const [totalFeiOwed] = useUserFeiOwed(safe);

  /**  Boost / Less **/

  const value = useMemo<TurboSafeContextData>(
    () => ({
      safe,
      usdPricedSafe: safe,
      collateralTokenData,
      loading,
      activeStrategies,
      getERC4626StrategyData,
      netAPY,
      isAtLiquidationRisk,
      colorScheme,
      shouldBoost,
      isUserAdmin,
      totalFeiOwed,
    }),
    [
      safe,
      collateralTokenData,
      loading,
      activeStrategies,
      getERC4626StrategyData,
      netAPY,
      isAtLiquidationRisk,
      colorScheme,
      shouldBoost,
      isUserAdmin,
      totalFeiOwed,
    ]
  );

  return (
    <TurboSafeContext.Provider value={value}>
      {children}
    </TurboSafeContext.Provider>
  );
};

export const useTurboSafe = () => {
  const turboSafeData = useContext(TurboSafeContext);

  if (turboSafeData === undefined) {
    throw new Error(`useTurboSafe must be used within a TurboSafeProvider`);
  }

  return turboSafeData;
};
