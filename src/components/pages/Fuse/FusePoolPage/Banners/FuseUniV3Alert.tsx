import { Alert, AlertIcon } from '@chakra-ui/react';
import { useRari } from 'context/RariContext';
import React from 'react'
import { useQuery, UseQueryResult } from 'react-query';
import { USDPricedFuseAsset } from 'utils/fetchFusePoolData';

export const FuseUniV3Alert: React.FC<{assets: USDPricedFuseAsset[]}> = ({
    assets
  }) => {
      const { fuse } = useRari()

    const { data: univ3Tokens }: UseQueryResult<string[]> = useQuery("univ3 assets for " + assets.map(a => a.cToken),
    async () => {
      if (!assets) return []
      let res: string[] = []
      assets.forEach(

        async asset => {
          const identity = await fuse.identifyPriceOracle(asset.oracle)
          const includes = [
            "UniswapV3TwapPriceOracle_Uniswap_3000",
            "UniswapV3TwapPriceOracle_Uniswap_10000",
            "UniswapV3TwapPriceOracleV2_Uniswap_500_USDC",
            "UniswapV3TwapPriceOracleV2_Uniswap_3000_USDC",
            "UniswapV3TwapPriceOracleV2_Uniswap_10000_USDC",
            "UniswapV3TwapPriceOracleV2"
          ].includes(identity)
          if (!!includes) {
            res.push(asset.underlyingSymbol)
          }
        }
      )

      return res
    })



    if (!univ3Tokens || !univ3Tokens.length) return null
    return (
      <Alert
        colorScheme={"yellow"}
        borderRadius={5}
        mt="5"
      >
        <AlertIcon />
        <span style={{ color: "black" }}>
          🚧 Warning - The following tokens in this pool utilize Univ3 Oracles - Use pool with caution: {univ3Tokens.join(', ')}
        </span>
      </Alert >
    );
  };