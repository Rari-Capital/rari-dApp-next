import { useAddAssetContext } from "context/AddAssetContext"
import { useRari } from "context/RariContext";
import { Column, Row } from "lib/chakraUtils";
import { Button, Text } from "@chakra-ui/react";
import { useSushiOrUniswapV2Pairs } from "hooks/fuse/useOracleData";
import { useEffect, useState } from "react";
import useCheckUniV2Oracle from "hooks/fuse/useCheckUniV2Oracle";
import { shortAddress } from "utils/shortAddress";

const UniswapV2TwapInfoForBot = () => {
    const [pairAddress, setPairAddress] = useState("")
    const { fuse, address } = useRari()
    const { 
        oracleAddress, 
        uniV3BaseTokenAddress, 
        activeOracleModel, 
        setOracleAddress, 
        tokenAddress, 
        activeUniSwapPair,
        tokenData
    } = useAddAssetContext()

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
        const id = activeOracleModel === "Uniswap_V2_Oracle" ? UniV2Pairs[activeUniSwapPair].id  : SushiPairs[activeUniSwapPair].id
        setPairAddress(id)
        setOracleAddress(addressToUse)
    };

    const isItReady = useCheckUniV2Oracle(tokenAddress, uniV3BaseTokenAddress)
    const rootPriceOracle = fuse.addresses.UNISWAP_TWAP_PRICE_ORACLE_V2_ROOT_CONTRACT_ADDRESS 
    return (
        <>
          
            {   pairAddress === "" && uniV3BaseTokenAddress.length > 0 ? (
                <>
                    <Text fontSize="xs" align="center">
                        2) Click below to deploy the oracle. 
                    </Text>
                    <Text fontSize="xs">
                        After deploying you'll have to configure your TWAP bot with the given information. 
                    </Text>
                    <Button
                        onClick={() => deployUniV2Oracle()}
                        width="25%"
                        height="10%"
                        fontWeight="bold"
                        borderRadius="5px"
                        bg={tokenData.color! ?? "#FFF"}
                        _hover={{ transform: "scale(1.02)" }}
                        _active={{ transform: "scale(0.95)" }}
                        color={tokenData.overlayTextColor! ?? "#000"}
                    >
                        Deploy!
                    </Button>
                </>
                ) : null

            }
            { pairAddress !== "" && oracleAddress !== "" ?
                <>
                    <Text fontSize="xs" align="center">
                        3) Use the information below to configure your TWAP bot. 
                    </Text>
                    <Row
                        crossAxisAlignment="center"
                        mainAxisAlignment="space-between"
                        width="100%"
                        my={3}
                    >
                        <Text fontSize="s" align="center">
                            Root price oracle contract address:
                        </Text>
                        <Text fontSize="xs" align="center">
                            {shortAddress(rootPriceOracle)}
                        </Text>
                    </Row>
                    <Row
                        crossAxisAlignment="center"
                        mainAxisAlignment="space-between"
                        width="260px"
                        my={3}
                    >
                        <Text fontSize="s" align="center">
                            Pair address:
                        </Text>
                        <Text fontSize="xs" align="center">
                            {shortAddress(pairAddress)}
                        </Text>
                    </Row>
                    <Row
                        crossAxisAlignment="center"
                        mainAxisAlignment="space-between"
                        width="260px"
                        my={3}
                    >
                        <Text fontSize="s" align="center">
                            Pair's base token address:
                        </Text>
                        <Text fontSize="xs" align="center">
                            {shortAddress(uniV3BaseTokenAddress)}
                        </Text>
                    </Row>
                    <Button>
                        {isItReady?.toString()}
                    </Button>
                </>

            : null}
      </>
    )
}

export default UniswapV2TwapInfoForBot
