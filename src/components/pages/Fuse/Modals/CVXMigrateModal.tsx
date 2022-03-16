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
    Spacer,
    Button,
    HStack,
    useToast,
    Avatar,
    Box
} from "@chakra-ui/react"
import { POOL_156_COMPTROLLER } from "constants/convex"
import { useRari } from "context/RariContext"
import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN"
import { BigNumber, constants } from "ethers"
import { commify, parseEther } from "ethers/lib/utils"
import { formatEther } from "ethers/lib/utils"
import { useCurveLPBalances, useStakedConvexBalances } from "hooks/convex/useStakedConvexBalances"
import { useBorrowLimit, useTotalSupply } from "hooks/useBorrowLimit"
import { useFusePoolData } from "hooks/useFusePoolData"
import useHasApproval from "hooks/useHasApproval"
import { useTokensDataAsMap } from "hooks/useTokenData"
import { useEffect, useMemo, useState } from "react"
import { useQuery } from "react-query"
import { smallStringUsdFormatter } from "utils/bigUtils"
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

    const { fuse, address } = useRari()
    const _cvxBalances = useStakedConvexBalances()
    const curveLPBalances = useCurveLPBalances()

    // Steppers
    const toast = useToast()
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | undefined>()
    const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5 | undefined>()

    const [assetIndex, setAssetIndex] = useState(0)

    const cvxBalances = useMemo(() => _cvxBalances, [])
    const fusePoolData = useFusePoolData("156")

    const assets = !fusePoolData ? [] : fusePoolData.assets.filter(a => Object.keys(cvxBalances).includes(a.cToken) || Object.keys(curveLPBalances).includes(a.underlyingToken))
    const curveAssets = !fusePoolData ? [] : fusePoolData.assets.filter(a => Object.keys(curveLPBalances).includes(a.underlyingToken))


    const marketsUnderlyingMap: { [underlying: string]: string } = assets.reduce((obj, asset) => ({
        ...obj,
        [asset.cToken]: asset.underlyingToken
    }), {})

    const marketsBalancesMap: {
        [cToken: string]: {
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


    // Simulates u depositing all your CVX positions into us >:)
    const { data: updatedUserAssets } = useQuery('updated assets for convex user ' + address, async () => {

        const ethPrice = await getEthUsdPriceBN()

        const updatedUserAssets: USDPricedFuseAsset[] = fusePoolData?.assets.reduce((arr: USDPricedFuseAsset[], asset) => {
            if (Object.keys(marketsBalancesMap).includes(asset.cToken)) {
                const assetToBeUpdated = asset
                const amount = (marketsBalancesMap[asset.cToken].total)

                console.log({ assetToBeUpdated, amount })

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

    const borrowLimit = useBorrowLimit(updatedUserAssets ?? [])
    const newTotalSupply = useTotalSupply(updatedUserAssets ?? [])

    const tokenData = useTokensDataAsMap(assets.map(a => a.underlyingToken))

    console.log({ tokenData, marketsBalancesMap, marketsUnderlyingMap, updatedUserAssets, borrowLimit })

    const marketBalance = marketsBalancesMap[assets[assetIndex]?.cToken]

    /*  Unstakes and Claims all CVX Staked Positions supported by Fuse  */
    const handleUnstake = async () => {
        const { stakedBalance } = marketBalance
        try {
            setActiveStep(1)
            if (stakedBalance.gt(0)) {
                const baseRewardPool = cvxBalances[assets[assetIndex].cToken].baseRewardsPool
                const res = await unstakeAndWithdrawCVXPool(fuse, baseRewardPool)
            }
        } catch (err) {
            setActiveStep(undefined)
            handleGenericError(err, toast)
        }
        setStep(2)
    }

    // Approve for stakedBalance + curveBalance
    const handleApproveMarket = async () => {
        const { cToken, underlyingToken } = assets[assetIndex]
        const { total } = marketBalance
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
        const { curveBalance } = marketBalance
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

    const activeSymbol = tokenData[assets[assetIndex]?.underlyingToken]?.symbol

    const hasApproval = useHasApproval(assets[assetIndex], marketBalance?.total.toString() ?? "0")

    const showEnableAsCollateral = !assets[assetIndex]?.membership

    const showUnstake = !marketBalance?.stakedBalance?.isZero() ?? true

    const showApproval = !hasApproval

    useEffect(() => {
        if (!showUnstake) setStep(2)
        else if (hasApproval) setStep(3)
        else setStep(undefined)
    }, [assetIndex])


    console.log({ marketBalance, showUnstake })

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display="flex" width="100%" alignSelf="center">
                        <Text fontSize="lg" mr={4} alignSelf="center">
                            🔌 Migrate Staked CVX to Fuse Pool 156
                        </Text>
                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>

                        <Flex direction="column" height="100%">
                            {/* <AppLink isExternal={true} href="https://www.convexfinance.com/stake"> */}
                            <VStack align={"flex-start"} my={2}>
                                <Text>We detected <b>{smallStringUsdFormatter(newTotalSupply.toString())}</b> from {Object.keys(cvxBalances).length} staked Convex positions {!!curveAssets.length && ` and ${curveAssets.length} Curve LP tokens`}. You can borrow up to <b>{smallStringUsdFormatter(borrowLimit.toString())}</b> by migrating them to Fuse.</Text> 
                                <HStack>
                                    {Object.keys(marketsBalancesMap).map((market, i) =>
                                        <Box onClick={() => setAssetIndex(i)} bg={assetIndex === i ? "aqua" : "white"} border="1px solid red">
                                            <VStack>
                                                <HStack key={market}>
                                                    <Avatar src={tokenData[marketsUnderlyingMap[market]]?.logoURL} />
                                                    <Text>
                                                        {tokenData[marketsUnderlyingMap[market]]?.symbol}
                                                    </Text>
                                                </HStack>
                                                <Text>
                                                    {commify(parseFloat(formatEther(marketsBalancesMap[market].stakedBalance)).toFixed(2))} staked
                                                </Text>
                                                <Text>
                                                    {commify(parseFloat(formatEther(marketsBalancesMap[market].curveBalance)).toFixed(2))} in Curve
                                                </Text>
                                            </VStack>
                                        </Box>
                                    )}
                                </HStack>
                                <Spacer />
                                <Text>
                                    Migrate {activeSymbol} in 3 clicks
                                </Text>

                                {showUnstake && (
                                    <HStack>
                                        <Text>
                                            1.)
                                        </Text>
                                        <Button colorScheme="blue" disabled={!!step && step !== 1} onClick={handleUnstake}>
                                            {
                                                activeStep === 1 ? "Unstaking and Claiming..." : `Unstake ${activeSymbol} and Claim Rewards`
                                            }
                                        </Button>
                                    </HStack>
                                )}

                                {showApproval && (
                                    <HStack>
                                        <Text>
                                            2.)
                                        </Text>
                                        <Button colorScheme="blue" disabled={step !== 2} onClick={handleApproveMarket}>
                                            {
                                                activeStep === 2 ? `Approving ${activeSymbol}...` : ` Approve ${activeSymbol}`
                                            }
                                        </Button>
                                    </HStack>
                                )}

                                <HStack>
                                    <Text>
                                        3.)
                                    </Text>
                                    <Button colorScheme="blue" disabled={step !== 3} onClick={handleDeposit}>
                                        {
                                            activeStep === 3 ? `Depositing ${activeSymbol}...` : ` Deposit ${activeSymbol}`
                                        }
                                    </Button>
                                </HStack>

                                {showEnableAsCollateral && step === 4 && <HStack>
                                    <Text>
                                        4.)
                                    </Text>
                                    <Button colorScheme="blue" disabled={step !== 4} onClick={handleCollateralize}>
                                        {
                                            activeStep === 4 ? `Collateralizing...` : `Collateralize`
                                        }
                                    </Button>
                                </HStack>}

                                {step === 5 && <Text>Done!</Text>}

                            </VStack>
                        </Flex>
                    </ModalBody>
                    <ModalFooter mt={2}>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}



export default CVXMigrateModal