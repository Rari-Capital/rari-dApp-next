import { useIsUserAuthorizedToCreateSafes } from "hooks/turbo/useIsUserAuthorizedToCreateSafes";
import { useAllUserSafes } from "hooks/turbo/useUserSafes";
import { Button, Divider, Heading, Text } from "rari-components";
import { WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Image,
  Stack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import TurboLayout from "../TurboLayout";
import CreateSafeModal from "./CreateSafeModal/";
import { TRIBE } from "lib/turbo/utils/constants";
import usePreviewSafes from "hooks/turbo/usePreviewSafes";
import { useRariTokenData } from "rari-components/hooks";
import TurboFAQ from "./TurboFAQ";
import UserSafes from "./UserSafes";

const TurboIndexPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const safes = useAllUserSafes() ?? [];
  const hasSafes = safes.length > 0;

  const isAuthorized = useIsUserAuthorizedToCreateSafes();
  // Prefetch Tribe data so it's in the `TokenIcon`/`TokenSymbol` cache.
  // This allows collateral types to load instantly when the "Create Safe"
  // modal is initially opened.
  const _ = useRariTokenData(TRIBE);

  return (
    <TurboLayout>
      <CreateSafeModal onClose={onClose} isOpen={isOpen} />
      <Stack
        direction={["column", "column", "row"]}
        alignItems="center"
        spacing={12}
      >
        <Box flex={1}>
          <Heading size="xl">Introducing Turbo</Heading>
          <Text variant="secondary" pt={4} fontSize="xl">
            Turbo allows any DeFi token to become productive by sharing in the
            yield generated from approved strategies earning off of a costless
            FEI line of credit.
          </Text>
          {/* Buttons */}
          <VStack w="100%" align="flex-start">
            <HStack pt={8} spacing={4} mb={4}>
              {!hasSafes && (
                <Button
                  variant={isAuthorized ? "success" : "warning"}
                  onClick={onOpen}
                  disabled={!isAuthorized}
                >
                  Create a safe
                </Button>
              )}
              <Button
                variant="cardmatte"
                as="a"
                // TypeScript doesn't realize that `as="a"` means that this can
                // have an `href` prop.
                // @ts-ignore
                href="https://medium.com/fei-protocol/the-tribe-dao-strongly-believes-that-a-healthy-and-thriving-defi-ecosystem-needs-a-robust-platform-b1faea700dfa"
                target="_blank"
              >
                Learn more
              </Button>
            </HStack>
            {!hasSafes && !isAuthorized && (
              <HStack>
                <WarningIcon color="warning" />
                <Text color={"warning"}>
                  Turbo is in beta, and safe creation is only open to authorized
                  users.
                </Text>
              </HStack>
            )}
          </VStack>
        </Box>
        <Box flex={1}>
          <Image src="/static/turbo/turbo.png" />
        </Box>
      </Stack>

      <Divider mt={20} mb={16} />
      {hasSafes ? (
        <UserSafes safes={safes} onClickCreateSafe={onOpen} />
      ) : (
        <TurboFAQ />
      )}
    </TurboLayout>
  );
};

export default TurboIndexPage;
