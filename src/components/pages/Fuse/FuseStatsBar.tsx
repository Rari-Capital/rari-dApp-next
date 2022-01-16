import { Heading, Text } from "@chakra-ui/react";
import { RowOrColumn, Column, Center, Row } from "lib/chakraUtils";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

// Components
import CaptionedStat from "components/shared/CaptionedStat";
import DashboardBox from "components/shared/DashboardBox";
import { APYWithRefreshMovingStat } from "components/shared/MovingStat";
import { WhitelistedIcon } from "components/shared/Icons/WhitelistedIcon";

// Hooks
import { fetchFuseNumberTVL, useFuseTVL } from "hooks/fuse/useFuseTVL";
import { useRari } from "context/RariContext";
import { useIsSmallScreen } from "hooks/useIsSmallScreen";
import { useFuseTotalBorrowAndSupply } from "hooks/fuse/useFuseTotalBorrowAndSupply";

// Utils
import { bnToNumber, smallUsdFormatter } from "utils/bigUtils";
import { FusePoolData } from "utils/fetchFusePoolData";

const FuseStatsBar = ({ data }: { data?: FusePoolData }) => {
  const isMobile = useIsSmallScreen();

  const { t } = useTranslation();

  const { isAuthed, fuse, rari } = useRari();

  const { data: totalBorrowAndSupply } = useFuseTotalBorrowAndSupply();

  const tvl = useFuseTVL();
  console.log({ tvl });

  return (
    <RowOrColumn
      width="100%"
      isRow={!isMobile}
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      height={isMobile ? "auto" : "125px"}
    >
      <DashboardBox
        width={isMobile ? "100%" : "50%"}
        height={isMobile ? "auto" : "100%"}
      >
        <Column
          expand
          mainAxisAlignment="center"
          crossAxisAlignment={isMobile ? "center" : "flex-start"}
          textAlign={isMobile ? "center" : "left"}
          p={4}
          fontSize="sm"
        >
          <Row
            mainAxisAlignment="flex-start"
            crossAxisAlignment="center"
            mb="2px"
          >
            {/* Title */}
            {!!data ? (
              <WhitelistedIcon isWhitelisted={data.isAdminWhitelisted} mb={1} />
            ) : null}
            <Heading size="lg" isTruncated>
              {data?.name ?? "Fuse"}
            </Heading>
          </Row>

          {/* Description */}
          {!!data ? (
            <Text>
              This pool has{" "}
              <span style={{ fontWeight: "bold" }}>
                {smallUsdFormatter(bnToNumber(data.totalSuppliedUSD))} supplied{" "}
              </span>{" "}
              across{" "}
              <span style={{ fontWeight: "bold" }}>
                {data.assets.length} assets.
              </span>{" "}
              Fuse is the first truly open interest rate protocol. Lend, borrow,
              and create isolated lending markets with unlimited flexibility.
            </Text>
          ) : (
            <Text>
              Fuse is the first truly open interest rate protocol. Lend, borrow,
              and create isolated lending markets with unlimited flexibility.
            </Text>
          )}
        </Column>
      </DashboardBox>

      <RowOrColumn
        isRow={!isMobile}
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        height="100%"
        width={isMobile ? "100%" : "50%"}
      >
        {isAuthed &&
        totalBorrowAndSupply &&
        totalBorrowAndSupply.totalSuppliedUSD > 0 ? (
          <>
            <StatBox width={isMobile ? "100%" : "50%"}>
              <CaptionedStat
                crossAxisAlignment="center"
                captionFirst={false}
                statSize="3xl"
                captionSize="sm"
                stat={
                  totalBorrowAndSupply
                    ? smallUsdFormatter(totalBorrowAndSupply.totalSuppliedUSD)
                    : "$?"
                }
                caption={t("Your Supply Balance")}
              />
            </StatBox>

            <StatBox width={isMobile ? "100%" : "50%"}>
              <CaptionedStat
                crossAxisAlignment="center"
                captionFirst={false}
                statSize="3xl"
                captionSize="sm"
                stat={
                  totalBorrowAndSupply
                    ? smallUsdFormatter(totalBorrowAndSupply.totalBorrowedUSD)
                    : "$?"
                }
                caption={t("Your Borrow Balance")}
              />
            </StatBox>
          </>
        ) : (
          <StatBox width="100%">
            <APYWithRefreshMovingStat
              formatStat={smallUsdFormatter}
              fetchInterval={40000}
              loadingPlaceholder="$?"
              apyInterval={100}
              fetch={() => fetchFuseNumberTVL(fuse)}
              queryKey={"fuseTVL"}
              apy={0.15}
              statSize="3xl"
              captionSize="xs"
              caption={t("Total Value Supplied Across Fuse")}
              crossAxisAlignment="center"
              captionFirst={false}
            />
          </StatBox>
        )}
      </RowOrColumn>
    </RowOrColumn>
  );
};

export default FuseStatsBar;

const StatBox = ({
  children,
  ...others
}: {
  children: ReactNode;
  [key: string]: any;
}) => {
  const isMobile = useIsSmallScreen();

  return (
    <DashboardBox
      height={isMobile ? "auto" : "100%"}
      mt={isMobile ? 4 : 0}
      ml={isMobile ? 0 : 4}
      {...others}
    >
      <Center expand p={4}>
        {children}
      </Center>
    </DashboardBox>
  );
};
