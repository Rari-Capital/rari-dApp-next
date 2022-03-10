import { InfoIcon } from "@chakra-ui/icons";
import { Box, VStack, Text, Button, HStack, Heading, Spinner, Image, Avatar } from "@chakra-ui/react";
// import { Card} from "rari-components";
import { flywheels, useConvexMaxClaimable } from "hooks/convex/useConvexRewards"
import { formatEther } from "ethers/lib/utils";
import DashboardBox from "../DashboardBox";
import { motion } from "framer-motion";
import { Column, Row } from "lib/chakraUtils";
import { SimpleTooltip } from "../SimpleTooltip";
import { useState } from "react";
import { useTokensDataAsMap } from "hooks/useTokenData";

export const ConvexRewardsRow = () => {
    // New - Convex Stuff
    const { flywheelRewardsTotals, call, hasClaimable: hasClaimableConvexRewards } = useConvexMaxClaimable()
    const [claiming, setClaiming] = useState(false)

    const tokensData = useTokensDataAsMap((Object.values(flywheels ?? {})).map(({ rewardToken }) => rewardToken))

    const handleMaxClaim = async () => {
        setClaiming(true)
        try {
            if (call) await call();
        } catch (err) {
            console.log(err)
        } finally {
            setClaiming(false)
        }

    };

    if (!hasClaimableConvexRewards) return null
    // else return <Heading>HI</Heading>

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ width: "100%", height: "100%" }}
        >
            <DashboardBox w="100%" h="100%">
                <Row
                    expand
                    mainAxisAlignment="flex-start"
                    crossAxisAlignment="center"
                    p={3}
                >
                    {/* Token and Pools */}
                    <Column
                        expand
                        mainAxisAlignment="flex-start"
                        crossAxisAlignment="flex-start"
                        py={2}
                    >
                        {flywheelRewardsTotals && Object.keys(flywheelRewardsTotals).map(_f => {
                            let f = _f.toLowerCase()
                            const flywheelTotal = flywheelRewardsTotals[f]
                            const tokenSymbol = flywheels[f].rewardTokenSymbol;
                            const tokenAddress = flywheels[f].rewardToken;
                            const value = parseFloat(formatEther(flywheelTotal))

                            if (flywheelTotal.isZero()) return null
                            return <Row mainAxisAlignment="flex-start" crossAxisAlignment="center" my={1}>
                                <Avatar src={tokensData?.[tokenAddress]?.logoURL ?? ''} boxSize="20px" mr={2}/>
                                <SimpleTooltip
                                    label={value + ` ${tokenSymbol}`}
                                >
                                    <Text color="grey" fontSize="sm">
                                        {value.toFixed(3)} {tokenSymbol}
                                    </Text>
                                </SimpleTooltip>
                            </Row>
                        })}
                        <Row
                            expand
                            mainAxisAlignment="flex-start"
                            crossAxisAlignment="center"
                            px={6}
                            py={4}
                        // bg="aqua"
                        >
                            <ul>
                                <motion.li
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Text>Pool 156</Text>
                                </motion.li>
                            </ul>
                        </Row>
                    </Column>
                    {/* Reward amt and claim btn */}
                    <Column
                        expand
                        mainAxisAlignment="center"
                        crossAxisAlignment="center"
                        h="100%"
                    >
                        <Row
                            mainAxisAlignment="flex-start"
                            crossAxisAlignment="center"
                            // bg="pink"
                            h="100%"
                        >
                            {/* <SimpleTooltip
                                label={`${unclaimedAmount.toString()} ${rewardTokenData?.symbol
                                    }`}
                            >
                                <Text fontWeight="bold" ml={3}>
                                    {unclaimedAmount.toFixed(3)} {rewardTokenData?.symbol}
                                </Text>
                            </SimpleTooltip>
                            */}
                            <Button
                                ml={2}
                                bg="black"
                                onClick={() => handleMaxClaim()}
                                disabled={claiming}
                            >
                                {!!claiming ? <Spinner /> : "Claim"}
                            </Button>
                        </Row>
                    </Column>
                </Row>
            </DashboardBox>
        </motion.div>
    );
};