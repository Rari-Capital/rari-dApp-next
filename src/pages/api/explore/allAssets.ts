import { ChainID } from "esm/utils/networks";
import { NextApiRequest, NextApiResponse } from "next";
import { queryAllUnderlyingAssets } from "services/gql";

import redis from "utils/redis";
import { SubgraphUnderlyingAsset } from ".";

export type AllAssetsResponse = SubgraphUnderlyingAsset[];

const REDIS_KEY_PREFIX = "explore-";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AllAssetsResponse>
) {
  res.setHeader("Cache-Control", "s-maxage=3600");
  if (req.method === "GET") {
    const chainId = req.query.chainId
      ? parseFloat(req.query.chainId as string)
      : ChainID.ETHEREUM;

    // Get Underlying Assets from subgraph
    try {
      // Redis query
      const redisKey = REDIS_KEY_PREFIX + "assets";
      const redisSearchData = await redis.get(redisKey);
      // If we found Redis data, then send it
      if (!!redisSearchData) {
        console.log("found redis data. returning", redisKey);
        return res
          .status(200)
          .json(JSON.parse(redisSearchData) as AllAssetsResponse);
      }

      const underlyingAssets = await queryAllUnderlyingAssets(chainId);

      const result = underlyingAssets;

      // Save results to redis every 30 minutes
      await redis.set(redisKey, JSON.stringify(result), "EX", 1800);
      console.log("set redis key", redisKey);

      return res.status(200).json(result);
    } catch (err) {
      return res.status(400);
    }
  }
}
