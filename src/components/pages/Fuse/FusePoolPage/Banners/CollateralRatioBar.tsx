import { BigNumber, constants } from 'ethers';
import { useBorrowLimit } from 'hooks/useBorrowLimit';
import LogRocket from 'logrocket';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo } from 'react'
import { USDPricedFuseAsset } from 'utils/fetchFusePoolData';

// Chakra and UI
import {
    Box,
    Progress,
    Text,
  } from "@chakra-ui/react";
  import { Row,  } from "lib/chakraUtils";
  import DashboardBox from "components/shared/DashboardBox";
  import { SimpleTooltip } from "components/shared/SimpleTooltip";
import { smallUsdFormatter } from 'utils/bigUtils';
import { toInt } from 'utils/ethersUtils';
  

   export const CollateralRatioBar = ({
        assets,
        borrowUSD,
      }: {
        assets: USDPricedFuseAsset[];
        borrowUSD: BigNumber;
      }) => {
        const { t } = useTranslation();
      
        const maxBorrow = useBorrowLimit(assets);
        const ratio = useMemo(() => !maxBorrow.isZero() ? borrowUSD.mul(100).div(maxBorrow) : constants.Zero, [maxBorrow, borrowUSD]);
      
        useEffect(() => {
          if (ratio.gt(95)) {
            LogRocket.track("Fuse-AtRiskOfLiquidation");
          }
        }, [ratio]);
      
        return (
          <DashboardBox width="100%" height="65px" mt={4} p={4}>
            <Row mainAxisAlignment="flex-start" crossAxisAlignment="center" expand>
              <SimpleTooltip
                label={t("Keep this bar from filling up to avoid being liquidated!")}
              >
                <Text flexShrink={0} mr={4}>
                  {t("Borrow Limit")}
                </Text>
              </SimpleTooltip>
      
              <SimpleTooltip label={t("This is how much you have borrowed.")}>
                <Text flexShrink={0} mt="2px" mr={3} fontSize="10px">
                  {
                    smallUsdFormatter(parseFloat(borrowUSD.toString())) //smallUsdFormatter
                  }
                </Text>
              </SimpleTooltip>
      
              <SimpleTooltip
                label={`You're using ${ratio.toString()}% of your ${smallUsdFormatter(
                  parseFloat(maxBorrow.toString())
                )} borrow limit.`}
              >
                <Box width="100%">
                  <Progress
                    size="xs"
                    width="100%"
                    colorScheme={
                      ratio.lte(40)
                        ? "whatsapp"
                        : ratio.lte(60)
                          ? "yellow"
                          : ratio.lte(80)
                            ? "orange"
                            : "red"
                    }
                    borderRadius="10px"
                    value={toInt(ratio)}
                  />
                </Box>
              </SimpleTooltip>
      
              <SimpleTooltip
                label={t(
                  "If your borrow amount reaches this value, you will be liquidated."
                )}
              >
                <Text flexShrink={0} mt="2px" ml={3} fontSize="10px">
                  {smallUsdFormatter(parseFloat(maxBorrow.toString()))}
                </Text>
              </SimpleTooltip>
            </Row>
          </DashboardBox>
        );
      };