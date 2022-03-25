import {
    Box,
    Flex,
    Image,
    Stack,
} from "@chakra-ui/react"
import { Heading, Text, Button } from "rari-components/standalone";

const CreateSafeStepOne: React.FC<{ incrementStepIndex: () => void }> = ({ incrementStepIndex }) => {
    return (
        <Stack spacing={4}>
            <Flex align="center">
                <Image
                    src="/static/turbo/one-collateral-type.png"
                    height={16}
                    mr={4}
                />
                <Box>
                    <Heading size="md">One collateral type</Heading>
                    <Text>Each safe has a single collateral asset of choice.</Text>
                </Box>
            </Flex>
            <Flex align="center">
                <Image
                    src="/static/turbo/isolated-actions.png"
                    height={16}
                    mr={4}
                />
                <Box>
                    <Heading size="md">Isolated actions</Heading>
                    <Text>Boosting, depositing, etc. are isolated per safe.</Text>
                </Box>
            </Flex>
            <Button onClick={() => incrementStepIndex()}>Next</Button>
        </Stack>
    )
}

export default CreateSafeStepOne