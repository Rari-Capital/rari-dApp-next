import { HStack, Spacer, VStack } from "@chakra-ui/react";
import { Statistic, Text } from "rari-components";

// Hooks
import { useMemo } from "react";
import { useRari } from "context/RariContext";
import { useBalanceOf } from "hooks/useBalanceOf";

// Turbo
import { getUserFeiOwed } from "lib/turbo/utils/getUserFeiOwed";
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";

// Utils
import { FEI } from "lib/turbo/utils/constants";
import { smallStringUsdFormatter, smallUsdFormatter } from "utils/bigUtils";
import { formatEther } from "ethers/lib/utils";
import useCollateralValueUSD from "hooks/turbo/useCollateralValueUSD";
import { useRariTokenData } from "rari-components/hooks";

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
    <HStack justify="start" align="flex-start" w="100%">
      <Statistic
        title={"Total Collateralized <i>"}
        subtitle="hi"
        value={
          <VStack align={"start"}>
            <Text fontSize={"2xl"}>{smallStringUsdFormatter(collateralUSD ?? 0)}</Text>
            <Text fontSize={"md"} color="grey" fontWeight="medium">{parseFloat(formatEther(safe.collateralAmount)).toFixed(2)} {tokenData?.symbol}</Text>
          </VStack>}
        tooltip="Hi"
        mr={10}
      />
      <Spacer />
      <Statistic
        title={"Claimable FEI <i> "}
        subtitle="hi"
        value={
          <VStack align={"start"}>
            <Text fontSize={"2xl"}>{smallUsdFormatter(formatEther(userFeiOwed))}</Text>
            <Text fontSize={"md"}  color="grey" fontWeight="medium">{parseFloat(formatEther(userFeiOwed)).toFixed(2)} FEI</Text>
          </VStack>}
        tooltip="Hi"
        mx={20}
      />
      <Spacer />
      <Statistic
        title={"Net APY <i>"}
        subtitle="hi"
        value={
          <VStack align={"start"}>
            <Text fontSize={"2xl"}>0%</Text>
          </VStack>}
        tooltip="Hi"
        mx={20}
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
