import { memo, useCallback } from "react";
import { useRari } from "context/RariContext";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  Button,
  Link,
  Text,
  Spinner,
  Stack,
} from "@chakra-ui/react";

import { Row, Column, Center } from "lib/chakraUtils";
import DashboardBox from "./DashboardBox";

// @ts-ignore
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

import { shortAddress } from "../../utils/shortAddress";

import { useTranslation } from "next-i18next";
import { MODAL_PROPS, ModalDivider, ModalTitleWithCloseButton } from "./Modal";
import { LanguageSelect } from "./TranslateButton";

import { DarkGlowingButton, GlowingButton } from "./GlowingButton";
import { ClaimRGTModal } from "./ClaimRGTModal";
// import version from "utils/version";

import { useAuthedCallback } from "hooks/useAuthedCallback";
import { useIsSmallScreen } from "hooks/useIsSmallScreen";
import SwitchNetworkMenu from "./SwitchNetworkMenu";
import { useClaimable } from "hooks/rewards/useClaimable";

export const AccountButton = memo(() => {
  const {
    isOpen: isSettingsModalOpen,
    onOpen: openSettingsModal,
    onClose: closeSettingsModal,
  } = useDisclosure();

  const authedOpenSettingsModal = useAuthedCallback(openSettingsModal);

  const {
    isOpen: isClaimRGTModalOpen,
    onOpen: openClaimRGTModal,
    onClose: closeClaimRGTModal,
  } = useDisclosure();

  const authedOpenClaimRGTModal = useAuthedCallback(openClaimRGTModal);



  return (
    <>
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
        openClaimRGTModal={openClaimRGTModal}
      />
      <ClaimRGTModal
        isOpen={isClaimRGTModalOpen}
        onClose={closeClaimRGTModal}
        defaultMode="private"
      />
      <Buttons
        openModal={authedOpenSettingsModal}
        openClaimRGTModal={authedOpenClaimRGTModal}
      />
    </>
  );
});

const Buttons = ({
  openModal,
}: {
  openModal: () => any;
  openClaimRGTModal: () => any;
}) => {
  const { address, isAuthed, login, isAttemptingLogin } = useRari();

  const { t } = useTranslation();

  const isMobile = useIsSmallScreen();

  const handleAccountButtonClick = useCallback(() => {
    if (isAuthed) {
      openModal();
    } else login();
  }, [isAuthed, login, openModal]);

  const { hasClaimableRewards } = useClaimable()

  return (
    <Row mainAxisAlignment="center" crossAxisAlignment="center">
      {isMobile ? null : (
        <>
          <SwitchNetworkMenu />
        </>
      )}

      {/* Connect + Account button */}
      <ButtonOrGlowButton onClick={handleAccountButtonClick} glow={!hasClaimableRewards} >
        <Row
          expand
          mainAxisAlignment="space-around"
          crossAxisAlignment="center"
          px={3}
          py={1}
        >
          {/* Conditionally display Connect button or Account button */}
          {!isAuthed ? (
            isAttemptingLogin ? (
              <Spinner />
            ) : (
              <Text fontWeight="semibold">{t("Connect")}</Text>
            )
          ) : (
            <Center>
              <Stack
                border="transparent"
                w="100%"
                h="100%"
                direction="row"
                spacing={4}
              >
                <Jazzicon diameter={23} seed={jsNumberForAddress(address)} />
              </Stack>
              <Text ml={2} fontWeight="semibold">
                {shortAddress(address)}
              </Text>
            </Center>
          )}
        </Row>
      </ButtonOrGlowButton>
    </Row>
  );
};

const ButtonOrGlowButton = ({ children, onClick, glow }: { children: any, onClick: () => any, glow: boolean }) => {

  return !!glow ? <DarkGlowingButton
    label={''}
    onClick={onClick}
    height="40px"
    flexShrink={0}
    flexGrow={0}
    width="133px"
    fontSize="15px"
    fontWeight="bold"
    ml={{ base: 0, sm: 4 }}
    opacity={0.9}
    _hover={{
      opacity: 1
    }}

  >
    {children}
  </DarkGlowingButton> : <DashboardBox
    as="button"
    height="40px"
    flexShrink={0}
    flexGrow={0}
    width="133px"
    onClick={onClick}
    ml={{ base: 0, sm: 4 }}
    opacity={0.9}
    _hover={{
      opacity: 1
    }}
  >{children}</DashboardBox>
}

export const SettingsModal = ({
  isOpen,
  onClose,
  openClaimRGTModal,
}: {
  isOpen: boolean;
  onClose: () => any;
  openClaimRGTModal: () => any;
}) => {
  const { t } = useTranslation();

  const { login, logout } = useRari();

  const onSwitchWallet = () => {
    onClose();
    setTimeout(() => login(false), 100);
  };

  const handleDisconnectClick = () => {
    onClose();
    logout();
  };

  const onClaimRGT = () => {
    onClose();
    setTimeout(() => openClaimRGTModal(), 100);
  };

  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent {...MODAL_PROPS}>
        <ModalTitleWithCloseButton text={t("Account")} onClose={onClose} />

        <ModalDivider />

        <Column
          width="100%"
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          p={4}
        >
          <GlowingButton
            label={t("Claim RGT")}
            onClick={onClaimRGT}
            width="100%"
            height="51px"
            mb={4}
            innerTextColor="black"
          >
            Claim Rewards
          </GlowingButton>

          <Button
            bg={"whatsapp.500"}
            width="100%"
            height="45px"
            fontSize="xl"
            borderRadius="7px"
            fontWeight="bold"
            onClick={onSwitchWallet}
            _hover={{}}
            _active={{}}
            mb={4}
          >
            {t("Switch Wallet")}
          </Button>

          <Button
            bg="red.500"
            width="100%"
            height="45px"
            fontSize="xl"
            borderRadius="7px"
            fontWeight="bold"
            onClick={handleDisconnectClick}
            _hover={{}}
            _active={{}}
            mb={4}
          >
            {t("Disconnect")}
          </Button>

          <LanguageSelect />

          <Row
            mainAxisAlignment="center"
            crossAxisAlignment="center"
            mt={4}
            width="100%"
          >
            <Link target="_blank" href="https://docs.rari.capital/">
              <Text mx={2} text="sm" textDecoration="underline">
                {t("Docs")}
              </Text>
            </Link>
            <Link
              target="_blank"
              href="https://www.notion.so/Rari-Capital-3d762a07d2c9417e9cd8c2e4f719e4c3"
            >
              <Text mx={2} text="sm" textDecoration="underline">
                {t("Notion")}
              </Text>
            </Link>
            <Link
              target="_blank"
              href="https://www.notion.so/Rari-Capital-Audit-Quantstamp-December-2020-24a1d1df94894d6881ee190686f47bc7"
            >
              <Text mx={2} text="sm" textDecoration="underline">
                {t("Audit")}
              </Text>
            </Link>
          </Row>

          <Text mt={4} fontSize="10px">
            {t("Version")}
            {/* {version} */}
          </Text>
        </Column>
      </ModalContent>
    </Modal>
  );
};
