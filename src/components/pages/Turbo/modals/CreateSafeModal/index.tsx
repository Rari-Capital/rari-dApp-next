import {
    Box,
    Flex,
    Image,
    useToast,
    Stack,
    Button
} from "@chakra-ui/react"
import { Heading, Modal, Text, TokenIcon } from "rari-components/standalone";

// Hooks
import { useRari } from "context/RariContext";
import { useTokenData } from "hooks/useTokenData";
import { useState } from "react";

// Turbo
import { createSafeAndDeposit } from "lib/turbo/transactions/createSafeAndDeposit";
import { createSafe } from "lib/turbo/transactions/safe";
import { TRIBE } from "lib/turbo/utils/constants";

// Utils
import { parseEther } from "ethers/lib/utils";
import { handleGenericError } from "utils/errorHandling";
import CreateSafeStepOne from "./CreateSafeStepOne";
import CreateSafeStepTwo from "./CreateSafeStepTwo";
import CreateSafeStepThree from "./CreateSafeStepThree";

const MODAL_STEPS: Pick<
    React.ComponentProps<typeof Modal>,
    "title" | "subtitle" | "buttons"
>[] = [
        {
            title: "Creating a safe",
            subtitle:
                "The first step towards using Turbo is creating a safe, which allows you to boost pools by depositing collateral.",
        },
        {
            title: "Select collateral type",
            subtitle: "Pick a collateral type supported by top lending markets.",
        },
        {
            title: "Deposit Collateral",
            subtitle: "Collateralizing is required before boosting pools.",
        }
    ];

type CreateSafeModalProps = Pick<
    React.ComponentProps<typeof Modal>,
    "isOpen" | "onClose"
>;

export const CreateSafeModal: React.FC<CreateSafeModalProps> = ({
    isOpen,
    onClose,
}) => {

    const { address, provider, chainId } = useRari()

    const [stepIndex, setStepIndex] = useState(0);
    function incrementStepIndex() {
        if (stepIndex + 1 !== MODAL_STEPS.length) {
            setStepIndex(stepIndex + 1);
        }
    }

    const [amount, setAmount] = useState<string>("10");
    const [underlyingToken, setUnderlyingToken] = useState<string | undefined>()


    const [creating, setCreating] = useState(false)
    const tokenData = useTokenData(underlyingToken)


    // Utils
    const toast = useToast();

    const handleCreateSafe = async () => {
        if (!address || !provider || !chainId || !underlyingToken) return;


        console.log({amount})

        const amountBN = parseEther(!!amount ? amount : "0");

        if (!amountBN.isZero()) {
            try {
                setCreating(true)
                const receipt = await createSafeAndDeposit(
                    provider.getSigner(),
                    amountBN,
                    chainId
                );
                console.log({ receipt })
            } catch (err) {
                handleGenericError(err, toast)
                console.log({ err })
            } finally {
                setCreating(false)
            }
        } else {
            try {
                alert("createSafe")
                setCreating(true)
                const receipt = await createSafe(
                    underlyingToken,
                    provider,
                    chainId
                )
                console.log({ receipt })
            } catch (err) {
                handleGenericError(err, toast)
                console.log({ err })
            } finally {
                setCreating(false)
                setStepIndex(0)
                onClose()
            }
        }
    };

    console.log({ stepIndex })

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={MODAL_STEPS[stepIndex].title}
            subtitle={MODAL_STEPS[stepIndex].subtitle}
            progressValue={(stepIndex + 1) / MODAL_STEPS.length * 100}
        >
            {/* {MODAL_STEPS[stepIndex].children} */}
            {stepIndex === 0 && <CreateSafeStepOne incrementStepIndex={incrementStepIndex} />}
            {stepIndex === 1 && <CreateSafeStepTwo incrementStepIndex={incrementStepIndex} setUnderlyingToken={setUnderlyingToken} />}
            {stepIndex === 2 && <CreateSafeStepThree
                incrementStepIndex={incrementStepIndex}
                setUnderlyingToken={setUnderlyingToken}
                underlyingToken={underlyingToken}
                amount={amount}
                setAmount={setAmount}
                handleCreateSafe={handleCreateSafe}
            />}
        </Modal>
    );
};



export default CreateSafeModal