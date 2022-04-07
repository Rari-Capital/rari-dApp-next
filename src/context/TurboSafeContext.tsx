import { formatEther, formatUnits } from "ethers/lib/utils";
import useSafeAvgAPY from "hooks/turbo/useSafeAvgAPY";
import { useSafeInfo } from "hooks/turbo/useSafeInfo";
import useShouldBoostSafe from "hooks/turbo/useShouldBoostSafe";
import { StrategyInfosMap, useERC4626StrategiesDataAsMap } from "hooks/turbo/useStrategyInfo";
import { TokenData, useTokenData } from "hooks/useTokenData";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import { filterUsedStrategies, StrategyInfo } from "lib/turbo/fetchers/strategies/formatStrategyInfo";
import { createContext, useContext, ReactNode, useMemo } from "react";
import { convertMantissaToAPY } from "utils/apyUtils";
import { Pool } from "../utils/poolUtils";

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
    activeStrategies: StrategyInfo[]

    // Fuse ERC 4626 Data about strategies
    getERC4626StrategyData: StrategyInfosMap

    // Net APY of safe
    netAPY: number;

    // 
    isAtLiquidationRisk: boolean
    shouldBoost: boolean

    // Colors to display based on safe Health
    colorScheme: string;
}

export const TurboSafeContext = createContext<TurboSafeContextData | undefined>(undefined);

export const TurboSafeProvider = ({
    safeAddress,
    children,
}: {
    safeAddress: string;
    children: ReactNode;
}) => {

    const safe = useSafeInfo(safeAddress);
    const collateralTokenData = useTokenData(safe?.collateralAsset);
    const loading = !collateralTokenData || !safe;

    // Strategies
    const activeStrategies = filterUsedStrategies(safe?.strategies)
    const getERC4626StrategyData = useERC4626StrategiesDataAsMap(
        safe?.strategies.map((strat) => strat.strategy) ?? []
    );

    // Average APY across all active Fuse strategies
    // TODO(@sharad-s) - refactor into a hook
    const netAPY = useSafeAvgAPY(
        activeStrategies,
        getERC4626StrategyData,
        parseFloat(formatEther(safe?.tribeDAOFee ?? 0))
    )

    const isAtLiquidationRisk = safe?.safeUtilization?.gt(80) ?? false;
    const shouldBoost = useShouldBoostSafe(safe)

    const safeHealth = safe?.safeUtilization
    const colorScheme = useMemo(() => {
        return safeHealth?.lte(40)
            ? "#4DD691"
            : safeHealth?.lte(60)
                ? "#4DD691"
                : safeHealth?.lte(80)
                    ? "orange"
                    : "#DB6464";
    }, [safeHealth]);


    const value = useMemo<TurboSafeContextData>(() => ({
        safe,
        usdPricedSafe: safe,
        collateralTokenData,
        loading,
        activeStrategies,
        getERC4626StrategyData,
        netAPY,
        isAtLiquidationRisk,
        colorScheme,
        shouldBoost
    }), [
        safe,
        collateralTokenData,
        loading,
        activeStrategies,
        getERC4626StrategyData,
        netAPY,
        isAtLiquidationRisk,
        colorScheme,
        shouldBoost
    ])


    return (
        <TurboSafeContext.Provider value={value}>{children}</TurboSafeContext.Provider>
    );
};

export const useTurboSafe = () => {
    const turboSafeData = useContext(TurboSafeContext);

    if (turboSafeData === undefined) {
        throw new Error(`useTurboSafe must be used within a TurboSafeProvider`);
    }

    return turboSafeData;
};
