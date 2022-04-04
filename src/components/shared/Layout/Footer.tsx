import CopyrightSpacer from "../CopyrightSpacer";
import { HStack } from "@chakra-ui/react";
import { Link, Text } from "rari-components/standalone";
import { Column } from "lib/chakraUtils";
import { useTranslation } from 'next-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <>
      <Column
        mainAxisAlignment="center"
        crossAxisAlignment="center"
        py={3}
        width="100%"
        flexShrink={0}
        mt="auto"
        color="white"
      >
        <HStack
          mt={4}
          width="100%"
          justifyContent="center"
          spacing={4}
        >
          <Link target="_blank" href="https://docs.rari.capital/">
            {t("Docs")}
          </Link>
          <Text>
            ·
          </Text>
          <Link
            target="_blank"
            href="https://www.notion.so/Rari-Capital-3d762a07d2c9417e9cd8c2e4f719e4c3"
          >
            {t("Notion")}
          </Link>
          <Text>
            ·
          </Text>
          <Link
            target="_blank"
            href="https://www.notion.so/Rari-Capital-Audit-Quantstamp-December-2020-24a1d1df94894d6881ee190686f47bc7"
          >
            {t("Audit")}
          </Link>
        </HStack>
        <CopyrightSpacer forceShow />
      </Column>
    </>
  );
};

export default Footer;
