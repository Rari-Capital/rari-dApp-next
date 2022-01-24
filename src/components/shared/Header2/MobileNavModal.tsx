import {
  Modal,
  ModalOverlay,
  ModalContent,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Heading,
  Flex,
} from "@chakra-ui/react";

import { Column } from "lib/chakraUtils";

import { useTranslation } from "next-i18next";

import { useRari } from "context/RariContext";
import {
  GOVERNANCE_DROPDOWN_ITEMS,
  PRODUCTS_DROPDOWN_ITEMS,
  UtilLinks,
  UTILS_DROPDOWN_ITEMS,
} from "constants/nav";

import AppLink from "../AppLink";
import { ModalDivider, ModalTitleWithCloseButton, MODAL_PROPS } from "../Modal";
import HeaderSearchbar from "./HeaderSearchbar";
import { MenuItemInterface, MenuItemType } from "./HeaderLink";

interface MobileNavAccordionItemProps {
  name: string;
  items: MenuItemInterface[];
}

const MobileNavAccordionItem: React.FC<MobileNavAccordionItemProps> = ({
  name,
  items,
}) => {
  return (
    <AccordionItem py={3} h="100%" w="100%" flex={1} border="none">
      <AccordionButton>
        <Box flex="1" textAlign="left">
          <Heading size="md">{name}</Heading>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        <Flex flexDirection="column">
          {items.map((item) => {
            if (item.type === MenuItemType.LINK) {
              return (
                <Box py={1}>
                  <AppLink href={item.link?.route} key={item.link?.route}>
                    {item.link?.name}
                  </AppLink>
                </Box>
              );
            } else if (item.type === MenuItemType.MENUGROUP) {
              return (
                <Box mt={4}>
                  <Heading size="sm" fontWeight="normal" color="grey" mb={2}>
                    {item.title}
                  </Heading>
                  {item.links?.map((link) => (
                    <Box py={1}>
                      <AppLink href={link.route} key={link.route}>
                        {link.name}
                      </AppLink>
                    </Box>
                  )) ?? null}
                </Box>
              );
            } else {
              return null;
            }
          })}
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};

export const MobileNavModal = ({
  isOpen,
  onClose,
  defaultMode,
}: {
  isOpen: boolean;
  onClose: () => any;
  defaultMode?: string;
}) => {
  const { t } = useTranslation();
  const { chainId } = useRari();

  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent {...MODAL_PROPS}>
        <ModalTitleWithCloseButton text="Rari" onClose={onClose} />

        <ModalDivider />

        <Column
          width="100%"
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          p={4}
        >
          <Accordion allowToggle w="100%">
            <MobileNavAccordionItem
              name={t("Products")}
              items={PRODUCTS_DROPDOWN_ITEMS}
            />
            <MobileNavAccordionItem
              name={t("Governance")}
              items={GOVERNANCE_DROPDOWN_ITEMS}
            />
            <MobileNavAccordionItem
              name={t("Tools")}
              items={UTILS_DROPDOWN_ITEMS}
            />
          </Accordion>

          <Box mt={3} p={3} width="100%">
            <HeaderSearchbar mx="auto" width="100%" />
          </Box>
        </Column>
      </ModalContent>
    </Modal>
  );
};
