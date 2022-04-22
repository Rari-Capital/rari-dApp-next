// React
import { useMemo } from "react";
import { useQuery } from "react-query";

// Rari
import { useRari } from "context/RariContext";
import { Fuse } from "../../esm/index";

// Libraries
import FuseJs from "fuse.js";

// Utils
import { filterOnlyObjectProperties } from "utils/fetchFusePoolData";
import { formatDateToDDMMYY } from "utils/api/dateUtils";
import { blockNumberToTimeStamp } from "utils/web3Utils";
import { fetchCurrentETHPrice, fetchETHPriceAtDate } from "utils/coingecko";
import { ChainID } from "esm/utils/networks";

import { BigNumber } from "ethers";
import { providers } from "@0xsequence/multicall";
import { POOL_156_COMPTROLLER } from "constants/convex";
import { flywheels } from "hooks/convex/useConvexRewards";

// Ethers
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
  rewardTokens: string[];
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

export const fetchPoolsManual = async ({
  fuse,
  address,
  verification = false,
  chainId = 1,
  blockNum,
}: {
  fuse: Fuse;
  address: string;
  verification?: boolean;
  chainId?: number;
  blockNum?: number;
}) => {
  // Query Directory
  let fusePoolsDirectoryResult =
    await fuse.contracts.FusePoolDirectory.callStatic.getPublicPoolsByVerification(
      verification,
      { from: address }
    );

  // Extract data from Directory call
  let ids: string[] = (fusePoolsDirectoryResult[0] ?? []).map((bn: BigNumber) =>
    bn.toString()
  );
  let fusePools: LensFusePool[] = fusePoolsDirectoryResult[1];
  let comptrollers = fusePools.map(({ comptroller }) => comptroller);

  // Query lens.getPoolSummary
  let fusePoolsData: LensFusePoolData[] = await Promise.all(
    comptrollers.map(async (comptroller) => {
      const _data = await fuse.contracts.FusePoolLens.callStatic.getPoolSummary(
        comptroller
      );
      const data: LensFusePoolData = {
        totalSupply: _data[0],
        totalBorrow: _data[1],
        underlyingTokens: _data[2],
        underlyingSymbols: _data[3],
        whitelistedAdmin: _data[4],
      };
      return data;
    })
  ).catch((err) => {
    console.error("Error querying poolSummaries", err);
    return [];
  });

  const multicallProvider = new providers.MulticallProvider(fuse.provider)
  const multicallFuse = new Fuse(multicallProvider, chainId)
  const poolRewardTokens = await Promise.all(fusePools.map((pool) => {
    return multicallFuse.contracts.FusePoolLensSecondary.callStatic.getRewardSpeedsByPool(
      pool.comptroller
    ).then((rewards) => {
      //reward token list
      return rewards[2]
    })
  }))

  const fetchETHPrice = fetchCurrentETHPrice();
  return await createMergedPools(ids, fusePools, fusePoolsData, poolRewardTokens, fetchETHPrice);
};

export const fetchPools = async ({
  fuse,
  address,
  filter,
  blockNum,
  chainId = 1
}: {
  fuse: Fuse;
  address: string;
  filter: string | null;
  blockNum?: number;
  chainId?: number
}) => {
  const isMyPools = filter === "my-pools";
  const isCreatedPools = filter === "created-pools";
  const isNonWhitelistedPools = filter === "unverified-pools";
  const isRewardedPools = filter === "rewarded-pools";

  const fetchETHPrice = fetchCurrentETHPrice();

  const multicallProvider = new providers.MulticallProvider(fuse.contracts.FusePoolLens.provider)
  const multicallFuse = new Fuse(multicallProvider, chainId)

  const req = isMyPools
    ? fuse.contracts.FusePoolLens.callStatic.getPoolsBySupplierWithData(address)
    : isCreatedPools
      ? fuse.contracts.FusePoolLens.callStatic.getPoolsByAccountWithData(address)
      : isNonWhitelistedPools
        ? fuse.contracts.FusePoolLens.callStatic.getPublicPoolsByVerificationWithData(
          false
        )
        : isRewardedPools
          ? Promise.all([
            fuse.contracts.FusePoolLens.callStatic.getPublicPoolsByVerificationWithData(
              true
            ),
            fuse.contracts.FusePoolLens.callStatic.getPublicPoolsByVerificationWithData(
              false
            )]
          ).then(([verifiedPools, unverifiedPools]) => {
            return [
              [...verifiedPools[0], ...unverifiedPools[0]],
              [...verifiedPools[1], ...unverifiedPools[1]],
              [...verifiedPools[2], ...unverifiedPools[2]],
              [...verifiedPools[3], ...unverifiedPools[3]],
            ]
          })
          : fuse.contracts.FusePoolLens.callStatic.getPublicPoolsByVerificationWithData(
            true
          );

  const {
    0: ids,
    1: fusePools,
    2: fusePoolsData,
    3: errors,
  }: LensPoolsWithData = await req;


  const poolRewardTokens: string[][] = await Promise.all(fusePools.map((pool, index) => {
    return multicallFuse.contracts.FusePoolLensSecondary.callStatic.getRewardSpeedsByPool(
      pool.comptroller
    ).then((rewards) => {
      //reward token list
      return rewards[2]
    }).catch((err) => {
      return []
    })
  }))

  return await createMergedPools(ids, fusePools, fusePoolsData, poolRewardTokens, fetchETHPrice);
};

const createMergedPools = async (
  ids: string[],
  fusePools: LensFusePool[],
  fusePoolsData: LensFusePoolData[],
  rewardTokens: string[][],
  fetchETHPrice: Promise<any>
) => {
  const merged: MergedPool[] = [];
  for (let i = 0; i < ids.length; i++) {
    const id = parseFloat(ids[i]);
    const fusePool = fusePools[i];
    const fusePoolData = fusePoolsData[i];
    const poolTokenRewards = id === 156 ? Object.values(flywheels).map(f => f.rewardToken) : rewardTokens[i];

    const mergedPool = {
      id,
      suppliedUSD:
        (parseFloat(fusePoolData.totalSupply) / 1e18) * (await fetchETHPrice),
      borrowedUSD:
        (parseFloat(fusePoolData.totalBorrow) / 1e18) * (await fetchETHPrice),
      ...filterOnlyObjectProperties(fusePool),
      ...filterOnlyObjectProperties(fusePoolData),
      rewardTokens: poolTokenRewards
    };

    merged.push(mergedPool);
  }

  return merged;
};

// returns impersonal data about fuse pools ( can filter by your supplied/created pools )
export const useFusePools = (filter: string | null): MergedPool[] | null => {
  const { fuse, address, chainId } = useRari();

  const isMyPools = filter === "my-pools";
  const isCreatedPools = filter === "created-pools";
  const isNonWhitelistedPools = filter === "unverified-pools";
  const isRewardedPools = filter === "rewarded-pools";

  const { data: pools } = useQuery(
    `${address} fusePoolList ${filter ?? ""} chainId: ${chainId}`,
    async () => {
      if (chainId === ChainID.ARBITRUM && filter === "unverified-pools") {
        return await fetchPoolsManual({
          fuse,
          address,
          verification: false,
          chainId,
        });
      }
      return await fetchPools({ fuse, address, filter, chainId });
    }
  );

  const filteredPools = useMemo(() => {
    if (!pools) {
      return null;
    }

    if (!pools.length) {
      return [];
    }

    if (!filter) {
      return poolSort(pools);
    }

    if (isMyPools || isCreatedPools || isNonWhitelistedPools) {
      return poolSort(pools);
    }

    if (isRewardedPools) {
      return poolSort(pools.filter((pool) => {
        return (pool.rewardTokens.length > 0 || pool.comptroller == POOL_156_COMPTROLLER)
      }))
    }


    const options = {
      keys: ["pool.name", "id", "underlyingTokens", "underlyingSymbols"],
      threshold: 0.3,
    };

    const filtered = new FuseJs(pools, options).search(filter);
    return poolSort(filtered.map((item) => item.item));
  }, [pools, filter, isMyPools, isCreatedPools, isNonWhitelistedPools, isRewardedPools]);

  return filteredPools;
};
