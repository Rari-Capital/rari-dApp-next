import { PixelSize, Row } from "lib/chakraUtils";
import { Box, Flex, Icon, Spacer, useDisclosure } from "@chakra-ui/react";

//  Components
import DashboardBox, { DASHBOARD_BOX_SPACING } from "../DashboardBox";
import { AccountButton } from "../AccountButton";

import { SmallLogo } from "components/shared/Logos";
import { useRari } from "context/RariContext";
import { useTranslation } from "next-i18next";
import { useIsSmallScreen } from "hooks/useIsSmallScreen";
import { DropDownLink, HeaderLink } from "./HeaderLink";
import HeaderSearchbar from "./HeaderSearchbar";
import AppLink from "../AppLink";
import {
  GOVERNANCE_DROPDOWN_ITEMS,
  PRODUCTS_DROPDOWN_ITEMS,
  UtilLinks,
  UTILS_DROPDOWN_ITEMS,
} from "constants/nav";
import { HamburgerIcon } from "@chakra-ui/icons";
import { MobileNavModal } from "./MobileNavModal";

export const HeaderHeightWithTopPadding = new PixelSize(
  38 + DASHBOARD_BOX_SPACING.asNumber()
);

export const NewHeader = () => {
  const { chainId } = useRari();
  const { t } = useTranslation();
  const isMobile = useIsSmallScreen();

  const {
    isOpen: isNavModalOpen,
    onOpen: openNavModal,
    onClose: closeNavModal,
  } = useDisclosure();

  // const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Row
        color="#FFFFFF"
        px={4}
        height="38px"
        my={4}
        mainAxisAlignment="space-between"
        crossAxisAlignment="center"
        overflowX="visible"
        overflowY="visible"
        width="100%"
        zIndex={3}
        mb={5}
        // bg="pink"
      >
        <AppLink href="/">
          <SmallLogo />
        </AppLink>

        {isMobile ? null : (
          <Row
            mx={4}
            expand
            mainAxisAlignment="flex-start"
            crossAxisAlignment="center"
            overflowX="auto"
            overflowY="hidden"
            // transform="translate(0px, 7px)"
            height="100%"
          >
            {/* Dropdown  */}
            <DropDownLink
              name={t("Products")}
              ml={2}
              links={PRODUCTS_DROPDOWN_ITEMS}
            />
            <HeaderLink name={t("Explore")} route="/explore" />

            <DropDownLink
              name={t("Tools")}
              ml={2}
              links={UtilLinks(chainId ?? 1)}
            />

            {/* <DropDownLink
              name={t("Governance")}
              links={GOVERNANCE_DROPDOWN_ITEMS}
            /> */}
          </Row>
        )}
        {/* <Box alignSelf="flex-start" mr={5}>
          {!isMobile && <HeaderSearchbar />}
        </Box> */}
        {!!isMobile && <Spacer />}
        <Flex>
          <AccountButton />
          {isMobile && (
            <DashboardBox
              ml={3}
              as="button"
              height="40px"
              flexShrink={0}
              width="50px"
              fontSize="15px"
              onClick={openNavModal}
              fontWeight="bold"
            >
              <Icon as={HamburgerIcon} />
            </DashboardBox>
          )}
        </Flex>
      </Row>

      <MobileNavModal
        isOpen={isNavModalOpen}
        onClose={closeNavModal}
        defaultMode="private"
      />
    </>
  );
};

export default NewHeader;
