import { useAddAssetContext } from "context/AddAssetContext"
import { useRari } from "context/RariContext";
import { Column, Row } from "lib/chakraUtils";
import { Button, Text } from "@chakra-ui/react";
import { useSushiOrUniswapV2Pairs } from "hooks/fuse/useOracleData";
import { useState } from "react";

const UniswapV2TwapInfoForBot = () => {
    const [pairAddress, setPairAddress] = useState("")
    const { fuse, address } = useRari()
    const { oracleAddress, uniV3BaseTokenAddress, setOracleAddress, tokenAddress, activeUniSwapPair  } = useAddAssetContext()

    // Get pair options from sushiswap and uniswap
    const { SushiPairs, SushiError, UniV2Pairs, univ2Error } =
    useSushiOrUniswapV2Pairs(tokenAddress);

    // Deploy Oracle
    const deployUniV2Oracle = async () => {
        const addressToUse = await fuse.deployPriceOracle(
            "UniswapTwapPriceOracleV2",
            { baseToken: uniV3BaseTokenAddress },
            { from: address }
        )
        setPairAddress(UniV2Pairs[activeUniSwapPair].id)
        setOracleAddress(addressToUse)
    };

    return (
        
        <Column
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        w="100%"
        h="100%"
      >

          <Text mt="5" mb="5" fontSize="xs" align="center">
            Click below to deploy the oracle. After deploying you'll have to configure yout TWAP bot with the given information. 
          </Text>
          {uniV3BaseTokenAddress.length > 0 ? (
                <Button
                onClick={() => deployUniV2Oracle()}
                >
                Deploy!
                </Button>
                ) : null

            }
            { pairAddress !== "" && oracleAddress !== "" ?
                <>
                    <Row
                        crossAxisAlignment="center"
                        mainAxisAlignment="space-between"
                        width="260px"
                        my={3}
                    >

                        <Text fontSize="xs" align="center">
                            Depoyed UniV2 Oracle address: {oracleAddress}
                        </Text>
                    </Row>
                    <Row
                        crossAxisAlignment="center"
                        mainAxisAlignment="space-between"
                        width="260px"
                        my={3}
                    >
                        <Text fontSize="xs" align="center">
                            Uniswap pair address: {pairAddress}
                        </Text>
                    </Row>
                    <Row
                        crossAxisAlignment="center"
                        mainAxisAlignment="space-between"
                        width="260px"
                        my={3}
                    >
                        <Text fontSize="xs" align="center">
                            Base token address: {uniV3BaseTokenAddress}
                        </Text>
                    </Row>
                    <Text fontSize="xs" align="center">
                        Once the TWAP bot is running and has updated the oracle at least once, you can continue. Otherwise you won't be able to deploy the asset. 
                    </Text>
                </>

            : null}
      </Column>
    )
}

export default UniswapV2TwapInfoForBot
