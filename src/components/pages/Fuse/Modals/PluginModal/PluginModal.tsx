import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Avatar,
    Spinner,
    Flex,
    Link,
    Button,
    Heading,
    HStack,
    VStack,
} from "@chakra-ui/react"
import { TokenData } from "hooks/useTokenData"
import { USDPricedFuseAsset } from "utils/fetchFusePoolData"

import { InfoIcon } from "@chakra-ui/icons"
import AppLink from "components/shared/AppLink"
import { CTokenAvatarGroup } from "components/shared/Icons/CTokenIcon"
import { eligibleTokens, tokenInfo } from "constants/convex"

export const PluginModal = ({
    market,
    isOpen,
    onClose,
    tokenData,
    rewardTokens
}: {
    market: USDPricedFuseAsset,
    isOpen: boolean,
    onClose: () => void,
    tokenData: TokenData | undefined,
    rewardTokens: string[]
}) => {

    const index = eligibleTokens.indexOf(market.underlyingSymbol)
    const symbol = tokenData?.symbol ?? market.underlyingSymbol

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display="flex" width="100%" alignSelf="center">
                        {tokenData ? <Avatar src={tokenData?.logoURL} mr={4} /> : <Spinner />}
                        <Text fontSize="lg" mr={1} alignSelf="center"> 🔌 {symbol}</Text>
                        <Text fontSize="lg" mr={4} alignSelf="center">
                            Rewards
                        </Text>
                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        {index === -1 ? null :
                            <Flex direction="column" height="100%">
                                {/* <AppLink isExternal={true} href="https://www.convexfinance.com/stake"> */}
                                <VStack align={"flex-start"} my={2}>
                                    <InfoIcon size="15px" />
                                    <HStack>
                                        <Text>This market streams </Text>
                                        <CTokenAvatarGroup tokenAddresses={rewardTokens} popOnHover={false} />
                                        <Text>rewards</Text>
                                    </HStack>
                                    <Text> from the <b>{tokenInfo[market.underlyingSymbol].convexPoolName}</b> Convex pool</Text>
                                    <Text>to suppliers of <b>{tokenInfo[market.underlyingSymbol].curvePoolName}</b> Curve LPs. </Text>
                                    {/* <Text fontSize="sm"> Deposit your {tokenInfo[market.underlyingSymbol].curvePoolName} Curve LP tokens into Fuse to borrow against it while earning all the same rewards from Convex.</Text> */}
                                    {/* <Text py={1}>View reward rates for <b>{tokenInfo[market.underlyingSymbol].convexPoolName}</b> on Convex </Text> */}
                                </VStack>
                                {/* </AppLink> */}


                                <Heading size="sm" mt={6} mb={1}>
                                    Info
                                </Heading>

                                <InfoPairs title="Curve Pool" link={tokenInfo[market.underlyingSymbol].curvePoolLink} address={''} />
                                <InfoPairs title="Curve LP Token" address={tokenInfo[market.underlyingSymbol].lpToken} />
                                <InfoPairs title="ERC4626 Plugin" address={tokenInfo[market.underlyingSymbol].plugin} />

                            </Flex>
                        }
                    </ModalBody>
                    <ModalFooter mt={2}>
                        <AppLink isExternal={true} href="https://www.convexfinance.com/stake">
                            <Button colorScheme='white' minW="100%">
                                View rates for {' '} <Text mx={1} fontWeight={"bold"}>{tokenInfo[market.underlyingSymbol].convexPoolName}</Text>  {' '} on Convex
                            </Button>
                        </AppLink>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

const InfoPairs = ({
    title,
    address,
    link
}: {
    title: string,
    address: string,
    link?: string,
}) => {
    return (
        <Flex justifyContent="space-between" py={1}>
            <Text fontSize="xs">{title} </Text>
            <Link href={link ? link : `https://etherscan.io/address/${address}`} target="_blank">
                <Text fontSize="xs" alignSelf="center">{link ?? address}</Text>
            </Link>
        </Flex>
    )
}


export default PluginModal