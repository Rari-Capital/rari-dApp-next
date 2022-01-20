import { NextApiRequest, NextApiResponse } from "next";

// GQL
import { fetchTokensAPIDataAsMap } from "utils/services";
import { queryTopFuseAsset } from "services/gql";
import { TokensDataMap } from "types/tokens";
import { stables } from "gql/getTopPerformingFuseStable";
import { ChainID } from "esm/utils/networks";

// Types
export type SubgraphPool = {
  index: string;
  id: string;
  name: string;
  totalBorrowUSD: number;
  totalLiquidityUSD: number;
  totalSupplyUSD: number;
  assets: SubgraphCToken[];
  underlyingAssets: SubgraphUnderlyingAsset[];
};

export type SubgraphUnderlyingAsset = {
  id: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  price: number;
  totalBorrow?: number;
  totalBorrowUSD?: number;
  totalLiquidity?: number;
  totalLiquidityUSD?: number;
  totalSupply?: number;
  totalSupplyUSD?: number;
  ctokens?: SubgraphCToken[];
};

export type SubgraphCToken = {
  id: string;
  name: string;
  symbol: string;
  supplyRatePerBlock: string;
  borrowRatePerBlock: string;
  supplyAPY: string;
  borrowAPR: string;
  totalSupplyUSD: string;
  totalBorrowUSD: string;
  liquidityUSD: string;
  underlying: SubgraphUnderlyingAsset;
  pool?: SubgraphPool;
};

export type APIExploreData = {
  results: {
    topEarningFuseStable: SubgraphCToken | undefined;
    topEarningFuseAsset: SubgraphCToken | undefined;
    mostPopularFuseAsset: SubgraphCToken | undefined;
    mostBorrowedFuseAsset: SubgraphCToken | undefined;
    cheapestStableBorrow: SubgraphCToken | undefined;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIExploreData>
) {
  if (req.method === "GET") {
    // Get Underlying Assets from subgraph
    let chainId = parseInt(req.query.chainId as string) ?? ChainID.ETHEREUM;
    console.log("EXPLORE", { chainId });
    try {
      const [
        topEarningFuseStable,
        topEarningFuseAsset,
        mostPopularFuseAsset,
        mostBorrowedFuseAsset,
        cheapestStableBorrow,
      ] = await Promise.all([
        getTopEarningFuseStable(chainId),
        getTopEarningFuseAsset(chainId),
        getMostPopularFuseAsset(chainId),
        getMostBorrowedFuseAsset(chainId),
        getCheapestStablecoinBorrow(chainId),
      ]);

      const addresses = [];
      addresses.push(
        topEarningFuseStable?.underlying.address,
        topEarningFuseAsset?.underlying.address,
        mostPopularFuseAsset?.underlying.address,
        mostBorrowedFuseAsset?.underlying.address,
        cheapestStableBorrow?.underlying.address
      );

      // const tokensData: TokensDataMap = await fetchTokensAPIDataAsMap(
      //   addresses,
      //   chainId
      // );

      const results = {
        topEarningFuseStable,
        topEarningFuseAsset,
        mostPopularFuseAsset,
        mostBorrowedFuseAsset,
        cheapestStableBorrow,
      };

      const returnObj = {
        results,
        // tokensData,
      };

      return res.status(200).json(returnObj);
    } catch (err) {
      return res.status(400);
    }
  }
}

// Top Earning Stable = highest lending rate Stablecoin
const getTopEarningFuseStable = async (
  chainId: ChainID
): Promise<SubgraphCToken | undefined> =>
  await queryTopFuseAsset("supplyAPY", "desc", stables, chainId);

// Top Earning = highest lending rate Fuse Asset
const getTopEarningFuseAsset = async (
  chainId: ChainID
): Promise<SubgraphCToken | undefined> =>
  await queryTopFuseAsset("supplyAPY", "desc", undefined, chainId);

// Most Popular = Highest lending liquidity Fuse Asset
const getMostPopularFuseAsset = async (
  chainId: ChainID
): Promise<SubgraphCToken | undefined> =>
  await queryTopFuseAsset("liquidityUSD", "desc", undefined, chainId);

// Most Popular = Highest borrow liquidity Fuse Asset
const getMostBorrowedFuseAsset = async (
  chainId: ChainID
): Promise<SubgraphCToken | undefined> =>
  await queryTopFuseAsset("totalBorrowUSD", "desc", undefined, chainId);

// Cheapest stablecoin borrow
const getCheapestStablecoinBorrow = async (
  chainId: ChainID
): Promise<SubgraphCToken | undefined> =>
  await queryTopFuseAsset("borrowAPR", "asc", stables, chainId);
