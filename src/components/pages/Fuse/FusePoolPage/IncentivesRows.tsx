
// Chakra and UI
import {
    Text,
    useDisclosure,
    AvatarGroup,
    HStack,
} from "@chakra-ui/react";
import { Row } from "lib/chakraUtils";
import { SimpleTooltip } from "components/shared/SimpleTooltip";

import { TokenData } from "hooks/useTokenData";

// Utils
import { USDPricedFuseAsset } from "utils/fetchFusePoolData";

import {
    CTokenIcon,
} from "components/shared/Icons/CTokenIcon";

import { CTokenRewardsDistributorIncentivesWithRates } from "hooks/rewards/useRewardAPY";

import { FlywheelPluginRewardsMap } from "hooks/convex/useConvexRewards";
import PluginModal from "../Modals/PluginModal/PluginRewardsModal";


export const RDIncentivesRow: React.FC<{
    incentives: CTokenRewardsDistributorIncentivesWithRates[],
    handleMouseEnter: any,
    handleMouseLeave: any,
    color: string,
    label: string,
    apr: number,
}> = ({ incentives, handleMouseEnter, handleMouseLeave, color, label, apr }) => {
    return (
        <Row
            // ml={1}
            // mb={.5}
            crossAxisAlignment="center"
            mainAxisAlignment="flex-end"
            py={2}
        >
            <Text fontWeight="bold" mr={1}>
                +
            </Text>
            <AvatarGroup size="xs" max={30} ml={2} mr={1} spacing={1}>
                {incentives?.map((supplyIncentive, i) => {
                    return (
                        <CTokenIcon
                            key={i}
                            address={supplyIncentive.rewardToken}
                            boxSize="20px"
                            onMouseEnter={() => handleMouseEnter(i)}
                            onMouseLeave={() => handleMouseLeave()}
                            _hover={{
                                zIndex: 9,
                                border: ".5px solid white",
                                transform: "scale(1.3);",
                            }}
                        />
                    );
                })}
            </AvatarGroup>
            <SimpleTooltip label={label}>
                <Text color={color} fontWeight="bold" pl={1} fontSize="sm">
                    {/* {(supplyIncentive.supplySpeed / 1e18).toString()}%  */}
                    {apr.toFixed(2)}% APR
                </Text>
            </SimpleTooltip>
        </Row>
    )
}

export const PluginIncentivesRow: React.FC<{
    incentives: FlywheelPluginRewardsMap,
    market: USDPricedFuseAsset,
    tokenData: TokenData | undefined
}> = ({ incentives, market, tokenData }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const rewardTokens = Object.keys(incentives).map((flywheel, i) => incentives[flywheel].rewardToken)
    const apr = Object.values(incentives).reduce((number, value) => value.formattedAPR + number, 0)

    return (
        <>
            <PluginModal market={market} rewardTokens={rewardTokens} isOpen={isOpen} onClose={onClose} tokenData={tokenData} />
            <Row
                // ml={1}
                // mb={.5}
                crossAxisAlignment="center"
                mainAxisAlignment="flex-end"
                py={4}
                zIndex={10}
                onClick={(e: any) => {
                    e.stopPropagation();
                    onOpen();
                }}
            >
                <HStack>
                    <Text fontWeight="bold" px={1} fontSize="sm">
                    {`🔌`}
                    </Text>
                </HStack>
                <SimpleTooltip label={"Click for more rewards info"}>
                    <HStack>
                        <AvatarGroup size="xs" max={30} ml={1} mr={1}>
                            {rewardTokens.map((rewardToken, i) => {
                                return (
                                    <CTokenIcon
                                        key={i}
                                        address={rewardToken}
                                        boxSize="20px"
                                        // onMouseEnter={() => handleMouseEnter(i)}
                                        // onMouseLeave={() => handleMouseLeave()}
                                        _hover={{
                                            zIndex: 9,
                                            border: ".5px solid white",
                                            transform: "scale(1.3);",
                                        }}
                                    />
                                );
                            })}
                        </AvatarGroup>
                        <Text color={tokenData?.color} fontWeight="bold" pl={1} fontSize="sm">
                            + {apr.toFixed(2)}% APR
                        </Text>
                    </HStack>
                </SimpleTooltip>
            </Row>
        </>
    )
}