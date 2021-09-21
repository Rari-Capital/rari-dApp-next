// React
import { useMemo } from "react";
import { useQuery } from "react-query";

// Rari
import { useRari } from "context/RariContext";
import { Vaults, Fuse } from "../../esm/index"

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

export interface MergedPool {
  id: number;
  pool: FusePool;
  underlyingTokens: string[];
  underlyingSymbols: string[];
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

  const [
    {
      0: ids,
      1: fusePools,
      2: totalSuppliedETH,
      3: totalBorrowedETH,
      4: underlyingTokens,
      5: underlyingSymbols,
    },
    ethPrice,
  ] = await Promise.all([
    isMyPools
      ? fuse.contracts.FusePoolLens.callStatic.getPoolsBySupplierWithData(address)
      : isCreatedPools
      ? fuse.contracts.FusePoolLens.callStatic.getPoolsByAccountWithData(address)
      : fuse.contracts.FusePoolLens.callStatic.getPublicPoolsWithData(),
    fetchETHPrice,
  ]);

  const merged: MergedPool[] = [];
  for (let id = 0; id < ids.length; id++) {
    merged.push({
      // I don't know why we have to do this but for some reason it just becomes an array after a refetch for some reason, so this forces it to be an object.
      underlyingTokens: underlyingTokens[id],
      underlyingSymbols: underlyingSymbols[id],
      pool: filterOnlyObjectProperties(fusePools[id]),
      id: toInt(ids[id]),
      suppliedUSD: (totalSuppliedETH[id] / 1e18) * parseFloat(ethPrice),
      borrowedUSD: (totalBorrowedETH[id] / 1e18) * parseFloat(ethPrice),
    });
  }

  return merged;
};

export interface UseFusePoolsReturn {
  pools: MergedPool[] | undefined;
  filteredPools: MergedPool[] | null;
}

// returns impersonal data about fuse pools ( can filter by your supplied/created pools )
export const useFusePools = (filter: string | null): UseFusePoolsReturn => {
  const { fuse, rari, address } = useRari();

  const isMyPools = filter === "my-pools";
  const isCreatedPools = filter === "created-pools";

  const { data: pools } = useQuery(
    address + " fusePoolList" + (isMyPools || isCreatedPools ? filter : ""),
    async () => await fetchPools({ rari, fuse, address, filter })
  );

  const filteredPools = useMemo(() => {
    if (!pools) {
      return null;
    }

    if (!filter) {
      return poolSort(pools);
    }

    if (isMyPools || isCreatedPools) {
      return poolSort(pools);
    }

    const options = {
      keys: ["pool.name", "id", "underlyingTokens", "underlyingSymbols"],
      threshold: 0.3,
    };

    const filtered = new FuseJs(pools, options).search(filter);
    return poolSort(filtered.map((item) => item.item));
  }, [pools, filter, isMyPools, isCreatedPools]);

  return { pools, filteredPools };
};
