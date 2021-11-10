// React
import { useMemo } from "react";
import { useQuery } from "react-query";

// Rari
import { useRari } from "context/RariContext";
import { Vaults, Fuse } from "../../esm/index";

// Libraries
import FuseJs from "fuse.js";

// Utils
import { filterOnlyObjectProperties } from "utils/fetchFusePoolData";
import { formatDateToDDMMYY } from "utils/api/dateUtils";
import { blockNumberToTimeStamp } from "utils/web3Utils";
import { fetchCurrentETHPrice, fetchETHPriceAtDate } from "utils/coingecko";
import { toInt } from "utils/ethersUtils";

// Ethers
import { BigNumber } from "@ethersproject/bignumber";

export interface FusePool {
  name: string;
  creator: string;
  comptroller: string;
  isPrivate: boolean;
}

interface LensFusePool {
  blockPosted: string;
  name: string;
  creator: string;
  comptroller: string;
  timestampPosted: string;
}

interface LensFusePoolData {
  totalBorrow: string;
  totalSupply: string;
  underlyingSymbols: string[];
  underlyingTokens: string[];
  whitelistedAdmin: boolean;
}

export type LensPoolsWithData = [
  ids: string[],
  fusePools: LensFusePool[],
  fusePoolsData: LensFusePoolData[],
  errors: boolean[]
];

export interface MergedPool extends LensFusePoolData, LensFusePool {
  id: number;
  suppliedUSD: number;
  borrowedUSD: number;
}

const poolSort = (pools: MergedPool[]) => {
  return pools.sort((a, b) => {
    if (b.suppliedUSD > a.suppliedUSD) {
      return 1;
    }

    if (b.suppliedUSD < a.suppliedUSD) {
      return -1;
    }

    // They're equal, let's sort by pool number:
    return b.id > a.id ? 1 : -1;
  });
};

export const fetchPools = async ({
  rari,
  fuse,
  address,
  filter,
  blockNum,
}: {
  rari: Vaults;
  fuse: Fuse;
  address: string;
  filter: string | null;
  blockNum?: number;
}) => {
  const isMyPools = filter === "my-pools";
  const isCreatedPools = filter === "created-pools";
  const isNonWhitelistedPools = filter === "unverified-pools";

  // We need the latest blockNumber
  const latestBlockNumber = await fuse.provider.getBlockNumber();
  const _blockNum = blockNum ? blockNum : latestBlockNumber;

  // Get the unix timestamp of the blockNumber
  const startBlockTimestamp = await blockNumberToTimeStamp(
    fuse.provider,
    _blockNum
  );

  const ddMMYYYY = formatDateToDDMMYY(new Date(startBlockTimestamp * 1000));

  const fetchETHPrice = blockNum
    ? fetchETHPriceAtDate(ddMMYYYY)
    : fetchCurrentETHPrice();

  const req = isMyPools
    ? fuse.contracts.FusePoolLens.callStatic.getPoolsBySupplierWithData(address)
    : isCreatedPools
    ? fuse.contracts.FusePoolLens.callStatic.getPoolsByAccountWithData(address)
    : isNonWhitelistedPools
    ? fuse.contracts.FusePoolLens.callStatic.getPublicPoolsByVerificationWithData(
        false
      )
    : fuse.contracts.FusePoolLens.callStatic.getPublicPoolsByVerificationWithData(
        true
      );

  const {
    0: ids,
    1: fusePools,
    2: fusePoolsData,
    3: errors,
  }: LensPoolsWithData = await req;

  console.log({fusePoolsData})

  const merged: MergedPool[] = [];
  for (let i = 0; i < ids.length; i++) {
    const id = parseFloat(ids[i]);
    const fusePool = fusePools[i];
    const fusePoolData = fusePoolsData[i];

    const mergedPool = {
      id,
      suppliedUSD:
        (parseFloat(fusePoolData.totalSupply) / 1e18) * (await fetchETHPrice),
      borrowedUSD:
        (parseFloat(fusePoolData.totalBorrow) / 1e18) * (await fetchETHPrice),
      ...filterOnlyObjectProperties(fusePool),
      ...filterOnlyObjectProperties(fusePoolData),
    };

    merged.push(mergedPool);
  }

  return merged;
};

export interface UseFusePoolsReturn {
  pools: MergedPool[];
  filteredPools: MergedPool[];
}

// returns impersonal data about fuse pools ( can filter by your supplied/created pools )
export const useFusePools = (filter: string | null): UseFusePoolsReturn => {
  const { fuse, rari, address } = useRari();

  const isMyPools = filter === "my-pools";
  const isCreatedPools = filter === "created-pools";
  const isNonWhitelistedPools = filter === "unverified-pools";

  const { data: _pools } = useQuery(
    address + " fusePoolList" + (filter ?? ""),
    async () => await fetchPools({ rari, fuse, address, filter })
  );

  const pools = _pools ?? [];

  console.log;

  const filteredPools = useMemo(() => {
    if (!pools.length) {
      return [];
    }

    if (!filter) {
      return poolSort(pools);
    }

    if (isMyPools || isCreatedPools || isNonWhitelistedPools)  {
      return poolSort(pools);
    }

    const options = {
      keys: ["pool.name", "id", "underlyingTokens", "underlyingSymbols"],
      threshold: 0.3,
    };

    const filtered = new FuseJs(pools, options).search(filter);
    return poolSort(filtered.map((item) => item.item));
  }, [pools, filter, isMyPools, isCreatedPools, isNonWhitelistedPools]);

  return { pools, filteredPools };
};
