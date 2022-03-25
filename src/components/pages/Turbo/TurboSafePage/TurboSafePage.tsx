import { Box, Stack, Image, Spacer, HStack, useDisclosure } from "@chakra-ui/react";
import { Button, Divider, Heading, Statistic, Text } from "rari-components/standalone";
import { ChevronLeftIcon } from "@chakra-ui/icons";

// Components
import AppLink from "components/shared/AppLink";
import DepositSafeCollateralModal from "../modals/DepositSafeCollateralModal";


// Hooks
import { useRouter } from "next/router";
import useSafeHealth from "hooks/turbo/useSafeHealth";
import { useSafeInfo } from "hooks/turbo/useSafeInfo";
import { useTokenData } from "hooks/useTokenData";
import { SafeStats } from "./SafeStats";
import { SafeStrategies } from "./Strategies";

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
      />I
      <Box color="white" width="100%" p={12}>
        <AppLink href="/turbo">
          <ChevronLeftIcon boxSize={"30px"} mb={3} />
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
          <Divider mt={10} mb={8} />
          <Stack spacing={12}>
            {!!safe && <SafeStats safe={safe} tokenData={tokenData} />}
          </Stack>
          <Divider mt={10} mb={8} />
          <Stack spacing={12}>
            {!!safe && <SafeStrategies safe={safe} />}
          </Stack>
        </Box>
      </Box>
    </>
  );
};



export default TurboSafePage;
