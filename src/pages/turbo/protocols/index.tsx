import { useAllSafes } from "hooks/turbo/useAllSafes";
import { NextPage } from "next";
import SafeCard from 'components/pages/Turbo/TurboIndexPage/SafeCard'
import { useSafeInfo } from "hooks/turbo/useSafeInfo";
import { Avatar, Box, Flex, HStack, Image, SimpleGrid, Spinner, VStack } from "@chakra-ui/react";
import { Heading, HoverableCard, Link, Statistic, Text, TokenIcon } from "rari-components";
import { motion } from "framer-motion";
import TurboLayout from 'components/pages/Turbo/TurboLayout';
import { commify, formatEther } from "ethers/lib/utils";
import { useTrustedStrategies } from "hooks/turbo/useTrustedStrategies";
import { StrategyInfosMap, useERC4626StrategiesDataAsMap } from "hooks/turbo/useStrategyInfo";
import { useAllUserSafes } from "hooks/turbo/useUserSafes";
import useAggregateSafeData from "hooks/turbo/useAggregateSafeData";
import { smallUsdFormatter } from "utils/bigUtils";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";

type AuthorizedUser = {
    address: string,
    protocolName: string,
    logo: string
}

const authorizedUsers: AuthorizedUser[] = [
    {
        address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        protocolName: "Olympus DAO",
        logo: "0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5"
    },
    {
        address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        protocolName: "Balancer DAO",
        logo: "0xba100000625a3754423978a60c9317c58a424e3d"
    }
]

const Page: NextPage = () => {
    return (
        <TurboLayout>
            <Heading size="2xl" color="white">Protocols using Turbo</Heading>
            <ProtocolGrid/>
        </TurboLayout>
    )
};

const ProtocolGrid = () => {
    const allStrategies = useTrustedStrategies();
    const getERC4626StrategyData = useERC4626StrategiesDataAsMap(allStrategies);
    
    return (
    <SimpleGrid columns={[1, 1, 2, 2]} spacing={4} mt={12}>
        {authorizedUsers.map((user: AuthorizedUser) => {
            return (
                <ProtocolCard user={user} getERC4626StrategyData={getERC4626StrategyData}/>
            )})
        }
    </SimpleGrid>
    )
}


const ProtocolCard = ({
    user,
    getERC4626StrategyData,
} : {
    user: AuthorizedUser,
    getERC4626StrategyData: StrategyInfosMap,
}) => {
    const safes = useAllUserSafes(user.address)

    
    return (
        <Link href={`/turbo/safe/${user.address}`}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ width: "100%" }}
            >
                <HoverableCard w="100%" display="flex" alignItems="center" justifyContent="center" cursor="pointer" height="300px">
                {(hovered) => (
                    <VStack spacing={10}>
                        <Box opacity={hovered ? 0.5 : 1} transition="0.2s opacity">
                            <HStack justify={"center"}>
                                <TokenIcon
                                    tokenAddress={user.logo}
                                    boxSize={100}
                                    mr={2}
                                    alignSelf='center'
                                />
                                <h1     >{user.protocolName}</h1>
                            </HStack>
                        </Box>
                        { safes ? <AggregateSafeStatis safes={safes} getERC4626StrategyData={getERC4626StrategyData}/> : <Spinner />}
                    </VStack>
                )}
                </HoverableCard>
            </motion.div>
        </Link>
    )
}

const AggregateSafeStatis = ({
    safes, 
    getERC4626StrategyData
}: {
    safes: SafeInfo[],
    getERC4626StrategyData: StrategyInfosMap
}) => {
    const { totalBoosted, totalClaimableUSD, netAPY } = useAggregateSafeData(
        safes,
        getERC4626StrategyData
      );

    console.log({safes})
    return (
        <HStack spacing={8}>
            <Statistic
                margin={0}
                textAlign="center"
                title="Total boosted"
                // TODO(sharad-s) What should these tooltips say?
                tooltip="FEI Boosted across all your safes"
                value={
                    <Text fontSize="2xl">
                    {commify(parseFloat(formatEther(totalBoosted)).toFixed(2)) + " FEI"}
                    </Text>
                }
            />
            <Statistic
                margin={0}
                textAlign="center"
                title="Total claimable interest"
                tooltip="Claimable FEI across all your safes"
                value={
                    <Text fontSize="2xl">
                        {smallUsdFormatter(totalClaimableUSD)}
                    </Text>
                }
            />
            <Statistic
                margin={0}
                textAlign="center"
                title="Avg. APY"
                tooltip="Avg APY Across all your safes"
                value={
                    // TODO(sharad-s) click here to toggle between states -- delete when
                    // real implementation is done
                    <Flex
                    alignItems="center"
                    // onClick={() => setApyIncreasing(!apyIncreasing)}
                    >
                    <Text fontSize="2xl">
                        {netAPY.toFixed(2)}%
                    </Text>
                    {/* {apyIncreasing ? (
                        <TriangleUpIcon color="success" />
                    ) : (
                        <TriangleDownIcon color="danger" />
                    )} */}
                    </Flex>
                }
            />
        </HStack>
    )
}


{/* 
            <SimpleGrid columns={[1, 1, 2, 3]} spacing={4} mt={12}>
                {safes.map((safe: string) => {
                    if (safe === EMPTY_ADDRESS) return
                    return <SafeWrapper safeAddress={safe}/>
                })}
            </SimpleGrid>
       </TurboLayout> */}
const SafeWrapper = ({safeAddress}: {safeAddress: string}) => {
    const safeWithInfo = useSafeInfo(safeAddress)

    if (!safeWithInfo) return <Spinner/>
    
    return (
        <SafeCard safe={safeWithInfo} previewMode={true}/>
    )
}
export default Page