import {
  Heading,
  Skeleton,
  SkeletonCircle,
  Box,
  HStack,
  Text,
  Divider,
  VStack,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/avatar";
import AppLink from "components/shared/AppLink";
import { Column, Row } from "lib/chakraUtils";
import { SubgraphCToken, SubgraphPool } from "pages/api/explore";
import { convertMantissaToAPY, convertMantissaToAPR } from "utils/apyUtils";
import { useMemo } from "react";
import { shortUsdFormatter, smallUsdFormatter } from "utils/bigUtils";
import { RariApiTokenData } from "types/tokens";
import { WhitelistedIcon } from "components/shared/Icons/WhitelistedIcon";
import { ModalDivider } from "components/shared/Modal";
import {
  TokenData,
  useTokenData,
  useTokensDataAsMap,
} from "hooks/useTokenData";

export enum ExploreGridBoxMetric {
  TOTAL_BORROWS,
  TOTAL_SUPPLY,
  SUPPLY_RATE,
  BORROW_RATE,
}

// top earning stablecoin, newest yield agg, most popular asset, top earning asset, and most borrowed asset?
export const FuseAssetBoxNew = ({
  bg,
  heading = "",
  tokenData,
  metric = ExploreGridBoxMetric.SUPPLY_RATE,
  balance,
  pool,
  assetIndex,
}: {
  bg?: string;
  heading?: string;
  tokenData?: RariApiTokenData;
  metric?: ExploreGridBoxMetric;
  balance?: number;
  pool: SubgraphPool | undefined;
  assetIndex?: number;
}) => {
  // If we have passed in an `assetIndex` then let's get the cToken Data
  const cToken = useMemo(() => {
    if (!!assetIndex && pool) return pool?.assets[assetIndex];
  }, [pool, assetIndex]);

  // If we have provided an `assetIndex`, we are trying waiting on cTokenData
  const loading = useMemo(() => {
    if (!!assetIndex) return !cToken;
    else return !pool;
  }, [pool, assetIndex, cToken]);

  const _tokenData = useTokenData(
    assetIndex ? pool?.assets[assetIndex].underlying.address : undefined
  );

  const TokenData = tokenData ?? _tokenData;

  // console.log({ tokenData, _tokenData, TokenData });

  return (
    <AppLink
      href={
        pool?.index
          ? `/fuse/pool/${pool.index}`
          : cToken?.underlying?.id
          ? `/token/${cToken?.underlying?.id}`
          : `#`
      }
      className="no-underline"
      w="100%"
      h="100%"
    >
      <Column
        w="100%"
        h="100%"
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        // border="1px solid #272727"
        p={5}
        px={7}
        // maxW="200px"
        //  bg="lime"
      >
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          w="100%"
          flexGrow={1}
          bg=""
          p={3}
          py={4}
        >
          <Box my={1} bg="">
            <SkeletonCircle isLoaded={!loading} boxSize={["30px", "45px"]}>
              {!!cToken ? (
                <Avatar src={TokenData?.logoURL} h="100%" w="100%" />
              ) : (
                <FusePoolBadge pool={pool} />
              )}
            </SkeletonCircle>
          </Box>
          <Box maxWidth="250px" ml={2}>
            <Skeleton
              isLoaded={!loading}
              height={loading ? "20px" : "100%"}
              maxWidth="100%"
              my={1}
            >
              <HStack alignItems="flex-end">
                <Heading fontSize={["sm", "md", "xl"]} isTruncated={true}>
                  {pool?.name}
                </Heading>
              </HStack>
            </Skeleton>
          </Box>
          {!!loading && (
            <Box ml={2}>
              <WhitelistedIcon
                isWhitelisted={true}
                mr={2}
                boxSize={"15px"}
                mb="2px"
              />
            </Box>
          )}
        </Row>

        <ModalDivider />

        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          mt="auto"
          w="100%"
          h="100%"
          bg=""
          flexGrow={1}
          p={3}
          py={3}
        >
          <LeftSide
            pool={pool}
            assetIndex={assetIndex}
            metric={metric}
            tokenData={TokenData}
          />
          <RightSide tokenData={TokenData} pool={pool} balance={balance} />
        </Row>
      </Column>
    </AppLink>
  );
};

export default FuseAssetBoxNew;

const FusePoolBadge = ({ pool }: { pool: SubgraphPool | undefined }) => {
  const underlyingAssets: string[] | undefined = pool?.underlyingAssets.map(
    ({ id }) => id
  );

  const tokensData = useTokensDataAsMap(underlyingAssets);

  return (
    <Avatar h="100%" w="100%" bg="" src="static/icons/fuse-glow.svg">
      <AvatarGroup max={4} mb={2} spacing="2">
        <AvatarBadge
          borderColor="transparent"
          bg="purple"
          boxSize=".5em"
          mb={1}
          mr={3}
        />
        <AvatarBadge
          borderColor="transparent"
          bg="pink"
          boxSize=".5em"
          mb={1}
          mr={3}
        />
        <AvatarBadge
          borderColor="transparent"
          bg="lime"
          boxSize=".5em"
          mb={1}
          mr={3}
        />
      </AvatarGroup>
    </Avatar>
  );
};

const LeftSide = ({
  tokenData,
  assetIndex,
  metric,
  pool,
}: {
  tokenData?: TokenData;
  assetIndex?: number;
  pool: SubgraphPool | undefined;
  metric: ExploreGridBoxMetric;
}) => {
  const cToken =
    assetIndex !== undefined && pool ? pool.assets[assetIndex] : undefined;
  const hasCToken = !!cToken;

  const loading = useMemo(() => {
    if (!!assetIndex) return !cToken;
    else return !pool;
  }, [pool, assetIndex, cToken]);

  const [title, subtitle]: [string, string] = useMemo(() => {
    let title = "",
      subtitle = "";

    if (!!cToken) {
      switch (metric) {
        case ExploreGridBoxMetric.SUPPLY_RATE:
          const supplyRate = convertMantissaToAPY(
            cToken?.supplyRatePerBlock,
            365
          );
          subtitle = `${supplyRate.toFixed(1)}%`;
          title = "Supply APY";
          break;
        case ExploreGridBoxMetric.BORROW_RATE:
          const borrowRate = convertMantissaToAPR(cToken?.borrowRatePerBlock);
          subtitle = `${borrowRate.toFixed(1)}%`;
          title = "Borrow APR";
          break;
        case ExploreGridBoxMetric.TOTAL_BORROWS:
          subtitle = `${shortUsdFormatter(
            parseFloat(cToken?.totalBorrowUSD ?? "0")
          )}`;
          title = "Total Borrowed";
          break;
        case ExploreGridBoxMetric.TOTAL_SUPPLY:
          subtitle = `${shortUsdFormatter(
            parseFloat(cToken?.totalSupplyUSD ?? "0")
          )}`;
          title = "Total Supplied";
          break;
        default:
          break;
      }
    } else if (!!pool) {
      title = "Total Supply";
      subtitle = shortUsdFormatter(pool.totalSupplyUSD);
    }
    return [title, subtitle];
  }, [metric, cToken, pool]);

  return (
    <VStack alignItems="flex-start">
      <HStack>
        {hasCToken && (
          <Avatar src={tokenData?.logoURL} h="15px" w="15px" mr={0} />
        )}
        <Text fontSize={["sm"]} color="grey">
          {title}
        </Text>
      </HStack>
      <Skeleton isLoaded={!loading} height={loading ? "20px" : "100%"} my={1}>
        <Heading
          fontSize={["sm", "md", "2xl"]}
          bgGradient="linear(to-l, #7928CA, #FF0080)"
          bgClip="text"
        >
          {subtitle}
        </Heading>
      </Skeleton>
    </VStack>
  );
};

// If you pass in a balance, show that, else show pool data
const RightSide = ({
  tokenData,
  pool,
  balance,
}: {
  tokenData?: TokenData;
  pool: SubgraphPool | undefined;
  balance: number | undefined;
}) => {
  const showBalance = !!balance;

  const loading = useMemo(() => !pool, [pool, balance]);

  return showBalance ? (
    <VStack alignItems="flex-start" mx="auto">
      <Text fontSize={["sm"]} color="grey">
        You have
      </Text>
      <Skeleton isLoaded={!loading} height={loading ? "20px" : "100%"} my={1}>
        <Heading fontSize={["sm", "md", "2xl"]}>
          {balance?.toFixed(2)} {tokenData?.symbol}
        </Heading>
      </Skeleton>
    </VStack>
  ) : !!pool ? (
    <HStack justify="flex-start" align="flex-start" mx="auto">
      <VStack alignItems="flex-start" ml={"auto"} mr="auto">
        <Text fontSize={["sm"]} color="grey">
          Total Supply
        </Text>
        <Skeleton isLoaded={!loading} height={loading ? "20px" : "100%"} my={1}>
          <Heading fontSize={["sm"]}>
            {shortUsdFormatter(pool.totalSupplyUSD)}
          </Heading>
        </Skeleton>
      </VStack>

      <VStack alignItems="flex-start" ml={"auto"} mr="auto">
        <Text fontSize={["sm"]} color="grey">
          Total Supply
        </Text>
        <Skeleton isLoaded={!loading} height={loading ? "20px" : "100%"} my={1}>
          <Heading fontSize={["sm"]}>
            {shortUsdFormatter(pool.totalSupplyUSD)}
          </Heading>
        </Skeleton>
      </VStack>
    </HStack>
  ) : null;
};
