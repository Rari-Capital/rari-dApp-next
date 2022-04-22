import { Box, Center, Heading, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { ModalDivider } from "components/shared/Modal";
import PoolRow from "./PoolRow";

// Hooks
import { MergedPool } from "hooks/fuse/useFusePools";
import { useTranslation } from "next-i18next";

// Utils
import { Column, Row, useIsMobile } from "lib/chakraUtils";
import { filterPoolName } from "utils/fetchFusePoolData";
import { useState } from "react";

export const PoolList = ({ pools, infiniteScroll }: { pools: MergedPool[] | null | undefined, infiniteScroll?: boolean }) => {
  const { t } = useTranslation();

  const isMobile = useIsMobile();

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      expand
    >
      {infiniteScroll ? null :
      <Row
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        height="45px"
        width="100%"
        flexShrink={0}
        pl={4}
        pr={1}
      >
        <Text fontWeight="bold" width={isMobile ? "100%" : "40%"}>
          {!isMobile ? t("Pool Assets") : t("Pool Directory")}
        </Text>

        {isMobile ? null : (
          <>
            <Text fontWeight="bold" textAlign="center" width="13%">
              {t("Pool Number")}
            </Text>

            <Text fontWeight="bold" textAlign="center" width="16%">
              {t("Total Supplied")}
            </Text>

            <Text fontWeight="bold" textAlign="center" width="16%">
              {t("Total Borrowed")}
            </Text>

            {/* <Text fontWeight="bold" textAlign="center" width="15%">
              {t("Pool Risk Score")}
            </Text> */}
          </>
        )}
      </Row>
      }

      <ModalDivider />

      <Column
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        width="100%"
        h="100%"
      >
        {!!pools ? !!pools.length ? pools.map((pool, index) => {
          return (
            <PoolRow
              key={pool.id}
              poolNumber={pool.id}
              name={filterPoolName(pool.name)}
              tvl={pool.suppliedUSD}
              borrowed={pool.borrowedUSD}
              tokens={pool.underlyingTokens?.map((address, index) => ({
                symbol: pool.underlyingSymbols[index],
                address,
              })) ?? []}
              noBottomDivider={index === pools.length - 1}
              isWhitelisted={pool.whitelistedAdmin}
              comptroller={pool.comptroller}
              rewardTokens={pool.rewardTokens}
            />
          )
        }) : (
          <Box width="100%" height="90px" pl={4} pr={1} flexDir="row">
            <Center w="100%" h="100%">
              <Text>No Pools </Text>
            </Center>
          </Box>
        ) : (
          <Box width="100%" height="90px" pl={4} pr={1} flexDir="row">
            <Center>
              <Spinner />
            </Center>
          </Box>
        )
        }
      </Column>
    </Column>
  );
};
