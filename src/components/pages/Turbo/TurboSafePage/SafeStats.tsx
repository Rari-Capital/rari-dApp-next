import { useRari } from "context/RariContext";
import { commify, formatEther } from "ethers/lib/utils";
import { useBalanceOf } from "hooks/useBalanceOf";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
// Utils
import { FEI } from "lib/turbo/utils/constants";
// Turbo
import { getUserFeiOwed } from "lib/turbo/utils/getUserFeiOwed";
import { Statistic } from "rari-components";
// Hooks
import { useMemo } from "react";
import { smallStringUsdFormatter, smallUsdFormatter } from "utils/bigUtils";
import { HStack } from "@chakra-ui/react";
import { TokenData } from "hooks/useTokenData";
import { useUserFeiOwed } from "hooks/turbo/useUserFeiOwed";

type SafeStatsProps = {
  safe: USDPricedTurboSafe;
  netAPY: number;
  tokenData?: TokenData;
};

export const SafeStats: React.FC<SafeStatsProps> = ({ safe, netAPY, tokenData }) => {
  const { address } = useRari();

  console.log({ netAPY })

  const safeBalanceOfFei = useBalanceOf(safe.safeAddress, FEI);
  const userBalanceOfFei = useBalanceOf(address, FEI);
  const userFeiOwed = useUserFeiOwed(safe)

  return (
    <HStack h="100%" w="100%" spacing={12} align="flex-start">
      <Statistic
        title={"Total Collateralized"}
        value={smallStringUsdFormatter(safe.collateralUSD)}
        secondaryValue={`${commify(
          parseFloat(formatEther(safe.collateralAmount)).toFixed(2)
        )} ${tokenData?.symbol}`}
        tooltip={`Total Collateralized ${tokenData?.symbol}`}
      />

      <Statistic
        title={"Claimable FEI"}
        value={smallUsdFormatter(formatEther(userFeiOwed))}
        secondaryValue={`${commify(
          parseFloat(formatEther(userFeiOwed)).toFixed(2)
        )} FEI`}
        tooltip="Sum of all claimable FEI across all boosted strategies after TribeDAO Revenue Split."
        mr={20}
      />

      <Statistic
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
