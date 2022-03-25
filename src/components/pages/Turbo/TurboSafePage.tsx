import { Box, Stack, Image, Spacer, HStack } from "@chakra-ui/react";
import { useSafeInfo } from "hooks/turbo/useSafeInfo";
import { useTokenData } from "hooks/useTokenData";
import { useRouter } from "next/router";
import { Button, Divider, Heading, Text } from "rari-components/standalone";

const TurboSafePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const safeId = id as string

  const safe = useSafeInfo(safeId)
  const tokenData = useTokenData(safe?.collateralAsset)

  return (
    <Box color="white" width="100%" p={12}>
      <Box maxWidth={["100%", "1000px"]} marginX="auto">
        <Stack
          direction={"row"}
          justify="space-between"
          alignItems="center"
          spacing={3}
        >
          <HStack>
            <Image src={tokenData?.logoURL} boxSize="40px" />
            <Heading>{tokenData?.symbol}</Heading>
          </HStack>
          <Spacer />
          <HStack>
            <Button>
              Deposit Collateral
            </Button>
          </HStack>
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

export default TurboSafePage;
