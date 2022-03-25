import { ChevronRightIcon } from "@chakra-ui/icons";
import {
    HStack,
    Spacer,
    Stack,
} from "@chakra-ui/react"
import { TRIBE } from "lib/turbo/utils/constants";
import { TokenIcon } from "rari-components";
import { Heading, Button } from "rari-components/standalone";
import { useState } from "react";

const CreateSafeStepTwo: React.FC<{
    incrementStepIndex: () => void,
    setUnderlyingToken: (t: string) => void,
}> = ({ incrementStepIndex, setUnderlyingToken }) => {


    // TODO: remove hardcode
    const handleAssetClick = () => {
        setUnderlyingToken(TRIBE)
        incrementStepIndex()
    }

    const [hovered, setHovered] = useState(false)

    return (
        <Stack>
            <HStack
                onClick={handleAssetClick}
                border="1px solid grey"
                borderRadius={"md"}
                p={4}
                _hover={{
                    cursor: "pointer"
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <TokenIcon tokenAddress={TRIBE} mr={4} />
                <Heading>TRIBE</Heading>
                <Spacer />
                <ChevronRightIcon
                    ml={"auto"}
                    boxSize="30px"
                    transition="transform 0.2s ease 0s"
                    transform={hovered ? "translateX(5px) scale(1.00)" : ""}
                />
            </HStack>
        </Stack>
    )
}

export default CreateSafeStepTwo