import { commify, formatEther, formatUnits } from "ethers/lib/utils";
import { Statistic } from "rari-components";
// Hooks
import { smallStringUsdFormatter, smallUsdFormatter } from "utils/bigUtils";
import { HStack } from "@chakra-ui/react";
import { useUserFeiOwed } from "hooks/turbo/useUserFeiOwed";
import { useTurboSafe } from "context/TurboSafeContext";


export const SafeStats: React.FC = () => {
  const { usdPricedSafe, netAPY, collateralTokenData, loading } = useTurboSafe()

  const [userFeiOwed] = useUserFeiOwed(usdPricedSafe)

  return (
    <HStack h="100%" w="100%" spacing={12} align="flex-start">
      <Statistic
        loading={loading}
        title={"Total Collateralized"}
        value={smallStringUsdFormatter(usdPricedSafe?.collateralValueUSD ?? 0)}
        secondaryValue={`${commify(
          parseFloat(formatEther(usdPricedSafe?.collateralAmount ?? 0)).toFixed(2)
        )} ${collateralTokenData?.symbol}`}
        tooltip={`Total Collateralized ${collateralTokenData?.symbol}`}
      />

      <Statistic
        loading={loading}
        title={"Claimable FEI"}
        value={smallUsdFormatter(formatEther(userFeiOwed))}
        secondaryValue={`${commify(
          parseFloat(formatEther(userFeiOwed)).toFixed(3)
        )} FEI`}
        tooltip={`Sum of all claimable FEI across all boosted strategies after after ${formatUnits(usdPricedSafe?.tribeDAOFee ?? 0, 16)}% TribeDAO Revenue Split.`}
        mr={20}
      />

      <Statistic
        loading={loading}
        title={"Avg. APY"}
        value={netAPY.toFixed(2) + "%"}
        tooltip="Average APY earned across all active strategies."
        mr={10}
        h="100%"
      />
      {/* <Statistic
        title={"Safe Balance FEI"}
        value={formatEther(safeBalanceOfFei) + " FEI"}
      />
      <Statistic
        title={"User Balance FEI"}
        value={formatEther(userBalanceOfFei) + " FEI"}
      /> */}
    </HStack>
  );
};
