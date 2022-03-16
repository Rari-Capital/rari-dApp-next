
// Chakra and UI
import {
    Text,
    useDisclosure,
    AvatarGroup,
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

    return (
        <>
            <PluginModal market={market} rewardTokens={rewardTokens} isOpen={isOpen} onClose={onClose} tokenData={tokenData} />
            <Row
                // ml={1}
                // mb={.5}
                crossAxisAlignment="center"
                mainAxisAlignment="flex-end"
                py={2}
                zIndex={10}
                onClick={(e) => {
                    e.stopPropagation();
                    onOpen();
                }}
            >
                <Text fontWeight="bold" mr={1}>
                    + 🔌
                </Text>
                <SimpleTooltip label={"Click for more info"}>
                    <AvatarGroup size="xs" max={30} ml={2} mr={1} spacing={1} >
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
                </SimpleTooltip>
            </Row>
        </>
    )
}