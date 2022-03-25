import { ChevronRightIcon } from "@chakra-ui/icons";
import {
    Flex,
    HStack,
    Input,
    Spacer,
    Stack,
} from "@chakra-ui/react"
import useHasApproval from "hooks/useApproval";
import { TRIBE } from "lib/turbo/utils/constants";
import { TokenIcon } from "rari-components";
import { Heading, Button, TokenAmountInput } from "rari-components/standalone";
import { useState } from "react";

const CreateSafeStepThree: React.FC<{
    incrementStepIndex: () => void,
    setUnderlyingToken: (t: string) => void,
    underlyingToken: string | undefined,
    amount: string,
    setAmount: (a: string) => void,
    handleCreateSafe: any
}> = ({ incrementStepIndex, setUnderlyingToken, underlyingToken, amount, setAmount, handleCreateSafe }) => {


    return (
        <Flex>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`0 TRIBE`} />
            <Button onClick={handleCreateSafe}>Submit</Button>
        </Flex>
    )
}

export default CreateSafeStepThree