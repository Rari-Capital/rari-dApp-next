
import Statistic from "lib/components/Statistic"
import { useRari } from "context/RariContext";
import { commify, formatEther } from "ethers/lib/utils";
import { HStack, Spacer, VStack } from "@chakra-ui/react";

// Utils
import { FEI } from "lib/turbo/utils/constants";
// Turbo
import { getUserFeiOwed } from "lib/turbo/utils/getUserFeiOwed";
import { useRariTokenData } from "rari-components/hooks";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
// Hooks
import { useMemo } from "react";
import { useBalanceOf } from "hooks/useBalanceOf";
import { smallStringUsdFormatter, smallUsdFormatter } from "utils/bigUtils";

type SafeStatsProps = {
  safe: USDPricedTurboSafe;
};

export const SafeStats: React.FC<SafeStatsProps> = ({ safe }) => {
  const { address } = useRari();
  const { data: tokenData } = useRariTokenData(safe.collateralAsset);

  const safeBalanceOfFei = useBalanceOf(safe.safeAddress, FEI);
  const userBalanceOfFei = useBalanceOf(address, FEI);

  const userFeiOwed = useMemo(() => getUserFeiOwed(safe), [safe]);

  return (
    <HStack h="100%" w="100%" py={4}>
      <Statistic
        title={"Total Collateralized"}
        value={smallStringUsdFormatter(safe.collateralUSD)}
        secondaryValue={`${commify(
          parseFloat(
            formatEther(safe.collateralAmount)
          ).toFixed(2)
        )
          } ${tokenData?.symbol}`}
        tooltip="Hi"
        mr={10}
      />
      <Statistic
        title={"Claimable FEI"}
        value={smallUsdFormatter(formatEther(userFeiOwed))}
        secondaryValue={`${commify(parseFloat(formatEther(userFeiOwed)).toFixed(
          2
        ))} FEI`}
        tooltip="Sum of all earned FEI across all boosted strategies after Revenue Split"
        mr={20}
      />
      <Statistic
        title={"Net APY"}
        value="0%"
        tooltip="Hi"
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
