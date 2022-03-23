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
    Input,
    useToast,
} from "@chakra-ui/react"
import { useRari } from "context/RariContext";
import { parseEther } from "ethers/lib/utils";
import { useTokenData } from "hooks/useTokenData";
import { createSafeAndDeposit } from "lib/turbo/transactions/createSafeAndDeposit";
import { createSafe } from "lib/turbo/transactions/safe";
import { TRIBE } from "lib/turbo/utils/constants";
import { Button } from "rari-components";
import { useState } from "react";
import { handleGenericError } from "utils/errorHandling";

export const CreateSafeModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean,
    onClose: () => void,
}) => {
    const {address, provider, chainId } = useRari()

    const [amount, setAmount] = useState<string>("0");
    const [underlyingToken, setUnderlyingToken] = useState(TRIBE)


    const [creating, setCreating] = useState(false)

    const tokenData = useTokenData(underlyingToken)


    // Utils
    const toast = useToast();

    const handleCreateSafe = async () => {
        if (!address || !provider || !chainId) return;

        const amountBN = parseEther(amount);

        if(!amountBN.isZero()) {
            try {
                setCreating(true)
                const receipt = await createSafeAndDeposit(
                    provider.getSigner(),
                    amountBN,
                    chainId
                );
                console.log({receipt})
            } catch (err) {
                handleGenericError(err, toast)
                console.log({err})
            } finally {
             setCreating(false)
            }
        } else {
            try {
                setCreating(true)
                const receipt = await createSafe(
                    underlyingToken, 
                    provider, 
                    chainId
                    )
                console.log({receipt})
            } catch (err) {
                handleGenericError(err, toast)
                console.log({err})
            } finally {
                setCreating(false)
            }
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display="flex" width="100%" alignSelf="center">
                        <Text fontSize="lg" mr={4} alignSelf="center">
                           🏦 Create Safe for {tokenData?.symbol}
                        </Text>
                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <Flex direction="column" height="100%">
                            <VStack align={"flex-start"} my={2}>
                                <Spacer />
                                <Text>
                                    The first step towards using Turbo is creating a safe, which allows you to boost pools by depositing a collateral type that has been approved by the Tribe DAO governance.
                                </Text>

                                <Text>
                                    Do you want to deposit TRIBE
                                </Text>
                                <Input
                                    type="number"
                                    onChange={e => setAmount(e.target.value)}
                                />

                                <Button onClick={handleCreateSafe} disabled={creating}>
                                    {creating ? "Creating..." : amount !== "0" ? "Create Safe and Deposit" : "Create Safe"}
                                </Button>
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



export default CreateSafeModal