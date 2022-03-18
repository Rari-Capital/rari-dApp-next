import { Box, HStack, Image, Stack } from "@chakra-ui/react";
import { Button, Heading, Text } from "rari-components";

const TurboIndexPage: React.FC = () => {
  return (
    <Box color="white" width="100%" pt={10}>
      <Box width={["100%", "1000px"]} marginX="auto">
        <Stack direction={["column", "row"]} alignItems="center">
          <Box flex={1}>
            <Heading>Introducing Turbo</Heading>
            <Text variant="secondary" pt={4}>
              Turbo allows any DeFi token to become productive by sharing in the
              yield generated from a costless FEI line of credit.
            </Text>
            <HStack pt={4} spacing={4}>
              <Button variant="success">Create a safe</Button>
              <Button>Learn More</Button>
            </HStack>
          </Box>
          <Box flex={1}>
            <Image src="/static/turbo.png" />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default TurboIndexPage;
