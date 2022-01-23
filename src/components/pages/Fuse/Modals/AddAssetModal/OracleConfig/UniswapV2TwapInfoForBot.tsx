import { useState } from "react";

// Context
    // Fuse
import { useAddAssetContext } from "context/AddAssetContext"   
    // Rari 
import { useRari } from "context/RariContext";

// Chakra UI
import { Button, Text, useClipboard, Box } from "@chakra-ui/react";
import { CopyIcon } from '@chakra-ui/icons'
import { Column, Row } from "lib/chakraUtils";

// Hooks
import { useSushiOrUniswapV2Pairs } from "hooks/fuse/useOracleData";

// Utils
import { shortAddress } from "utils/shortAddress";

const UniswapV2TwapInfoForBot = () => {
    const [ pairAddress, setPairAddress ] = useState("")
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

    const rootPriceOracle = fuse.addresses.UNISWAP_TWAP_PRICE_ORACLE_V2_ROOT_CONTRACT_ADDRESS 
    
    const { hasCopied: copiedRoot, onCopy: onCopyRoot } = useClipboard(rootPriceOracle ?? "");
    const { hasCopied: copiedBase, onCopy: onCopyBase } = useClipboard(uniV3BaseTokenAddress ?? "");
    const { hasCopied: copiedPair, onCopy: onCopyPair } = useClipboard(pairAddress ?? "");
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
                    <Box
                        width="100%"
                    >
                        <TwapBotConfigRow 
                            label={"Root oracle contract address:"}
                            onCopy={onCopyRoot}
                            hasCopied={copiedRoot}
                            addressToCopy={rootPriceOracle}
                            />
                        <TwapBotConfigRow 
                            label={"Pair address:"}
                            onCopy={onCopyPair}
                            hasCopied={copiedPair}
                            addressToCopy={pairAddress}
                            />
                        <TwapBotConfigRow 
                            label={"Pair's base token address:"}
                            onCopy={onCopyBase}
                            hasCopied={copiedBase}
                            addressToCopy={uniV3BaseTokenAddress}
                            />   
                    </Box>
                </>

            : null}
      </>
    )
}

export default UniswapV2TwapInfoForBot
