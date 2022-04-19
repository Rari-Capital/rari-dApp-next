import { Variants, motion, useAnimation } from "framer-motion";
import usePreviewSafes from "hooks/turbo/usePreviewSafes";
import { Button, Heading, Text } from "rari-components";
import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import {
  Box,
  BoxProps,
  Center,
  Flex,
  HStack,
  Image,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";

type TurboFAQProps = BoxProps;

const TurboFAQ: React.FC<TurboFAQProps> = (props) => {
  // const safes = usePreviewSafes();
  return (
    <Box {...props}>
      <Stack spacing={24}>
        {/* Section 1 */}
        <Section1 />

        {/* Section 2 */}
        <Section2 />

        {/* Section 3 */}
        <Section3 />

        {/* Section 4*/}
        <Section4 />
      </Stack>
    </Box>
  );
};

const Section1 = () => (
  <AnimateInView from="top">
    <Box>
      <Heading size="lg">How does Turbo work?</Heading>
      {/* `Stack` adds a little bit of space between each child, even if
       * `spacing` is set to 0, which we don't want because we want the bottom
       * borders of each child to flow together, giving the impression of a
       * single, connected arrow. `Flex` does not add this space, so we use
       * `Flex` instead. */}
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
            fontSize="lg"
          >
            Take your first step by creating a Turbo Safe. Manage your safe to
            boost against a collateral type, earn yield, bootstrap Fuse Pools,
            and more.
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
            fontSize="lg"
          >
            Deposit whitelisted collateral (gOHM, TRIBE, BAL) into your safe to
            enable boosting FEI.
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
            fontSize="lg"
          >
            Take a 0% interest FEI loan, and boost it into the yield bearing
            strategy of your choice. Claim interest whenever you like.
          </Text>
        </Stack>
      </Flex>
    </Box>
  </AnimateInView>
);

const Section2 = () => (
  <AnimateInView from="right">
    <Stack
      direction={["column", "column", "column", "row"]}
      spacing={[12, 12, 12, 32]}
    >
      <Box
        flex={1}
        sx={{
          backgroundSize: "contain",
          backgroundImage: "url(/static/turbo/turbo-engine-3d-trimmed.png)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
        }}
      />

      <Box>
        <Heading size="lg">Turbo is for everyone</Heading>
        <Text variant="secondary" mt={4} opacity={0.6} fontSize="lg">
          Turbo can be used by individuals, treasuries, DAOs, protocols, or any
          on-chain entity.
        </Text>
        <SimpleGrid columns={[1, 1, 2]} mt={8}>
          <motion.div variants={variants["right"]}>
            <Flex alignItems="center" my={4}>
              <Image
                width={16}
                src="/static/turbo/user-icons/individuals.png"
              />
              <Text fontSize="lg" ml={6} fontWeight="semibold">
                Individuals
              </Text>
            </Flex>
          </motion.div>
          <motion.div variants={variants["right"]}>
            <Flex alignItems="center" my={4}>
              <Image width={16} src="/static/turbo/user-icons/daos.png" />
              <Text fontSize="lg" ml={6} fontWeight="semibold">
                DAOs
              </Text>
            </Flex>
          </motion.div>
          <motion.div variants={variants["right"]}>
            <Flex alignItems="center" my={4}>
              <Image width={16} src="/static/turbo/user-icons/protocols.png" />
              <Text fontSize="lg" ml={6} fontWeight="semibold">
                Protocols
              </Text>
            </Flex>
          </motion.div>
          <motion.div variants={variants["right"]}>
            <Flex alignItems="center" my={4}>
              <Image width={16} src="/static/turbo/user-icons/more.png" />
              <Text fontSize="lg" ml={6} fontWeight="semibold">
                And more...
              </Text>
            </Flex>
          </motion.div>
        </SimpleGrid>
      </Box>
    </Stack>
  </AnimateInView>
);

const Section3 = () => (
  <AnimateInView from="left">
    <Stack
      direction={["column", "column", "column", "row"]}
      spacing={[12, 12, 12, 24]}
    >
      <Box>
        <Heading size="lg">Utilize your treasury assets</Heading>
        <Text variant="secondary" mt={4} opacity={0.6}>
          Deposit BAL, TRIBE, and gOHM today. Support for more protocol tokens
          coming soon.
        </Text>
      </Box>
      <Image
        width="md"
        src="/static/turbo/treasury-assets.png"
        alignSelf="center"
      />
    </Stack>
  </AnimateInView>
);

const Section4 = () => (
  <AnimateInView from="bottom">
    <Stack spacing={12} alignItems="center" py={12}>
      <Center flexDirection="column">
        <Heading size="xl">A completely new financial mechanism </Heading>
        <Text
          variant="secondary"
          fontSize="xl"
          mt={4}
          textAlign="center"
          opacity={0.6}
        >
          Turbo changes the relationship between users in an ecosystem and the
          stablecoin issuer. It’s a powerful transformation in the thinking of
          stablecoins and their provision throughout the ecosystem.
        </Text>
      </Center>
      <HStack spacing={4} mb={4}>
        <Button size="lg">Get Involved</Button>
        <Button
          variant="neutral"
          as="a"
          // @ts-ignore
          href="https://medium.com/fei-protocol/the-tribe-dao-strongly-believes-that-a-healthy-and-thriving-defi-ecosystem-needs-a-robust-platform-b1faea700dfa"
          target="_blank"
          size="lg"
        >
          View Blog Post
        </Button>
      </HStack>
    </Stack>
  </AnimateInView>
);

/** Animations */
type AnimateInViewDirection = "left" | "right" | "top" | "bottom";
type AnimateInViewProps = {
  children: any;
  from: AnimateInViewDirection;
};

// TODO (@sharad-s) Move into Component Library and fix the map key type
const VARIANT_DEFAULTS = {
  transition: {
    duration: 0.6,
    staggerChildren: 0.3,
    delayChildren: 0.3,
  },
};

const variants: { [from: string]: Variants } = {
  top: {
    visible: { opacity: 1, y: 0, ...VARIANT_DEFAULTS },
    hidden: { opacity: 0, y: -40 },
  },
  bottom: {
    visible: { opacity: 1, y: 0, ...VARIANT_DEFAULTS },
    hidden: { opacity: 0, y: 40 },
  },
  left: {
    visible: { opacity: 1, x: 0, ...VARIANT_DEFAULTS },
    hidden: { opacity: 0, x: -40 },
  },
  right: {
    visible: { opacity: 1, x: 0, ...VARIANT_DEFAULTS },
    hidden: { opacity: 0, x: 40 },
  },
};

const AnimateInView: React.FC<AnimateInViewProps> = ({
  children,
  from = "top",
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={variants[from]}
    >
      {children}
    </motion.div>
  );
};

export default TurboFAQ;
