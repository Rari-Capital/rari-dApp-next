import { SimpleGrid } from "@chakra-ui/react";
import { Statistic } from "rari-components/standalone";

// Hooks
import { useMemo } from "react";
import { useRari } from "context/RariContext";
import { useBalanceOf } from "hooks/useBalanceOf";
import { TokenData } from "hooks/useTokenData";

// Turbo
import { getUserFeiOwed } from "lib/turbo/utils/getUserFeiOwed";
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";

// Utils
import { FEI } from "lib/turbo/utils/constants";
import { smallStringUsdFormatter, smallUsdFormatter } from "utils/bigUtils";
import { formatEther } from "ethers/lib/utils";
import { commify } from "ethers/lib/utils";
import useCollateralValueUSD from "hooks/turbo/useCollateralValueUSD";

export const SafeStats: React.FC<{ safe: SafeInfo, tokenData: TokenData | undefined }> = ({ safe, tokenData }) => {
    const { address } = useRari();

    const safeBalanceOfFei = useBalanceOf(safe.safeAddress, FEI)
    const userBalanceOfFei = useBalanceOf(address, FEI)

    const userFeiOwed = useMemo(() => getUserFeiOwed(safe), [safe])

    const collateralUSD = useCollateralValueUSD(safe)

    return (
        <SimpleGrid columns={3} spacingX='40px' spacingY='20px'>
            <Statistic
                title={"Total Collateralized"}
                value={`${commify(formatEther(safe.collateralAmount))} ${tokenData?.symbol} (${smallStringUsdFormatter(collateralUSD ?? 0)})`}
            />
            <Statistic
                title={"Safe boosted Amount"}
                value={`${formatEther(safe.boostedAmount)} ${tokenData?.symbol}`}
            />
            {/* <Statistic
          title={"Net APY"}
          value={`0%`}
        /> */}
            <Statistic
                title={"Claimable FEI"}
                value={smallUsdFormatter(formatEther(userFeiOwed))}
            />
            <Statistic
                title={"Safe Balance FEI"}
                value={formatEther(safeBalanceOfFei) + " FEI"}
            />
            <Statistic
                title={"User Balance FEI"}
                value={formatEther(userBalanceOfFei) + " FEI"}
            />
        </SimpleGrid>
    )
}