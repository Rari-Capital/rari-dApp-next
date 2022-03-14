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
    AvatarGroup
} from "@chakra-ui/react"
import { TokenData } from "hooks/useTokenData"
import { USDPricedFuseAsset } from "utils/fetchFusePoolData"

import { InfoIcon } from "@chakra-ui/icons"
import DashboardBox from "components/shared/DashboardBox"
import { MODAL_PROPS } from "components/shared/Modal"
import AppLink from "components/shared/AppLink"
import { FlywheelPluginRewardsMap } from "hooks/convex/useConvexRewards"
import { CTokenAvatarGroup } from "components/shared/Icons/CTokenIcon"

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
                        <Text fontSize="lg" mr={1} alignSelf="center">{symbol}</Text>
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
                                        <Text>This market uses a <b>plugin</b> to stream </Text>
                                        <CTokenAvatarGroup tokenAddresses={rewardTokens} popOnHover={false} />
                                        <Text>rewards</Text>
                                    </HStack>
                                    <Text> from the <b>{tokenInfo[market.underlyingSymbol].convexPoolName}</b> Convex pool</Text>
                                    <Text>for <b>{tokenInfo[market.underlyingSymbol].curvePoolName}</b> Curve LPs. </Text>
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


type PluginCTokenInfoType = {
    [title: string]: {
        cToken: string,
        plugin: string,
        lpToken: string,
        depositContract: string,
        rewardsContract: string,
        curvePoolName: string,
        convexPoolName: string,
        curvePoolLink: string,
    }
}

const eligibleTokens = ["FRAX3CRV-f", "steCRV", "UST_whv23CRV-f", "crv3crypto", "D3-f", "FEI3CRV3CRV-f", "alUSD3CRV-f"]

const tokenInfo: PluginCTokenInfoType = {
    "FRAX3CRV-f": {
        "cToken": "0x2ec70d3Ff3FD7ac5c2a72AAA64A398b6CA7428A5",
        "plugin": "0xd88e89ac6a0859e9b91078cb2a183a36ba6c8933",
        "lpToken": "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
        "depositContract": "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
        "rewardsContract": "0xB900EF131301B307dB5eFcbed9DBb50A3e209B2e",
        "curvePoolName": "frax",
        "convexPoolName": "frax",
        "curvePoolLink": "https://curve.fi/frax"
    },
    "steCRV": {
        "cToken": "0xe71b4Cb8A99839042C45CC4cAca31C85C994E79f",
        "plugin": "0x00da328ea462f75325770aaf1ade0f457ddbedc0",
        "lpToken": "0x06325440D014e39736583c165C2963BA99fAf14E",
        "depositContract": "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
        "rewardsContract": "0x0A760466E1B4621579a82a39CB56Dda2F4E70f03",
        "curvePoolName": "steth",
        "convexPoolName": "steth",
        "curvePoolLink": "https://curve.fi/steth"
    },
    "UST_whv23CRV-f": {
        "cToken": "0xEee0de9187B8B1Ba554E406d0b36a807A00B0ea5",
        "plugin": "0xdee1fff7c1f8bafe2767c72a3afe81e3a944ef7e",
        "lpToken": "0xCEAF7747579696A2F0bb206a14210e3c9e6fB269",
        "depositContract": "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
        "rewardsContract": "0x7e2b9B5244bcFa5108A76D5E7b507CFD5581AD4A",
        "curvePoolName": "Wormhole v2 UST-3Pool",
        "convexPoolName": "ust-wormhole",
        "curvePoolLink": "https://curve.fi/factory/53"
    },
    "crv3crypto": {
        "cToken": "0x03c2d837e625e0f5cc8f50084b7986863c82102c",
        "plugin": "0x91d0baba3d6950b2d0f175259de54ccbc0665f6b",
        "lpToken": "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff",
        "depositContract": "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
        "rewardsContract": "0x9D5C5E364D81DaB193b72db9E9BE9D8ee669B652",
        "curvePoolName": "tricrypto2",
        "convexPoolName": "tricrypto2",
        "curvePoolLink": "https://curve.fi/tricrypto2"
    },
    "D3-f": {
        "cToken": "0x97b8c935e130cBa777579Ea2460c4C3e78a48a61",
        "plugin": "0xeb25e03c5a1d7f8f27c89f3d8e24f3299bde2cc2",
        "lpToken": "0xBaaa1F5DbA42C3389bDbc2c9D2dE134F5cD0Dc89",
        "depositContract": "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
        "rewardsContract": "0x329cb014b562d5d42927cfF0dEdF4c13ab0442EF",
        "curvePoolName": "d3pool",
        "convexPoolName": "d3pool",
        "curvePoolLink": "https://curve.fi/factory/57"

    },
    "FEI3CRV3CRV-f": {
        "cToken": "0x5E479875Ed69d4F09f7bCAaF71E9879b12d9e326",
        "plugin": "0x45870945f84c997fe426c2640d6a04f165d67d6a",
        "lpToken": "0x06cb22615BA53E60D67Bf6C341a0fD5E718E1655",
        "depositContract": "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
        "rewardsContract": "0x3133A4428AAC0b4ad96a09845363386ECd289A9c",
        "curvePoolName": "Fei Metapool",
        "convexPoolName": "fei",
        "curvePoolLink": "https://curve.fi/factory/11"

    },
    "alUSD3CRV-f": {
        "cToken": "0x3c37CdA5C30952E48aFcc40443A9296e59DAAcA9",
        "plugin": "0x7e5723782f6274124bdbe5bea7202c62813d939e",
        "lpToken": "0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c",
        "depositContract": "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
        "rewardsContract": "0x02E2151D4F351881017ABdF2DD2b51150841d5B3",
        "curvePoolName": "alUSD",
        "convexPoolName": "alUSD",
        "curvePoolLink": "https://curve.fi/alusd"
    }
}

export default PluginModal