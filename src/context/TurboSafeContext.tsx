import { useSafeInfo } from "hooks/turbo/useSafeInfo";
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
    const netAPY = Object.keys(activeStrategies).reduce((num, strategyAddress) => {
        const erc4626Strategy = getERC4626StrategyData[strategyAddress];
        if (
            erc4626Strategy
            && erc4626Strategy.supplyRatePerBlock
        ) {
            num += convertMantissaToAPY(erc4626Strategy.supplyRatePerBlock, 365);
        }
        return num / activeStrategies.length;
    }, 0);

    const isAtLiquidationRisk = safe?.safeUtilization?.gt(80) ?? false;

    const safeHealth = safe?.safeUtilization
    const colorScheme = useMemo(() => {
        return safeHealth?.lte(40)
            ? "success"
            : safeHealth?.lte(60)
                ? "whatsapp"
                : safeHealth?.lte(80)
                    ? "orange"
                    : "red";
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
        colorScheme
    }), [
        safe,
        collateralTokenData,
        loading,
        activeStrategies,
        getERC4626StrategyData,
        netAPY,
        isAtLiquidationRisk,
        colorScheme
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
