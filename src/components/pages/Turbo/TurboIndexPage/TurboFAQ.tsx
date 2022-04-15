import usePreviewSafes from "hooks/turbo/usePreviewSafes";
import { Button, Heading, Text } from "rari-components";
import React from "react";
import {
  Box,
  BoxProps,
  Center,
  Flex,
  Image,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";

type TurboFAQProps = BoxProps;

const TurboFAQ: React.FC<TurboFAQProps> = (props) => {
  const safes = usePreviewSafes();

  return (
    <Box {...props}>
      <Stack spacing={24}>
        <Box>
          <Heading size="lg">How does Turbo work?</Heading>
          {/* `Stack` adds a little bit of space between each child, even if
              `spacing` is set to 0, which we don't want. `Flex` does not. */}
          <Flex flexDirection={["column", "column", "row"]} mt={12}>
            <Stack flex={1} spacing={4}>
              <Heading
                size="md"
                variant="success"
                display="flex"
                alignItems="center"
              >
                <Center
                  background="success"
                  boxSize={8}
                  mr={4}
                  color="black"
                  borderRadius="50%"
                >
                  1
                </Center>
                Create Safe
              </Heading>
              <Box background="success" height={1} width="100%" />
              <Text
                variant="secondary"
                // Add a little extra space between the right edge of
                // this text and the next text.
                pr={6}
              >
                Collateralizing, boosting, depositing, withdrawing, slurping,
                and sweeping are all isolated features per safe.
              </Text>
            </Stack>
            <Stack flex={1} spacing={4} mt={[12, 12, 0]}>
              <Heading
                size="md"
                variant="success"
                display="flex"
                alignItems="center"
              >
                <Center
                  background="success"
                  boxSize={8}
                  mr={4}
                  color="black"
                  borderRadius="50%"
                >
                  2
                </Center>
                Deposit Collateral
              </Heading>
              <Box background="success" height={1} width="100%" />
              <Text
                variant="secondary"
                // Add a little extra space between the right edge of
                // this text and the next text.
                pr={6}
              >
                Once the DeFi token is collateralized in a Fuse pool, the owner
                of this safe can then mint FEI at 0% APR (boosting).
              </Text>
            </Stack>
            <Stack flex={1} spacing={4} mt={[12, 12, 0]}>
              <Heading
                size="md"
                variant="success"
                display="flex"
                alignItems="center"
              >
                <Center
                  background="success"
                  boxSize={8}
                  mr={4}
                  color="black"
                  borderRadius="50%"
                >
                  3
                </Center>
                Boost FEI
              </Heading>
              <Flex position="relative">
                <Box background="success" height={1} width="110%" />
                {/* Arrow tip */}
                {/* https://css-tricks.com/snippets/css/css-triangle/ */}
                <Box
                  position="absolute"
                  top={-2.5}
                  right={-2.5}
                  width={0}
                  height={0}
                  borderStyle="solid"
                  borderTopWidth={12}
                  borderTopColor="transparent"
                  borderBottomWidth={12}
                  borderBottomColor="transparent"
                  borderLeftWidth={12}
                  borderLeftColor="success"
                />
              </Flex>
              <Text
                variant="secondary"
                // Add a little extra space between the right edge of
                // this text and the next text.
                pr={6}
              >
                FEI is minted at no cost so long as that FEI is supplied into a
                yield generating strategy that is compliant with ERC-4626, such
                as: Fuse plug-ins, tokenized vaults, etc.
              </Text>
            </Stack>
          </Flex>
        </Box>
        <Stack
          direction={["column", "column", "column", "row"]}
          spacing={[12, 12, 12, 24]}
        >
          <Box>
            <Heading size="lg">Turbo is for everyone</Heading>
            <Text variant="secondary" mt={4}>
              Turbo can be used by individuals, treasuries, DAOs, protocols, or
              any on-chain entity.
            </Text>
            <SimpleGrid columns={[1, 1, 2]} mt={8}>
              <Flex alignItems="center" my={4}>
                <Image
                  width={16}
                  src="/static/turbo/user-icons/individuals.png"
                />
                <Text fontSize="lg" ml={6}>
                  Individuals
                </Text>
              </Flex>
              <Flex alignItems="center" my={4}>
                <Image width={16} src="/static/turbo/user-icons/daos.png" />
                <Text fontSize="lg" ml={6}>
                  DAOs
                </Text>
              </Flex>
              <Flex alignItems="center" my={4}>
                <Image
                  width={16}
                  src="/static/turbo/user-icons/protocols.png"
                />
                <Text fontSize="lg" ml={6}>
                  Protocols
                </Text>
              </Flex>
              <Flex alignItems="center" my={4}>
                <Image width={16} src="/static/turbo/user-icons/more.png" />
                <Text fontSize="lg" ml={6}>
                  And more...
                </Text>
              </Flex>
            </SimpleGrid>
          </Box>
          <Image
            width="md"
            src="/static/turbo/turbo-engine-3d.png"
            alignSelf="center"
          />
        </Stack>
        <Stack
          direction={["column", "column", "column", "row"]}
          spacing={[12, 12, 12, 24]}
        >
          <Box>
            <Heading size="lg">Utilize your treasury assets</Heading>
            <Text variant="secondary" mt={4}>
              Deposit BAL, TRIBE, and gOHM today. Support for more protocol
              tokens coming soon.
            </Text>
          </Box>
          <Image
            width="md"
            src="/static/turbo/treasury-assets.png"
            alignSelf="center"
          />
        </Stack>
        <Stack spacing={12} alignItems="center" py={12}>
          <Center flexDirection="column">
            <Heading size="xl">A completely new financial mechanism </Heading>
            <Text variant="secondary" fontSize="xl" mt={4}>
              Turbo changes the relationship between users in an ecosystem and
              the stablecoin issuer. It’s a powerful transformation in the
              thinking of stablecoins and their provision throughout the
              ecosystem.
            </Text>
          </Center>
          <Button size="lg" variant="success">
            Create a safe
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TurboFAQ;
