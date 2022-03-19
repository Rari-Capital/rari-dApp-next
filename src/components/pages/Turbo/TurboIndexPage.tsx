import { Box, HStack, Image, Stack } from "@chakra-ui/react";
import { Button, Divider, Heading, Text } from "rari-components/standalone";

const TurboIndexPage: React.FC = () => {
  return (
    <Box color="white" width="100%" p={12}>
      <Box maxWidth={["100%", "1000px"]} marginX="auto">
        <Stack
          direction={["column", "column", "row"]}
          alignItems="center"
          spacing={12}
        >
          <Box flex={1}>
            <Heading size="xl">Introducing Turbo</Heading>
            <Text variant="secondary" pt={4} fontSize="xl">
              Turbo allows any DeFi token to become productive by sharing in the
              yield generated from a costless FEI line of credit.
            </Text>
            <HStack pt={8} spacing={4}>
              <Button variant="success">Create a safe</Button>
              <Button variant="cardmatte">Learn more</Button>
            </HStack>
          </Box>
          <Box flex={1}>
            <Image src="/static/turbo.png" />
          </Box>
        </Stack>
        <Divider mt={20} mb={16} />
        <Stack spacing={12}>
          <Box>
            <Heading size="md">How does it work?</Heading>
            <Text variant="secondary" mt={4}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </Text>
          </Box>
          <Box>
            <Heading size="md">Should I use Turbo?</Heading>
            <Text variant="secondary" mt={4}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </Text>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default TurboIndexPage;
