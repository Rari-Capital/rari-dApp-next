// Components
import { SmallAddIcon } from "@chakra-ui/icons";
import {Link, Text } from "@chakra-ui/react";
import AppLink from "components/shared/AppLink";
import DashboardBox from "components/shared/DashboardBox";
import { RowOrColumn, Center } from "lib/chakraUtils";

// Hooks
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useIsSmallScreen } from "hooks/useIsSmallScreen";
import { useFilter } from "hooks/useFilter";
import { useRouter } from "next/router";
import { useRari } from "context/RariContext";
import { ChainID } from "esm/utils/networks";

const activeStyle = { bg: "#FFF", color: "#000" };

const noop = {};

const FuseTabBar = () => {
  const isMobile = useIsSmallScreen();

  const { t } = useTranslation();

  const router = useRouter();
  const filter = useFilter();
  const { poolId } = router.query;

  const [val, setVal] = useState("");
  const { isAuthed, chainId } = useRari();

  useEffect(() => {
    if (router.pathname === "/fuse") {
      const route = val ? `/fuse?filter=${val}` : "/fuse";
      router.push(route, undefined, { shallow: true });
    }
  }, [val]);

  return (
    <DashboardBox width="100%" mt={4} height={isMobile ? "auto" : "65px"}>
      <RowOrColumn
        isRow={!isMobile}
        expand
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        p={4}
      >
        <TabLink route="/fuse" text={t("Verified Pools")} />
        <TabLink
          route="/fuse?filter=unverified-pools"
          text={t("Unverified Pools")}
        />
        {chainId === ChainID.ETHEREUM ?
          <TabLink
            route="/fuse?filter=rewarded-pools"
            text={t("🎉 Rewarded Pools ")}
          />
          :
          null
        }
        {isAuthed && (
          <>
            <TabLink route="/fuse?filter=my-pools" text={t("My Pools")} />
            <TabLink
              route="/fuse?filter=created-pools"
              text={t("Created Pools")}
            />
          </>
        )}


        {poolId ? (
          <>
            <DashboardBox
              {...(!router.asPath.includes("info") ? activeStyle : {})}
              ml={isMobile ? 0 : 4}
              mt={isMobile ? 4 : 0}
              height="35px"
            >
              <AppLink href={`/fuse/pool/${poolId}`} className="no-underline">
                <Center expand px={2} fontWeight="bold">
                  {t("Pool #{{poolId}}", { poolId })}
                </Center>
              </AppLink>
            </DashboardBox>

            <DashboardBox
              {...(router.pathname.includes("info") ? activeStyle : {})}
              ml={isMobile ? 0 : 4}
              mt={isMobile ? 4 : 0}
              height="35px"
            >
              <AppLink
                href={`/fuse/pool/${poolId}/info`}
                className="no-underline"
              >
                <Center expand px={2} fontWeight="bold">
                  {t("Pool #{{poolId}} Info", { poolId })}
                </Center>
              </AppLink>
            </DashboardBox>
          </>
        ) : null}

        <NewPoolButton />
      </RowOrColumn>
    </DashboardBox>
  );
};

const TabLink = ({ route, text, ...props }: { route: string; text: string, [x: string]: any }) => {
  const isMobile = useIsSmallScreen();
  const router = useRouter();

  return (
    <AppLink
      className="no-underline"
      href={route}
      ml={isMobile ? 0 : 4}
      mt={isMobile ? 4 : 0}
    >
      <DashboardBox
        height="35px"
        {...(route === router.asPath.replace(/\/+$/, "") ? activeStyle : noop)}
        {...props}
      >
        <Center expand px={2} fontWeight="bold">
          <Text>{text}</Text>
        </Center>
      </DashboardBox>
    </AppLink>
  );
};

const TabExternalLink = ({ route, text }: { route: string; text: string }) => {
  const isMobile = useIsSmallScreen();

  return (
    <Link
      className="no-underline"
      href={route}
      isExternal
      ml={isMobile ? 0 : 4}
      mt={isMobile ? 4 : 0}
    >
      <DashboardBox height="35px">
        <Center expand px={2} fontWeight="bold">
          {text}
        </Center>
      </DashboardBox>
    </Link>
  );
};

const NewPoolButton = () => {
  const isMobile = useIsSmallScreen();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <DashboardBox
      mt={isMobile ? 4 : 0}
      ml={isMobile ? 0 : "auto"}
      height="35px"
    // {...("/fuse/new-pool" ===
    // router.pathname.replace(/\/+$/, "") + window.location.search
    //   ? activeStyle
    //   : noop)}
    >
      <AppLink href={`/fuse/create`} className="no-underline">
        <Center expand pl={2} pr={3} fontWeight="bold">
          <SmallAddIcon mr={1} /> {t("New Pool")}
        </Center>
      </AppLink>
    </DashboardBox>
  );
};

export default FuseTabBar;
