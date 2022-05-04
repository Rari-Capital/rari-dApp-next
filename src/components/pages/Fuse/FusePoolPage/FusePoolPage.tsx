// Chakra and UI
import { Box, Spinner, Text, HStack, Alert } from "@chakra-ui/react";
import { Column, Center, RowOrColumn } from "lib/chakraUtils";
import DashboardBox from "components/shared/DashboardBox";

// React
import { memo, useMemo } from "react";
import { useRouter } from "next/router";

// Rari
import { useRari } from "context/RariContext";

// Hooks
import { useFusePoolData } from "hooks/useFusePoolData";
import { useIsSemiSmallScreen } from "hooks/useIsSemiSmallScreen";
import { useTokensDataAsMap } from "hooks/useTokenData";
import {
  IncentivesData,
  usePoolIncentives,
} from "hooks/rewards/usePoolIncentives";

// Components
import FuseStatsBar from "../FuseStatsBar";
import FuseTabBar from "../FuseTabBar";

import { useIsComptrollerAdmin } from "hooks/fuse/useIsComptrollerAdmin";

import { AdminAlert, PendingAdminAlert } from "components/shared/AdminAlert";
import AppLink from "components/shared/AppLink";
import { EditIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { FuseUniV3Alert } from "./Banners/FuseUniV3Alert";
import { FuseRewardsBanner } from "./Banners/FuseRewardsBanner";
import { CollateralRatioBar } from "./Banners/CollateralRatioBar";
import { SupplyList } from "./SupplyList";
import { BorrowList } from "./BorrowList";
import { useConvexPoolIncentives } from "hooks/convex/useConvexRewards";
import { isWarnedComptroller } from "constants/fuse";

const FusePoolPage = memo(() => {
  const { isAuthed } = useRari();

  const isMobile = useIsSemiSmallScreen();
  const router = useRouter();

  let { poolId } = router.query;
  const data = useFusePoolData(poolId as string | undefined, true);

  const incentivesData: IncentivesData = usePoolIncentives(data?.comptroller);
  const { rewardTokens: rdRewardTokens } = incentivesData;

  const pluginIncentives = useConvexPoolIncentives(data?.comptroller);
  const {
    rewardTokens: pluginRewardTokens = [],
    hasIncentives: hasPluginIncentives,
  } = pluginIncentives ?? {};

  const rewardTokens = useMemo(
    () => [...rdRewardTokens, ...pluginRewardTokens],
    [pluginRewardTokens, rdRewardTokens]
  );
  const rewardTokensData = useTokensDataAsMap(rewardTokens);

  const isAdmin = useIsComptrollerAdmin(data?.comptroller);

  return (
    <>
      <Column
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        color="#FFFFFF"
        mx="auto"
        width={isMobile ? "100%" : "1150px"}
        px={isMobile ? 4 : 0}
      >
        <FuseStatsBar data={data} />
        {
          /* If they have some asset enabled as collateral, show the collateral ratio bar */
          data && data.assets.some((asset) => asset.membership) ? (
            <CollateralRatioBar
              assets={data.assets}
              borrowUSD={data.totalBorrowBalanceUSD}
            />
          ) : null
        }
        {!!data && isAdmin && (
          <AdminAlert
            isAdmin={isAdmin}
            isAdminText="You are the admin of this Fuse Pool!"
            rightAdornment={
              <Box h="100%" ml="auto" color="black">
                <AppLink
                  /* @ts-ignore */
                  href={router.asPath + "/edit"}
                >
                  <HStack>
                    <Text fontWeight="bold">Edit </Text>
                    <EditIcon />
                  </HStack>
                </AppLink>
              </Box>
            }
          />
        )}
        <Alert colorScheme={"yellow"} borderRadius={5} mt="5">
          <HStack>
            <WarningTwoIcon color="darkgoldenrod" mr={2} />
            <Text color="black">
              Borrowing is paused on all pools.{" "}
              {isWarnedComptroller(data?.comptroller) &&
                `Supplying ETH is paused for this pool. Some stablecoin deposits currently may be unrecoverable.`}{" "}
            </Text>
          </HStack>
        </Alert>
        {isWarnedComptroller(data?.comptroller) && (
          <Alert colorScheme={"yellow"} borderRadius={5} mt="5">
            <HStack>
              <WarningTwoIcon color="darkgoldenrod" mr={2} />
              <Text color="black">
                `Please be aware of available collateral asset liquidity when repaying borrows if you intend to withdraw.`
              </Text>
            </HStack>
          </Alert>
        )}
        {!!data && isAuthed && (
          <PendingAdminAlert comptroller={data?.comptroller} />
        )}
        {/* 
        {!!data && !isWarnedComptroller(data.comptroller) && (
          <FuseRewardsBanner
            rewardTokensData={rewardTokensData}
            hasPluginIncentives={hasPluginIncentives}
          />
        )}
        */}
        <FuseUniV3Alert assets={data?.assets ?? []} />
        <FuseTabBar />
        <RowOrColumn
          width="100%"
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          mt={4}
          isRow={!isMobile}
        >
          <DashboardBox width={isMobile ? "100%" : "50%"}>
            {data ? (
              <SupplyList
                assets={data.assets}
                comptrollerAddress={data.comptroller}
                supplyBalanceUSD={data.totalSupplyBalanceUSD.toNumber()}
                incentivesData={incentivesData}
                pluginIncentives={pluginIncentives}
                rewardTokensData={rewardTokensData}
              />
            ) : (
              <Center height="200px">
                <Spinner />
              </Center>
            )}
          </DashboardBox>

          <DashboardBox
            ml={isMobile ? 0 : 4}
            mt={isMobile ? 4 : 0}
            width={isMobile ? "100%" : "50%"}
          >
            {data ? (
              <BorrowList
                comptrollerAddress={data.comptroller}
                assets={data.assets}
                borrowBalanceUSD={data.totalBorrowBalanceUSD.toNumber()}
                incentivesData={incentivesData}
                rewardTokensData={rewardTokensData}
              />
            ) : (
              <Center height="200px">
                <Spinner />
              </Center>
            )}
          </DashboardBox>
        </RowOrColumn>
      </Column>
    </>
  );
});

export default FusePoolPage;
