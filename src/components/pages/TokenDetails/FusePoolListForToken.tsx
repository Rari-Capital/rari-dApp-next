import { TokenData, useTokensDataAsMap } from "hooks/useTokenData";
import React, { useCallback, useMemo, useState } from "react";
import { GQLFusePool, GQLUnderlyingAsset } from "types/gql";
import {
  HStack,
  VStack,
  Checkbox,
  Text,
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { TokensDataMap } from "types/tokens";
import AppLink from "components/shared/AppLink";
import { CTokenAvatarGroup } from "components/shared/Icons/CTokenIcon";
import { shortUsdFormatter } from "utils/bigUtils";
import { ChevronRightIcon, ViewIcon } from "@chakra-ui/icons";
import { shortAddress } from "utils/shortAddress";
import { makeGqlRequest } from "utils/gql";
import useSWR from "swr";
import { GET_UNDERLYING_ASSET_WITH_POOLS } from "gql/underlyingAssets/getUnderlyingAssetWithPools";
import { ChainID } from "esm/utils/networks";
import { useRari } from "context/RariContext";

const fetchUnderlyingAssetWithPools = async (tokenAddress: string, chainId: ChainID) => {
  const { underlyingAsset }: { underlyingAsset: GQLUnderlyingAsset } =
    await makeGqlRequest(GET_UNDERLYING_ASSET_WITH_POOLS, {
      tokenAddress,
    }, chainId);
  return underlyingAsset;
};

const useSubgraphPoolsForToken = (tokenAddress: string) => {
  const { chainId } = useRari();
  const { data, error } = useSWR(
    [tokenAddress.toLowerCase(), chainId, "pools"],
    fetchUnderlyingAssetWithPools
  );

  const pools = data?.pools ?? [];
  return pools;
};

const FusePoolListForToken = ({ token }: { token: TokenData }) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const pools = useSubgraphPoolsForToken(token.address);

  const underlyingAssets = useMemo(() => {
    const tokens = new Set<string>();
    pools.forEach(({ underlyingAssets }) => {
      underlyingAssets!.forEach(({ id }) => tokens.add(id));
    });
    return [...tokens];
  }, [pools]);

  const tokensData = useTokensDataAsMap(underlyingAssets);

  const toggleFilterMenu = useCallback(() => {
    setShowFilterMenu(!showFilterMenu);
  }, [showFilterMenu]);

  const [filteredTokens, setFilteredTokens] = useState<Set<string>>(new Set());

  const poolUnderlyingsMap = useMemo(() => {
    const poolUnderlyingsMap: { [id: string]: string[] } = {};
    pools.forEach(
      (pool) =>
      (poolUnderlyingsMap[pool.id] =
        pool.underlyingAssets?.map(({ id }) => id) ?? [])
    );
    return poolUnderlyingsMap;
  }, [pools]);

  const filteredPools = useMemo(() => {
    return pools.filter((pool) =>
      [...filteredTokens].every((token) =>
        poolUnderlyingsMap[pool.id].includes(token)
      )
    );
  }, [filteredTokens, poolUnderlyingsMap]);

  return (
    <Box w="100%" h="100%" bg="" overflowY="scroll">
      <Table variant="unstyled">
        <Thead position="sticky" top={0} left={0} bg="" zIndex={4}>
          <Tr bg="black" color="#7D7D7D">
            <Th fontSize="sm" fontWeight="normal">
              Fuse Pool
            </Th>
            <Th fontSize="sm" fontWeight="normal">
              Asset Liquidity
            </Th>
            <Th fontSize="sm" fontWeight="normal">
              Lend APY
            </Th>
            <Th fontSize="sm" fontWeight="normal">
              Borrow APR
            </Th>
            <Th fontSize="sm" fontWeight="normal" position="relative">
              <HStack alignContent="flex-end">
                <Text>Borrow against</Text>
                <ViewIcon
                  _hover={{
                    cursor: "pointer",
                    opacity: 0.7,
                  }}
                  onClick={toggleFilterMenu}
                  alignSelf="flex-start"
                />
                <CTokenAvatarGroup
                  tokenAddresses={[...filteredTokens]}
                  popOnHover
                />
              </HStack>
              {showFilterMenu && (
                <FilterMenu
                  underlyingAssets={underlyingAssets}
                  tokensData={tokensData}
                  filteredTokens={filteredTokens}
                  setFilteredTokens={setFilteredTokens}
                />
              )}
            </Th>
            <Th fontSize="sm" />
          </Tr>
        </Thead>
        <Tbody w="100%">
          {filteredPools.map((pool) => (
            <FusePoolRow pool={pool} token={token} />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

const FilterMenu = ({
  underlyingAssets,
  tokensData,
  filteredTokens,
  setFilteredTokens,
}: {
  underlyingAssets: string[];
  tokensData: TokensDataMap;
  filteredTokens: Set<string>;
  setFilteredTokens: (x: Set<string>) => void;
}) => {
  const [input, setInput] = useState("");

  const handleChecked = (e: any) => {
    const { value, checked } = e.target;
    const newSet = new Set(filteredTokens);
    2;
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setFilteredTokens(newSet);
  };

  return (
    <Box
      h="200px"
      w="100%"
      position="absolute"
      zIndex={10}
      overflowY="scroll"
      p={3}
      bg="black"
    >
      <VStack w="100%" h="100%" bg="" p={0}>
        {/* <HStack h="20px">
          <SearchIcon h="100%" />
          <Input
            onChange={({ target: { value } }) => setInput(value)}
            value={input}
            w="100%"
            h="100%"
            placeholder="Filter"
          />
        </HStack>
        <ModalDivider /> */}
        {underlyingAssets.map((tokenAddress) => {
          const tokenData = tokensData[tokenAddress];
          return (
            <Box w="100%" minH="20px">
              <HStack justify="flex-start">
                <Checkbox
                  isChecked={filteredTokens.has(tokenAddress)}
                  onChange={handleChecked}
                  value={tokenAddress}
                />
                <Text>{tokenData?.symbol ?? shortAddress(tokenAddress)}</Text>
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

const FusePoolRow = ({
  pool,
  token,
}: {
  pool: GQLFusePool;
  token: TokenData;
}) => {
  const [hovered, setHovered] = useState(false);

  const cToken = pool.assets![0];
  const liquidityUSD = parseFloat(cToken.liquidityUSD);
  const supplyAPY = parseFloat(cToken.supplyAPY).toFixed(2);
  const borrowAPR = parseFloat(cToken.borrowAPR).toFixed(2);

  return (
    <AppLink
      href={`/fuse/pool/${pool.index}`}
      as={Tr}
      className="hover-row no-underline"
      width="100%"
      height="90px"
      borderTop="1px solid #272727"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Pool */}
      <Td>
        <HStack>
          {/* <AvatarWithBadge
            outerImage={token?.logoURL ?? ""}
            badgeImage={"/static/fuseicon.png"}
          /> */}
          {/* <Avatar src={"/static/fuseicon.png"} /> */}
          <Text fontWeight="bold">{pool.name}</Text>
        </HStack>
      </Td>
      <Td>{shortUsdFormatter(liquidityUSD)}</Td>
      <Td>{supplyAPY}%</Td>
      <Td>{borrowAPR}%</Td>
      <Td>
        <CTokenAvatarGroup
          tokenAddresses={pool.underlyingAssets?.map(({ id }) => id) ?? []}
          popOnHover
        />
      </Td>
      <Td>
        <ChevronRightIcon
          transition="transform 0.2s ease 0s"
          transform={hovered ? "translateX(7px) scale(1.00)" : ""}
          ml="auto"
        />
      </Td>
    </AppLink>
  );
};

export default FusePoolListForToken;
