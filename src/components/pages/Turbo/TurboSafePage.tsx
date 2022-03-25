import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Stack, Image, Spacer, HStack, useDisclosure } from "@chakra-ui/react";
import AppLink from "components/shared/AppLink";
import useSafeHealth from "hooks/turbo/useSafeHealth";
import { useSafeInfo } from "hooks/turbo/useSafeInfo";
import { useTokenData } from "hooks/useTokenData";
import { useRouter } from "next/router";
import { Button, Divider, Heading, Text } from "rari-components/standalone";
import DepositSafeCollateralModal from "./modals/DepositSafeCollateralModal";

const TurboSafePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const safeId = id as string

  const safe = useSafeInfo(safeId)
  const tokenData = useTokenData(safe?.collateralAsset)

  const safeHealth = useSafeHealth(safe)

  const { isOpen: isDepositModalOpen, onOpen: openDepositModal, onClose: closeDepositModal } = useDisclosure()

  return (
    <>
      <DepositSafeCollateralModal
        isOpen={isDepositModalOpen}
        onClose={closeDepositModal}
        safe={safe}
        tokenData={tokenData}
      />
      <Box color="white" width="100%" p={12}>
        <AppLink href="/turbo">
          <ChevronLeftIcon boxSize={"30px"} mb={5} />
        </AppLink>
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
              <Button onClick={openDepositModal}>
                Deposit Collateral
              </Button>
            </HStack>
          </Stack>
          <Divider mt={20} mb={16} />
          <Stack spacing={12}>
          
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default TurboSafePage;
