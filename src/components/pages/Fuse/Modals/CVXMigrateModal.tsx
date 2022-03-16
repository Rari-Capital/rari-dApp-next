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
import { useAccountBalances } from "context/BalancesContext"
import { useRari } from "context/RariContext"
import { commify } from "ethers/lib/utils"
import { formatEther } from "ethers/lib/utils"
import { useFusePoolData } from "hooks/useFusePoolData"
import { useTokensDataAsMap } from "hooks/useTokenData"
import { useEffect, useMemo, useState } from "react"
import { checkAllowanceAndApprove, collateralize, deposit, unstakeAndWithdrawCVXPool } from "utils/convex/migratePositions"
import { handleGenericError } from "utils/errorHandling"

export const CVXMigrateModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean,
    onClose: () => void,
}) => {

    const { fuse, address } = useRari()
    const [_, __, cvxBalances] = useAccountBalances()

    const toast = useToast()
    const [step, setStep] = useState<1 | 2 | 3 | 4 | undefined>(3)
    const [assetIndex, setAssetIndex] = useState(0)

    const fusePoolData = useFusePoolData("156")

    const assets = useMemo(() => {
        return !fusePoolData ? [] : fusePoolData.assets.filter(a => Object.keys(cvxBalances).includes(a.cToken))
    }, [])
    const underlyingMarketsMap: { [underlying: string]: string } = assets.reduce((obj, asset) => ({
        ...obj,
        [asset.underlyingToken]: asset.cToken
    }), {})
    const tokenData = useTokensDataAsMap(assets.map(a => a.underlyingToken))

    console.log({ tokenData, underlyingMarketsMap })

    useEffect(() => {
        setStep(undefined)
    }, [assetIndex])


    /*  Unstakes and Claims all CVX Staked Positions supported by Fuse  */
    const handleUnstake = async () => {
        try {
            const baseRewardPool = cvxBalances[assets[assetIndex].cToken].baseRewardsPool
            const res = await unstakeAndWithdrawCVXPool(fuse, baseRewardPool)
            setStep(2)
        } catch (err) {
            handleGenericError(err, toast)
        }
    }

    const handleApproveMarket = async () => {
        const { cToken, underlyingToken } = assets[assetIndex]
        try {
            setStep(2)
            const res = await checkAllowanceAndApprove(fuse, address, cToken, underlyingToken, cvxBalances[cToken].balance)
            console.log({ res })
            setStep(3)
        } catch (err) {
            handleGenericError(err, toast)
        }
    }

    const handleDeposit = async () => {
        const { cToken } = assets[assetIndex]
        try {
            setStep(3)
            const res = await deposit(fuse, cToken, cvxBalances[cToken].balance)
            console.log({ res })
            setStep(4)
        } catch (err) {
            handleGenericError(err, toast)
        }
    }

    const handleCollateralize = async () => {
        const { membership } = assets[assetIndex]
        const markets = assets.map(({ cToken }) => cToken)
        if (!!membership) return
        try {
            setStep(4)
            const res = await collateralize(fuse, POOL_156_COMPTROLLER, markets)
            console.log({ res })
            setStep(4)
        } catch (err) {
            handleGenericError(err, toast)
        }
    }


    const activeSymbol = tokenData[assets[assetIndex].underlyingToken].symbol

    const showEnableAsCollateral = !assets[assetIndex].membership


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
                                <Text>We detected {assets.length} staked Convex positions </Text>
                                <ul>
                                    {Object.keys(tokenData).map((underlying, i) =>
                                        <Box onClick={() => setAssetIndex(i)} bg={assetIndex === i ? "aqua" : "white"}>
                                            <HStack key={underlying}>
                                                <Avatar src={tokenData[underlying].logoURL} />
                                                <Text>
                                                    {commify(parseFloat(formatEther(cvxBalances[underlyingMarketsMap[underlying]].balance)).toFixed(2))} {tokenData[underlying].symbol}
                                                </Text>
                                            </HStack>
                                        </Box>
                                    )}
                                </ul>
                                <Spacer />
                                <Text>
                                    Migrate {activeSymbol} in four clicks
                                </Text>

                                <HStack>
                                    <Text>
                                        1.)
                                    </Text>
                                    <Button disabled={!!step && step !== 1} onClick={handleUnstake}>Unstake {activeSymbol} and Claim Rewards</Button>
                                </HStack>

                                <HStack>
                                    <Text>
                                        2.)
                                    </Text>
                                    <Button disabled={step !== 2} onClick={handleApproveMarket}>Approve {activeSymbol}</Button>
                                </HStack>

                                <HStack>
                                    <Text>
                                        3.)
                                    </Text>
                                    <Button disabled={step !== 3} onClick={handleDeposit}>Deposit {activeSymbol}</Button>
                                </HStack>

                                {showEnableAsCollateral && <HStack>
                                    <Text>
                                        4.)
                                    </Text>
                                    <Button disabled={step !== 4} onClick={handleCollateralize}>Enable Collateral</Button>
                                </HStack>}




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