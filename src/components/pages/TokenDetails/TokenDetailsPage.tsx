import {
  Avatar,
  Box,
  Heading,
  Link,
  Image,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { Center, Column, Row, RowOrColumn } from "lib/chakraUtils";
import { useIsSmallScreen } from "hooks/useIsSmallScreen";

import { TokenData } from "hooks/useTokenData";
import MarketChart from "components/modules/MarketChart";
import DashboardBox from "components/shared/DashboardBox";
import { makeGqlRequest } from "utils/gql";
import useSWR from "swr";
import { useState } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import AppLink from "components/shared/AppLink";
import { useDeployVault, useIsVaultCreated } from "lib/vaultsv2";
import { useRari } from "context/RariContext";
import FusePoolListForToken from "./FusePoolListForToken";
import {
  GET_BEST_CTOKENS_FOR_UNDERLYING,
  GQLBestCTokenForUnderlyings,
} from "gql/ctokens/getBestCTokensForUnderlying";
import AvatarWithBadge from "components/shared/Icons/AvatarWithBadge";

const fetchBestCTokensForUnderlying = async (tokenAddress: string) => {
  const data: GQLBestCTokenForUnderlyings = await makeGqlRequest(
    GET_BEST_CTOKENS_FOR_UNDERLYING,
    {
      tokenAddress,
    }
  );
  return data;
};

const useBestCTokensForUnderlying = (tokenAddress: string) => {
  const { data, error } = useSWR(
    [tokenAddress.toLowerCase(), "best"],
    fetchBestCTokensForUnderlying
  );

  const { bestSupplyAPY, bestBorrowAPR, bestLTV }: GQLBestCTokenForUnderlyings =
    data ?? {
      bestSupplyAPY: [],
      bestBorrowAPR: [],
      bestLTV: [],
    };

  const bestSupplyCToken = bestSupplyAPY?.[0];
  const bestBorrowCToken = bestBorrowAPR?.[0];
  const bestLTVCToken = bestLTV?.[0];

  const ret = { bestSupplyCToken, bestBorrowCToken, bestLTVCToken };
  return ret;
};

const TokenDetails = ({ token }: { token: TokenData }) => {
  const isMobile = useIsSmallScreen();
  const { fuse } = useRari();

  const { bestSupplyCToken, bestBorrowCToken, bestLTVCToken } =
    useBestCTokensForUnderlying(token.address);

  const isVaultCreated = useIsVaultCreated(token.address);
  const { deployVault, isDeploying } = useDeployVault();

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="center"
      color="#FFFFFF"
      mx="auto"
      mt={5}
      width="100%"
      px={isMobile ? 3 : 10}
    >
      {/* Header */}
      <Header isMobile={isMobile} tokenData={token} />

      <RowOrColumn
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        isRow={!isMobile}
        width="100%"
        h="100%"
        // bg="red"
      >
        {/* Column 1 */}
        <Column
          width="100%"
          height="100%"
          mainAxisAlignment="center"
          crossAxisAlignment="flex-start"
          p={2}
          flexBasis={"70%"}
          flexGrow={0}
          mr={3}
        >
          {/* Chart */}
          <MarketChart token={token} mb={5} />

          {/* Fuse Pools */}
          {/* <AssetOpportunities token={token} /> */}
        </Column>

        {/* Column 2 */}
        <VStack
          width="100%"
          height="100%"
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          p={2}
          flexBasis={"30%"}
          flexGrow={1}
          bg=""
          ml={3}
        >
          <AppLink
            href={`/vaults/${token.address}`}
            as={DashboardBox}
            h="130px"
            w="100%"
            mb={2}
            _hover={{
              transform: "scale(1.02)",
              cursor: "pointer",
            }}
            // onClick={() =>
            //   isVaultCreated ? undefined : deployVault(token.address)
            // }
          >
            <Center h="100%">
              {isVaultCreated ? (
                <Heading color={token.color}>Enter Vault</Heading>
              ) : (
                <VStack>
                  {isDeploying ? (
                    <Text>Deploying Vault</Text>
                  ) : (
                    <>
                      <Text>Vault not yet created</Text>
                      <Heading color={token.color}>Create Vault</Heading>
                    </>
                  )}
                </VStack>
              )}
            </Center>
          </AppLink>

          <DashboardBox h="100%" w="100%" px={5} py={3} flexGrow={1} mt={2}>
            <Heading mb={2}>{"Lend & Borrow"}</Heading>
            <VStack h="100%" w="100%" mt={2}>
              <CTokenBox
                title={"Best Supply APY"}
                subtitle={
                  !!bestSupplyCToken?.supplyAPY
                    ? `${parseFloat(bestSupplyCToken.supplyAPY).toFixed(2)}%`
                    : undefined
                }
                href={
                  bestSupplyCToken
                    ? `/fuse/pool/${bestSupplyCToken.pool.index}`
                    : "#"
                }
              />
              <CTokenBox
                title={"Best Borrow APR"}
                subtitle={
                  !!bestBorrowCToken?.borrowAPR
                    ? `${parseFloat(bestBorrowCToken.borrowAPR).toFixed(2)}%`
                    : undefined
                }
                href={
                  bestBorrowCToken
                    ? `/fuse/pool/${bestBorrowCToken.pool.index}`
                    : "#"
                }
              />

              <CTokenBox
                title={"Highest LTV"}
                subtitle={
                  !!bestLTVCToken?.collateralFactor
                    ? `${(
                        parseFloat(bestLTVCToken.collateralFactor) / 1e16
                      ).toFixed()}%`
                    : undefined
                }
                href={
                  bestLTVCToken
                    ? `/fuse/pool/${bestLTVCToken.pool.index}`
                    : "#"
                }
              />
            </VStack>
          </DashboardBox>

          {/* Chart */}

          {/* Fuse Pools */}
          {/* <AssetOpportunities token={token} /> */}
        </VStack>
      </RowOrColumn>

      <VStack h="100%" w="100%" bg="" alignItems="flex-start">
        <HStack h="100%" w="100%" bg="" alignItems="center">
          <Heading p={4}>{"Lend & Borrow"}</Heading>
          <Avatar src={token.logoURL} />
          {/* <AvatarWithBadge
            outerImage={token.logoURL}
            badgeImage={"/static/fuseicon.png"}
          /> */}
        </HStack>
        <Box w="100%" h="400px">
          <FusePoolListForToken token={token} />
        </Box>
      </VStack>
    </Column>
  );
};

export default TokenDetails;

const Header = ({
  isMobile,
  tokenData,
}: {
  isMobile: boolean;
  tokenData?: TokenData;
}) => {
  return (
    <Row
      mainAxisAlignment="flex-start"
      crossAxisAlignment="center"
      // bg="aqua"
      w="100%"
      h="100%"
    >
      <Row
        mainAxisAlignment="space-between"
        crossAxisAlignment="center"
        w="100%"
        h="100%"
        p={3}
      >
        {/* Token Name + Logo */}
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          flexBasis={"75%"}
          //   bg="purple"
        >
          <Image
            src={
              tokenData?.logoURL ??
              "https://static.coingecko.com/s/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png"
            }
            boxSize="50"
          />
          <Heading ml={4} size={isMobile ? "md" : "lg"}>
            {tokenData?.name} ({tokenData?.symbol}){" "}
          </Heading>
        </Row>

        {/* Links */}
        <Row
          mainAxisAlignment="flex-end"
          crossAxisAlignment="center"
          //   bg="blue"
          w="100%"
          h="100%"
          flexBasis={"25%"}
        >
          <Box size="sm" mr={3}>
            <Link href="/home" isExternal>
              <Image
                src={
                  "https://static.coingecko.com/s/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png"
                }
                boxSize="20px"
              />
            </Link>
          </Box>
          <Box size="sm" mr={3}>
            <Link
              href={`https://etherscan.io/address/${tokenData?.address}`}
              isExternal
            >
              <Image
                src={"/static/icons/etherscan-logo-light-circle.svg"}
                boxSize="20px"
              />
            </Link>
          </Box>
          <Box size="sm" mr={3}>
            <Link
              href={`https://info.uniswap.org/#/tokens/${tokenData?.address}`}
              isExternal
            >
              <Image
                src={"/static/icons/uniswap-uni-logo.svg"}
                boxSize="20px"
              />
            </Link>
          </Box>
        </Row>
      </Row>
    </Row>
  );
};

const CTokenBox = ({
  title,
  subtitle,
  href = "#",
}: {
  title: string;
  subtitle?: string;
  href: string;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <AppLink
      href={href}
      as={Box}
      w="100%"
      bg={hovered ? "" : ""}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      _hover={{
        cursor: "pointer",
        opacity: 1,
      }}
      opacity={0.9}
    >
      <HStack w="100%" justifyContent="space-between" bg="">
        <VStack h="100%" bg="" alignItems="flex-start">
          <Text my="auto" color="#676767">
            {title}
          </Text>
          <Heading bgGradient="linear(to-l, #7928CA, #FF0080)" bgClip="text">
            {subtitle}
          </Heading>
        </VStack>
        <Box ml="auto" bg="" pr={24}>
          <ChevronRightIcon
            transition="transform 0.2s ease 0s"
            transform={hovered ? "translateX(7px) scale(1.00)" : ""}
            ml="auto"
          />
        </Box>
      </HStack>
    </AppLink>
  );
};
