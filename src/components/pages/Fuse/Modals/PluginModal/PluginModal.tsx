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
    Button
} from "@chakra-ui/react"
import { TokenData } from "hooks/useTokenData"
import { USDPricedFuseAsset } from "utils/fetchFusePoolData"

export const PluginModal = ({
    market,
    isOpen,
    onClose,
    tokenData
}: {
    market: USDPricedFuseAsset,
    isOpen: boolean,
    onClose: () => void,
    tokenData: TokenData | undefined
}) => {

    const index = eligibleTokens.indexOf(market.underlyingSymbol)
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display="flex" width="100%" alignSelf="center">
                        {tokenData ? <Avatar src={tokenData?.logoURL} mr={4} /> : <Spinner />}
                        <Text fontSize="lg" mr={1} alignSelf="center">{tokenData?.symbol ?? market.underlyingSymbol}</Text>
                        <Text fontSize="lg" mr={4} alignSelf="center">
                            Market Information
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {index === -1 ? null :
                            <Flex direction="column" height="100%">
                                <InfoPairs title="Fuse Market" info={tokenInfo[market.underlyingSymbol].cToken} />
                                <InfoPairs title="Plugin" info={tokenInfo[market.underlyingSymbol].plugin} />
                                <InfoPairs title="Curve LP Token" info={tokenInfo[market.underlyingSymbol].lpToken} />
                                <InfoPairs title="Curve Contract" info={tokenInfo[market.underlyingSymbol].depositContract} />
                                <InfoPairs title="Curve Rewards" info={tokenInfo[market.underlyingSymbol].rewardsContract} />
                            </Flex>
                        }

                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

const InfoPairs = ({
    title,
    info
}: {
    title: string,
    info: string
}) => {
    return (
        <Flex justifyContent="space-between">
            <Text fontSize="xs">{title} </Text>
            <Link href={`https://etherscan.io/address/${info}`} target="_blank">
                <Text fontSize="xs" alignSelf="center">{info}</Text>
            </Link>
        </Flex>
    )
}


type tokenInfoType = {
    [title: string]: {
        "cToken": string,
        "plugin": string,
        "lpToken": string,
        "depositContract": string,
        "rewardsContract": string
    }
}

const eligibleTokens = ["FRAX3CRV-f", "steCRV", "UST_whv23CRV-f", "crv3crypto", "D3-f", "FEI3CRV3CRV-f", "alUSD3CRV-f"]

const tokenInfo: tokenInfoType = {
    "FRAX3CRV-f": {
        "cToken": "0x2ec70d3Ff3FD7ac5c2a72AAA64A398b6CA7428A5",
        "plugin": "0xd88e89ac6a0859e9b91078cb2a183a36ba6c8933",
        "lpToken": "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
        "depositContract": "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
        "rewardsContract": "0xB900EF131301B307dB5eFcbed9DBb50A3e209B2e"
    },
    "steCRV": {
        "cToken": "0xe71b4Cb8A99839042C45CC4cAca31C85C994E79f",
        "plugin": "0x00da328ea462f75325770aaf1ade0f457ddbedc0",
        "lpToken": "0x06325440D014e39736583c165C2963BA99fAf14E",
        "depositContract": "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
        "rewardsContract": "0x0A760466E1B4621579a82a39CB56Dda2F4E70f03"
    },
    "UST_whv23CRV-f": {
        "cToken": "0xEee0de9187B8B1Ba554E406d0b36a807A00B0ea5",
        "plugin": "0xdee1fff7c1f8bafe2767c72a3afe81e3a944ef7e",
        "lpToken": "0xCEAF7747579696A2F0bb206a14210e3c9e6fB269",
        "depositContract": "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
        "rewardsContract": "0x7e2b9B5244bcFa5108A76D5E7b507CFD5581AD4A"
    },
    "crv3crypto": {
        "cToken": "0x03c2d837e625e0f5cc8f50084b7986863c82102c",
        "plugin": "0x91d0baba3d6950b2d0f175259de54ccbc0665f6b",
        "lpToken": "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff",
        "depositContract": "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
        "rewardsContract": "0x9D5C5E364D81DaB193b72db9E9BE9D8ee669B652"
    },
    "D3-f": {
        "cToken": "0x97b8c935e130cBa777579Ea2460c4C3e78a48a61",
        "plugin": "0xeb25e03c5a1d7f8f27c89f3d8e24f3299bde2cc2",
        "lpToken": "0xBaaa1F5DbA42C3389bDbc2c9D2dE134F5cD0Dc89",
        "depositContract": "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
        "rewardsContract": "0x329cb014b562d5d42927cfF0dEdF4c13ab0442EF"
    },
    "FEI3CRV3CRV-f": {
        "cToken": "0x5E479875Ed69d4F09f7bCAaF71E9879b12d9e326",
        "plugin": "0x45870945f84c997fe426c2640d6a04f165d67d6a",
        "lpToken": "0x06cb22615BA53E60D67Bf6C341a0fD5E718E1655",
        "depositContract": "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
        "rewardsContract": "0x3133A4428AAC0b4ad96a09845363386ECd289A9c"
    },
    "alUSD3CRV-f": {
        "cToken": "0x3c37CdA5C30952E48aFcc40443A9296e59DAAcA9",
        "plugin": "0x7e5723782f6274124bdbe5bea7202c62813d939e",
        "lpToken": "0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c",
        "depositContract": "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
        "rewardsContract": "0x02E2151D4F351881017ABdF2DD2b51150841d5B3"
    }
}

export default PluginModal