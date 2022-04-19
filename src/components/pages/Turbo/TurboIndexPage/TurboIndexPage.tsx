import { useIsUserAuthorizedToCreateSafes } from "hooks/turbo/useIsUserAuthorizedToCreateSafes";
import { useAllUserSafes } from "hooks/turbo/useUserSafes";
import { TRIBE } from "lib/turbo/utils/constants";
import { Button, Divider, Heading, Text } from "rari-components";
import { useRariTokenData } from "rari-components/hooks";
import { WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Image,
  Stack,
  VStack,
  useDisclosure,
  SlideFade,
  Slide,
} from "@chakra-ui/react";
import TurboLayout from "../TurboLayout";
import CreateSafeModal from "./CreateSafeModal/";
import TurboFAQ from "./TurboFAQ";
import UserSafes from "./UserSafes";
import useApprovedCollateral from "hooks/turbo/useApprovedCollateral";
import { useTokensDataAsMap } from "hooks/useTokenData";
import { useRef } from "react";
import TurboEngineIcon from "components/shared/Icons/TurboEngineIcon";

const TurboIndexPage: React.FC = () => {
  const scrollRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const safes = useAllUserSafes() ?? [];
  const hasSafes = safes.length > 0;

  const isAuthorized = useIsUserAuthorizedToCreateSafes();

  const approvedCollateral = useApprovedCollateral();

  // // Prefetch Tribe data so it's in the `TokenIcon`/`TokenSymbol` cache.
  // // This allows collateral types to load instantly when the "Create Safe"
  // // modal is initially opened.
  // const _ = useRariTokenData(TRIBE);
  // const tokenData = useTokensDataAsMap(approvedCollateral);

  const handleClick = () => {
    // @ts-ignore
    isAuthorized && !hasSafes ? onOpen() : scrollRef.current.scrollIntoView();
  };

  return (
    // Hide overflow of main Turbo screenshot image
    <Box overflowX="hidden" width="100%">
      <TurboLayout>
        <CreateSafeModal onClose={onClose} isOpen={isOpen} />
        <Stack
          direction={["column", "column", "row"]}
          alignItems="center"
          spacing={12}
        >
          {/* Copy */}
          <Box minWidth={["100%", "100%", "50%"]} pr={[0, 0, 32]}>
            <SlideFade in={true} offsetY="20px">
              <HStack align="center">
                <TurboEngineIcon fill="#64DBA0" animate={true} boxSize={"40px"}/>
                <Heading size="2xl">Introducing Turbo</Heading>
              </HStack>

              <Text pt={4} fontSize="2xl">
                Boost FEI liquidity and earn interest against any protocol
                token.
              </Text>
              {/* Buttons */}
              <VStack w="100%" align="flex-start">
                <HStack pt={8} spacing={4} mb={4}>
                  {!!isAuthorized && (
                    <Button
                      variant={hasSafes ? "" : "success"}
                      onClick={handleClick}
                      disabled={!isAuthorized}
                      size="lg"
                    >
                      {hasSafes ? "Manage Your Safes" : "Create a safe"}
                    </Button>
                  )}
                  {hasSafes ? (
                    <Button
                      variant={"cardmatte"}
                      as="a"
                      // TypeScript doesn't realize that `as="a"` means that this can
                      // have an `href` prop.
                      // @ts-ignore
                      href="https://medium.com/fei-protocol/the-tribe-dao-strongly-believes-that-a-healthy-and-thriving-defi-ecosystem-needs-a-robust-platform-b1faea700dfa"
                      target="_blank"
                      size="lg"
                    >
                      Learn more
                    </Button>
                  ) : (
                    <Button variant="neutral" onClick={handleClick} size="lg">
                      Learn more
                    </Button>
                  )}
                </HStack>
              </VStack>
            </SlideFade>
          </Box>

          {/* Image */}
          <Box flex={1}>
            <Box position="relative" top={0} left={0}>
              <SlideFade in={true}>
                <Image
                  src="/static/turbo/turbo2.png"
                  width={["100%", "100%", "55vw"]}
                  maxWidth={["100%", "100%", "55vw"]}
                />
              </SlideFade>
            </Box>
          </Box>
        </Stack>
        <Box pt={24} id="#MY_SAFES" ref={scrollRef}>
          {hasSafes ? (
            <UserSafes safes={safes} onClickCreateSafe={onOpen} />
          ) : (
            <TurboFAQ />
          )}
        </Box>
      </TurboLayout>
    </Box>
  );
};

export default TurboIndexPage;
