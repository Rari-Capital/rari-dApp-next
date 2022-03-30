
import Statistic from "lib/components/Statistic"

import { useRari } from "context/RariContext";
import { formatEther } from "ethers/lib/utils";
import useCollateralValueUSD from "hooks/turbo/useCollateralValueUSD";
import { useBalanceOf } from "hooks/useBalanceOf";
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";
// Utils
import { FEI } from "lib/turbo/utils/constants";
// Turbo
import { getUserFeiOwed } from "lib/turbo/utils/getUserFeiOwed";
import { useRariTokenData } from "rari-components/hooks";
// Hooks
import { useMemo } from "react";
import { smallStringUsdFormatter, smallUsdFormatter } from "utils/bigUtils";
import { HStack, Spacer, VStack } from "@chakra-ui/react";

type SafeStatsProps = {
  safe: SafeInfo;
};

export const SafeStats: React.FC<SafeStatsProps> = ({ safe }) => {
  const { address } = useRari();
  const { data: tokenData } = useRariTokenData(safe.collateralAsset);

  const safeBalanceOfFei = useBalanceOf(safe.safeAddress, FEI);
  const userBalanceOfFei = useBalanceOf(address, FEI);

  const userFeiOwed = useMemo(() => getUserFeiOwed(safe), [safe]);

  const collateralUSD = useCollateralValueUSD(safe);

  return (
    <HStack>
      <Statistic
        title={"Total Collateralized"}
        secondaryValue={`${parseFloat(
          formatEther(safe.collateralAmount)
        ).toFixed(2)} ${tokenData?.symbol}`}
        value={smallStringUsdFormatter(collateralUSD ?? 0)}
        tooltip="Hi"
        mr={1}

      />
      <Spacer />
      <Statistic
        title={"Claimable FEI"}
        value={smallUsdFormatter(formatEther(userFeiOwed))}
        secondaryValue={`${parseFloat(formatEther(userFeiOwed)).toFixed(
          2
        )} FEI`}
        tooltip="Sum of all earned FEI across all boosted strategies after Revenue Split"
        mr={1}
      />
      <Spacer />
      <Statistic
        title={"Net APY"}
        value="0%"
        tooltip="Hi"
        mr={1}
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
