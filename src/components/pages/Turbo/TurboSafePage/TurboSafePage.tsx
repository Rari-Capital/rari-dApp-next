import Head from "next/head";

// Components
import {
  Button,
  Divider,
  Heading,
  Link,
  Text,
  TokenIcon,
  TokenSymbol,
} from "rari-components";
import {
  Box,
  Flex,
  HStack,
  Image,
  Skeleton,
  Spacer,
  Stack,
  StackProps,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronLeftIcon, InfoIcon } from "@chakra-ui/icons";
import TurboLayout from "../TurboLayout";
import { SafeStats } from "./SafeStats";
import { SafeStrategies } from "./SafeStrategies";
import ClaimInterestModal from "./modals/ClaimInterestModal";
import DepositSafeCollateralModal from "./modals/DepositSafeCollateralModal/DepositSafeCollateralModal";
import SafeInfoModal from "./modals/TurboInfoModal";
import WithdrawSafeCollateralModal from "./modals/WithdrawSafeCollateralModal";
import AtRiskOfLiquidationAlert from "../alerts/AtRiskOfLiquidationAlert";
import { OnboardingCard } from "./OnboardingCard";
import { BoostBar } from "./BoostBar";

// Hooks
import { useRouter } from "next/router";
import { useState } from "react";

// Context
import { TurboSafeProvider, useTurboSafe } from "context/TurboSafeContext";
import BoostMeAlert from "../alerts/BoostMeAlert";
import { AdminAlert } from "components/shared/AdminAlert";

const TurboSafePage: React.FC = () => {
  const {
    safe,
    usdPricedSafe,
    collateralTokenData,
    loading,
    isAtLiquidationRisk,
    shouldBoost,
    isUserAdmin
  } = useTurboSafe()

  const safeHealth = safe?.safeUtilization;

  const {
    isOpen: isDepositModalOpen,
    onOpen: openDepositModal,
    onClose: closeDepositModal,
  } = useDisclosure();

  const {
    isOpen: isSafeModalOpen,
    onOpen: openSafeModal,
    onClose: closeSafeModal,
  } = useDisclosure();

  const {
    isOpen: isWithdrawModalOpen,
    onOpen: openWithdrawModal,
    onClose: closeWithdrawModal,
  } = useDisclosure();

  const {
    isOpen: isClaimInterestModalOpen,
    onOpen: openClaimInterestModal,
    onClose: closeClaimInterestModal,
  } = useDisclosure();

  const [hovered, setHovered] = useState(false);

  function onClickBoost() {
    // TODO(sharad-s) Need to implement
    // TODO(sharad-s) Move strategyIndex to context
    alert("Boosting random safe!");
  }

  return (
    <>
      <Head>
        <title>{collateralTokenData?.symbol} Safe | Tribe Turbo</title>
      </Head>

      {/* Modals */}
      <DepositSafeCollateralModal
        isOpen={isDepositModalOpen}
        onClose={closeDepositModal}
        safe={usdPricedSafe}
      />
      <WithdrawSafeCollateralModal
        isOpen={isWithdrawModalOpen}
        onClose={closeWithdrawModal}
        safe={usdPricedSafe}
      />
      <ClaimInterestModal
        isOpen={isClaimInterestModalOpen}
        onClose={closeClaimInterestModal}
        safe={usdPricedSafe}
      />
      <SafeInfoModal
        isOpen={isSafeModalOpen}
        onClose={closeSafeModal}
        safe={safe}
      />

      <Box
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        mb={4}
      >
        <Link href="/turbo">
          <Flex alignItems="center">
            <ChevronLeftIcon
              mr={2}
              boxSize="20px"
              transition="transform 0.2s ease 0s"
              transform={hovered ? "translateX(-5px) scale(1.00)" : ""}
            />{" "}
            <Text fontSize="sm" fontWeight={600}>
              All Safes
            </Text>
          </Flex>
        </Link>
      </Box>

      {/* Alerts */}
      {isAtLiquidationRisk && <AtRiskOfLiquidationAlert safeHealth={safeHealth} />}
      {!isUserAdmin && <AdminAlert isAdmin={false} isNotAdminText="You are not the owner of this Safe" />}

      <Stack
        direction={["column", "column", "column", "row"]}
        justify="space-between"
        alignItems={["flex-start", "flex-start", "flex-start", "center"]}
        spacing={4}
        mt={8}
      >
        <Skeleton isLoaded={!loading}>
          <HStack>
            <TokenIcon tokenAddress={safe?.collateralAsset ?? ""} mr={2} />
            <Heading>
              <TokenSymbol tokenAddress={safe?.collateralAsset ?? ""} /> Safe
            </Heading>
            <InfoIcon
              onClick={openSafeModal}
              _hover={{
                cursor: "pointer",
              }}
            />
          </HStack>
        </Skeleton>
        <Buttons
          mt={[4, 4, 4, 0]}
          openDepositModal={openDepositModal}
          openWithdrawModal={openWithdrawModal}
          openClaimInterestModal={openClaimInterestModal}
        />
      </Stack>
      <Divider my={8} />
      {safe?.boostedAmount.isZero() && !loading && (
        <OnboardingCard
          openDepositModal={openDepositModal}
          onClickBoost={onClickBoost}
        />
      )}
      <BoostBar />

      <Stack spacing={12} my={12}>
        <SafeStats />
      </Stack>

      <SafeStrategies />
    </>
  );
};

type ButtonsProps = StackProps & {
  openDepositModal: any;
  openWithdrawModal: any;
  openClaimInterestModal: any;
};

export const Buttons: React.FC<ButtonsProps> = ({ openDepositModal, openWithdrawModal, openClaimInterestModal, ...restProps }) => {
  const { loading } = useTurboSafe();

  return (
    <HStack {...restProps}>
      <Button variant="cardmatte" onClick={openDepositModal} disabled={loading}>
        <Image
          src="/static/turbo/action-icons/deposit-collateral.png"
          height={4}
          mr={3}
        />
        Deposit Collateral
      </Button>
      <Button
        variant="cardmatte"
        onClick={openWithdrawModal}
        disabled={loading}
      >
        <Image
          src="/static/turbo/action-icons/withdraw-collateral.png"
          height={4}
          mr={3}
        />
        Withdraw Collateral
      </Button>
      <Button
        variant="cardmatte"
        onClick={openClaimInterestModal}
        disabled={loading}
      >
        <Image
          src="/static/turbo/action-icons/claim-interest.png"
          height={4}
          mr={3}
        />
        Claim Interest
      </Button>
    </HStack>
  );
};

export default () => {
  const router = useRouter();
  const { id } = router.query;
  const safeAddress = id as string;

  return (
    <TurboLayout>
      <TurboSafeProvider safeAddress={safeAddress}>
        <TurboSafePage />
      </TurboSafeProvider>
    </TurboLayout>
  );
};
