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
    Box,
    Image,
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
import { TokensDataMap } from "types/tokens"
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
    const cvxBalances = useStakedConvexBalances()
    const curveLPBalances = useCurveLPBalances()

    // Steppers
    const toast = useToast()
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | undefined>()
    const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5 | undefined>()

    // Fuse pool Data
    const fusePoolData = useFusePoolData("156")
    const assets = !fusePoolData ? [] : fusePoolData.assets.filter(a => Object.keys(cvxBalances).includes(a.cToken) || Object.keys(curveLPBalances).includes(a.underlyingToken))
    const [assetIndex, setAssetIndex] = useState(0)
    const tokenData = useTokensDataAsMap(assets.map(a => a.underlyingToken))

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

    const marketBalanceForAsset = marketsBalancesMap[assets[assetIndex]?.cToken]

    // Simulates you depositing all your CVX positions into us - to get projected totalSupply & projected borrowLimit
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


    // If you've already approved this market, skip
    const hasApproval = useHasApproval(assets[assetIndex], marketBalanceForAsset?.total.toString() ?? "0")
    const showApproval = !hasApproval
    // We show enable as Collateral only if this asset has not yet been anabled
    const showEnableAsCollateral = !assets[assetIndex]?.membership
    // If you dont have any staked, you dont need to unstake to enter this market
    const showUnstake = !marketBalanceForAsset?.stakedBalance?.isZero() ?? true

    const activeSymbol = tokenData[assets[assetIndex]?.underlyingToken]?.symbol

    // Skip to step conditionally
    useEffect(() => {
        if (!showUnstake) setStep(2)
        else if (hasApproval) setStep(3)
        else setStep(undefined)
    }, [assetIndex])


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
                            <VStack align={"flex-start"} my={2}>
                                <Text>
                                    We detected <b>{smallStringUsdFormatter(newTotalSupply.toString())}</b> from {Object.keys(cvxBalances).length}
                                    staked Convex positions
                                    {!!(Object.keys(curveLPBalances)).length && ` and ${Object.keys(curveLPBalances).length} Curve LP tokens`}.
                                    You can borrow up to <b>{smallStringUsdFormatter(borrowLimit.toString())}</b> by migrating them to Fuse.</Text>
                                {/* Select from available markets */}
                                <HStack>
                                    {Object.keys(marketsBalancesMap).map((market, i) =>
                                        <Market
                                            assetIndex={assetIndex}
                                            setAssetIndex={setAssetIndex}
                                            market={market}
                                            i={i}
                                            tokensData={tokenData}
                                            marketsUnderlyingMap={marketsUnderlyingMap}
                                            marketsBalancesMap={marketsBalancesMap}
                                        />
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

const Market = ({
    setAssetIndex,
    assetIndex,
    market,
    i,
    tokensData,
    marketsUnderlyingMap,
    marketsBalancesMap
}: {
    setAssetIndex: any,
    assetIndex: number,
    market: string,
    i: number;
    tokensData: TokensDataMap,
    marketsUnderlyingMap: { [underlying: string]: string },
    marketsBalancesMap: {
        [cToken: string]: {
            stakedBalance: BigNumber,
            curveBalance: BigNumber,
            total: BigNumber
        }
    }
}) => {
    return (
        <Box onClick={() => setAssetIndex(i)} bg={assetIndex === i ? "aqua" : "white"} border="1px solid red">
            <VStack>
                <HStack key={market}>
                    <Avatar src={tokensData[marketsUnderlyingMap[market]]?.logoURL} />
                    <Text>
                        {tokensData[marketsUnderlyingMap[market]]?.symbol}
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
    )
}



export default CVXMigrateModal