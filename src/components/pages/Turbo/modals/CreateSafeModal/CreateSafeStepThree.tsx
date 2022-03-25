import {
    Flex,
    Input,
    Text,
    VStack
} from "@chakra-ui/react"
import { Button } from "rari-components/standalone";

// Hooks
import { useRari } from "context/RariContext";
import { useBalanceOf } from "hooks/useBalanceOf";
import useHasApproval from "hooks/useHasApproval";
import { TokenData } from "hooks/useTokenData";

// Utils
import { formatEther, parseEther } from "ethers/lib/utils";
import { TRIBE, TurboAddresses } from "lib/turbo/utils/constants";

const CreateSafeStepThree: React.FC<{
    incrementStepIndex: () => void,
    amount: string,
    setAmount: (a: string) => void,
    handleCreateSafe: () => void,
    tokenData: TokenData | undefined
}> = ({ incrementStepIndex, amount, setAmount, handleCreateSafe, tokenData }) => {

    const { address, chainId } = useRari()
    const balance = useBalanceOf(address, TRIBE)

    const hasApproval = useHasApproval(TRIBE, TurboAddresses[chainId ?? 31337].ROUTER)
    console.log({ hasApproval })

    return (
        <VStack>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`0 TRIBE`} />
            <Text>You have {formatEther(balance)} {tokenData?.symbol}</Text>
            <Button onClick={handleCreateSafe}>Submit</Button>
        </VStack>
    )
}

export default CreateSafeStepThree