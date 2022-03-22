import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Flex,
    VStack,
    HStack,
    useToast,
    Avatar,
    Image,
    Box,
    Accordion,
    AvatarGroup,
} from "@chakra-ui/react"
import { CTokenAvatarGroup, CTokenIcon } from "components/shared/Icons/CTokenIcon"
import { POOL_156_COMPTROLLER } from "constants/convex"
import { useRari } from "context/RariContext"
import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN"
import { BigNumber, constants } from "ethers"
import { commify, parseEther } from "ethers/lib/utils"
import { formatEther } from "ethers/lib/utils"
import { FlywheelPluginRewardsMap, useConvexPoolIncentives } from "hooks/convex/useConvexRewards"
import { useCurveLPBalances, useStakedConvexBalances } from "hooks/convex/useStakedConvexBalances"
import { useBorrowLimit, useTotalSupply } from "hooks/useBorrowLimit"
import { useFusePoolData } from "hooks/useFusePoolData"
import useHasApproval from "hooks/useHasApproval"
import { useTokensDataAsMap } from "hooks/useTokenData"
import { Button, ExpandableCard, Heading } from "rari-components";
import { useEffect, useMemo, useState } from "react"
import { useQuery } from "react-query"
import { TokensDataMap } from "types/tokens"
import { shortUsdFormatter, smallStringUsdFormatter } from "utils/bigUtils"
import { checkAllowanceAndApprove, collateralize, deposit, unstakeAndWithdrawCVXPool } from "utils/convex/migratePositions"
import { handleGenericError } from "utils/errorHandling"
import { USDPricedFuseAsset } from "utils/fetchFusePoolData"

export const CVXMigrateModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean,
    onClose: () => void,
}) => {

    const { address, fuse } = useRari()
    const cvxBalances = useStakedConvexBalances()
    const curveLPBalances = useCurveLPBalances()

    // Fuse pool Data
    const fusePoolData = useFusePoolData("156")
    const { incentives } = useConvexPoolIncentives(fusePoolData?.comptroller) ?? { incentives: {} };

    const assets = !fusePoolData ? [] : fusePoolData.assets.filter(a => Object.keys(cvxBalances).includes(a.cToken) || Object.keys(curveLPBalances).includes(a.underlyingToken))
    const [assetIndex, setAssetIndex] = useState(0)
    const tokenData = useTokensDataAsMap(assets.map(a => a.underlyingToken))

    // Steppers
    const toast = useToast()
    const [step, setStep] = useState<number | undefined>()
    const [activeStep, setActiveStep] = useState<number | undefined>()


    // marketAddr -> underlying
    const marketsUnderlyingMap: { [underlying: string]: string } = assets.reduce((obj, asset) => ({
        ...obj,
        [asset.cToken]: asset.underlyingToken
    }), {})

    // marketAddr -> migratable balances data
    const marketsBalancesMap: {
        [marketAddr: string]: {
            stakedBalance: BigNumber,
            curveBalance: BigNumber,
            total: BigNumber
        }
    } = assets.reduce((obj, asset) => {
        const stakedBalance = cvxBalances[asset.cToken]?.balance ?? constants.Zero
        const curveBalance = curveLPBalances[asset.underlyingToken] ?? constants.Zero
        const total = stakedBalance.add(curveBalance)

        if (total.isZero()) return { ...obj }
        return {
            ...obj,
            [asset.cToken]: {
                stakedBalance,
                curveBalance,
                total
            }
        }
    }, {})

    const market = assets[assetIndex]
    const marketBalanceForAsset = marketsBalancesMap[market?.cToken]
    const pluginIncentivesForAsset = incentives[market?.cToken]

    // Simulates you depositing all your CVX positions into us - to get projected totalSupply & projected borrowLimit
    const { data: updatedUserAssets } = useQuery('updated assets for convex user ' + address, async () => {

        const ethPrice = await getEthUsdPriceBN()

        const updatedUserAssets: USDPricedFuseAsset[] = fusePoolData?.assets.reduce((arr: USDPricedFuseAsset[], asset) => {
            if (Object.keys(marketsBalancesMap).includes(asset.cToken)) {
                const assetToBeUpdated = asset
                const amount = (marketsBalancesMap[asset.cToken].total)

                const supplyBalance = assetToBeUpdated.supplyBalance.add(amount);
                const totalSupply = assetToBeUpdated.totalSupply.add(amount);

                // Todo - figure out where to better div by 1e18
                const updatedAsset: USDPricedFuseAsset = {
                    ...assetToBeUpdated,
                    supplyBalance,
                    supplyBalanceUSD: supplyBalance
                        .mul(assetToBeUpdated.underlyingPrice)
                        .mul(parseEther(ethPrice.toString()))
                        .div(constants.WeiPerEther)
                        .div(constants.WeiPerEther)
                        .div(constants.WeiPerEther)
                        .div(constants.WeiPerEther),
                    totalSupply,
                    membership: true
                }
                return [...arr, updatedAsset]
            }
            return [...arr, asset]
        }, []) ?? []

        return updatedUserAssets
    })

    // Simulated position
    const borrowLimit = useBorrowLimit(updatedUserAssets ?? [])
    const newTotalSupply = useTotalSupply(updatedUserAssets ?? [])

    /*  Unstakes and Claims all CVX Staked Positions supported by Fuse  */
    const handleUnstake = async () => {
        const { stakedBalance } = marketBalanceForAsset
        try {
            setActiveStep(1)
            if (stakedBalance.gt(0)) {
                const baseRewardPool = cvxBalances[assets[assetIndex].cToken].baseRewardsPool
                const res = await unstakeAndWithdrawCVXPool(fuse, baseRewardPool)
                setStep(2)

            }
        } catch (err) {
            setActiveStep(undefined)

            handleGenericError(err, toast)
        }
    }

    // Approve for stakedBalance + curveBalance
    const handleApproveMarket = async () => {
        const { cToken, underlyingToken } = assets[assetIndex]
        const { total } = marketBalanceForAsset
        try {
            setActiveStep(2)
            const res = await checkAllowanceAndApprove(fuse, address, cToken, underlyingToken, total)
            console.log({ res })
            setStep(3)
        } catch (err) {
            setActiveStep(undefined)

            handleGenericError(err, toast)
        }
    }

    // Deposit curveBalance
    const handleDeposit = async () => {
        const { cToken } = assets[assetIndex]
        const { curveBalance } = marketBalanceForAsset
        try {
            setActiveStep(3)
            const res = await deposit(fuse, cToken, curveBalance)
            console.log({ res })
            setStep(4)
        } catch (err) {
            setActiveStep(undefined)

            handleGenericError(err, toast)
        }
    }

    // Collateralize all
    const handleCollateralize = async () => {
        const markets = Object.keys(marketsBalancesMap)
        try {
            setActiveStep(4)
            const res = await collateralize(fuse, POOL_156_COMPTROLLER, markets)
            console.log({ res })
            setStep(5)
        } catch (err) {
            setActiveStep(undefined)

            handleGenericError(err, toast)
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display="flex" width="100%" alignSelf="center">
                        <HStack>
                            <Image src="/static/icons/convex.svg" boxSize="40px" />
                            <Text fontSize="lg" mr={4} alignSelf="center">
                                Migrate Staked CVX Positions to Fuse
                            </Text>
                        </HStack>

                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>

                        <Flex direction="column" height="100%">
                            {/* <AppLink isExternal={true} href="https://www.convexfinance.com/stake"> */}
                            <VStack align="stretch" my={2}>
                                <Text>
                                    We detected <b>{newTotalSupply.isZero() ? '?' : smallStringUsdFormatter(newTotalSupply.toString())}</b> from {Object.keys(cvxBalances).length}{' '}
                                    staked Convex positions
                                    {!!(Object.keys(curveLPBalances)).length && ` and ${Object.keys(curveLPBalances).length} Curve LP tokens`}.
                                    You can keep earning CVX + CRV rewards and borrow up to <b>{borrowLimit.isZero() ? '?' : smallStringUsdFormatter(borrowLimit.toString())}</b> by migrating them to Fuse.</Text>
                                {/* Select from available markets */}
                                <Accordion allowToggle index={assetIndex} onChange={(i: number) => setAssetIndex(i)}>
                                    <VStack align="stretch" py={4}>
                                        {Object.keys(marketsBalancesMap).map((market, i) =>
                                            <Market
                                                assetIndex={assetIndex}
                                                asset={assets[i]}
                                                setAssetIndex={setAssetIndex}
                                                i={i}
                                                tokensData={tokenData}
                                                marketsUnderlyingMap={marketsUnderlyingMap}
                                                marketBalanceForAsset={marketsBalancesMap[market]}
                                                step={step}
                                                activeStep={activeStep}
                                                setStep={setStep}
                                                handleUnstake={handleUnstake}
                                                handleApproveMarket={handleApproveMarket}
                                                handleDeposit={handleDeposit}
                                                handleCollateralize={handleCollateralize}
                                                updatedAssets={updatedUserAssets}
                                                pluginIncentivesForAsset={pluginIncentivesForAsset}
                                            />
                                        )}
                                    </VStack>
                                </Accordion>
                            </VStack>
                        </Flex>
                    </ModalBody>
                    <ModalFooter mt={2}>
                        {!localStorage.RARI_HIDE_MIGRATOR_POPUP && (
                            <Button bg="grey"
                                onClick={() => {
                                    localStorage.setItem("RARI_HIDE_MIGRATOR_POPUP", "true")
                                    onClose()
                                }}
                            >
                                <Text>Close and Don't Show Again</Text>
                            </Button>
                        )}
                        <Button colorScheme="blue" onClick={onClose} ml={2}>
                            <Text>Close</Text>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

const Market = ({
    assetIndex,
    asset,
    i,
    tokensData,
    marketsUnderlyingMap,
    marketBalanceForAsset,
    step,
    activeStep,
    setStep,
    handleUnstake,
    handleApproveMarket,
    handleDeposit,
    handleCollateralize,
    updatedAssets,
    pluginIncentivesForAsset
}: {
    assetIndex: number,
    setAssetIndex: (step: number) => void,
    asset: USDPricedFuseAsset,
    i: number;
    tokensData: TokensDataMap,
    marketsUnderlyingMap: { [underlying: string]: string },
    marketBalanceForAsset: {
        stakedBalance: BigNumber,
        curveBalance: BigNumber,
        total: BigNumber
    },
    step: number | undefined,
    activeStep: number | undefined,
    setStep: (step: number | undefined) => void,
    handleUnstake: any,
    handleApproveMarket: any,
    handleDeposit: any,
    handleCollateralize: any,
    updatedAssets: USDPricedFuseAsset[] | undefined,
    pluginIncentivesForAsset: FlywheelPluginRewardsMap | undefined,
}) => {

    const hasApproval = useHasApproval(asset, marketBalanceForAsset?.total.toString() ?? "0")
    const showApproval = !hasApproval
    // We show enable as Collateral only if this asset has not yet been anabled
    const showEnableAsCollateral = !asset?.membership
    // If you dont have any staked, you dont need to unstake to enter this market
    const showUnstake = !marketBalanceForAsset?.stakedBalance?.isZero() ?? true

    const tokenData = tokensData[asset?.underlyingToken]
    const activeSymbol = tokenData?.symbol ?? asset?.underlyingSymbol

    const [numClicks, setNumClicks] = useState(3)

    const updatedAsset = useMemo(() => {
        if (!!updatedAssets && !!asset) {
            return updatedAssets.find(a => a.cToken === asset.cToken)
        }
    }, [updatedAssets, asset])

    const rewardTokens = Object.keys(pluginIncentivesForAsset ?? {})?.map((flywheel, i) => pluginIncentivesForAsset?.[flywheel].rewardToken) ?? []
    const apr = Object.values(pluginIncentivesForAsset ?? {})?.reduce((number, value) => value.formattedAPR + number, 0) ?? 0

    // Skip to step conditionally
    useEffect(() => {
        let clicks = 3
        if (!showUnstake) {
            setStep(2)
            clicks -= 1
        }
        if (hasApproval) {
            setStep(3)
            clicks -= 1
        }
        else setStep(undefined)
        setNumClicks(clicks)
    }, [assetIndex])


    return (
        <ExpandableCard
            variant="light"
            p={3}
            inAccordion={true}
            expandableChildren={
                <Box textAlign="center">
                    <VStack align="center" pb={3}>
                        <Text>
                            Migrate <b>{activeSymbol}</b> in {numClicks} click{numClicks !== 1 && 's'} and earn
                        </Text>
                        <HStack>
                            <CTokenAvatarGroup tokenAddresses={rewardTokens} size="xs" max={30} ml={1} mr={1} />
                            <Text color={tokenData?.color} pl={1} fontSize="sm" fontWeight={"bold"}>
                                {apr.toFixed(2)}% APR
                            </Text>
                        </HStack>
                    </VStack>


                    <VStack py={2} align="stretch">
                        {showUnstake && (
                            <Button disabled={!!step && step !== 1} onClick={handleUnstake}>
                                {
                                    activeStep === 1 ? "Unstaking and Claiming..." : `Unstake ${activeSymbol} and Claim Rewards`
                                }
                            </Button>
                        )}

                        {showApproval && (
                            <Button disabled={step !== 2} onClick={handleApproveMarket}>
                                {
                                    activeStep === 2 ? `Approving ${activeSymbol}...` : ` Approve ${activeSymbol}`
                                }
                            </Button>
                        )}

                        <Button disabled={step !== 3} onClick={handleDeposit}>
                            {
                                activeStep === 3 ? `Depositing ${activeSymbol}...` : ` Deposit ${activeSymbol}`
                            }
                        </Button>

                        {showEnableAsCollateral && step === 4 && <HStack>
                            <Button disabled={step !== 4} onClick={handleCollateralize}>
                                {
                                    activeStep === 4 ? `Collateralizing...` : `Collateralize`
                                }
                            </Button>
                        </HStack>}

                        {step === 5 && <Text>Done!</Text>}
                    </VStack>
                </Box>
            }
        >
            <VStack>
                <HStack key={asset.cToken}>
                    <Avatar src={tokensData[marketsUnderlyingMap[asset.cToken]]?.logoURL} />
                    <Heading>
                        {activeSymbol}
                    </Heading>
                </HStack>
                <HStack>
                    <Text>
                        {commify(parseFloat(formatEther(marketBalanceForAsset.stakedBalance)).toFixed(2))} staked
                    </Text>
                    <Text>
                        &middot;
                    </Text>
                    <Text>
                        {commify(parseFloat(formatEther(marketBalanceForAsset.curveBalance)).toFixed(2))} unstaked
                    </Text>
                </HStack>
            </VStack>
        </ExpandableCard>
    )
}




export default CVXMigrateModal
