// Components
import { ModalDivider } from "components/shared/Modal";
import { SimpleTooltip } from "components/shared/SimpleTooltip";
import AppLink from "components/shared/AppLink";
import { AvatarGroup, Box, HStack, Text } from "@chakra-ui/react";

// Utils
import { Center, Column, Row, useIsMobile } from "lib/chakraUtils";
import { smallUsdFormatter } from "utils/bigUtils";
import { CTokenIcon } from "../../../shared/Icons/CTokenIcon";
import { usePoolIncentives } from "hooks/rewards/usePoolIncentives";
import { WhitelistedIcon } from "components/shared/Icons/WhitelistedIcon";

export const PoolRow = ({
  tokens,
  poolNumber,
  tvl,
  borrowed,
  name,
  noBottomDivider,
  isWhitelisted,
  comptroller,
  rewardTokens,
}: {
  tokens: { symbol: string; address: string }[];
  poolNumber: number;
  tvl: number;
  borrowed: number;
  name: string;
  noBottomDivider?: boolean;
  isWhitelisted: boolean;
  comptroller: string;
  rewardTokens: string[];
}) => {
  const isEmpty = tokens.length === 0;

  // const rss = usePoolRSS(poolNumber);
  const rssScore = "?";

  const isMobile = useIsMobile();

  return (
    <>
      <AppLink
        href={"/fuse/pool/" + poolNumber}
        className="no-underline"
        width="100%"
      >
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          width="100%"
          height="90px"
          className="hover-row"
          pl={4}
          pr={1}
        >
          <Column
            pt={2}
            width={isMobile ? "100%" : "40%"}
            height="100%"
            mainAxisAlignment="center"
            crossAxisAlignment="flex-start"
          >
            {isEmpty ? null : (
              <SimpleTooltip label={tokens.map((t) => t.symbol).join(" / ")}>
                <AvatarGroup size="xs" max={30} mr={2}>
                  {tokens.map(({ address }) => {
                    return <CTokenIcon key={address} address={address} />;
                  })}
                </AvatarGroup>
              </SimpleTooltip>
            )}

            <Row
              mainAxisAlignment="flex-start"
              crossAxisAlignment="center"
              mt={isEmpty ? 0 : 2}
            >
              <WhitelistedIcon
                isWhitelisted={isWhitelisted}
                mr={2}
                boxSize={"15px"}
                mb="2px"
              />
              <Row mainAxisAlignment="flex-start" crossAxisAlignment="center">
                <Text>
                  {name.length > 20 && rewardTokens.length > 0
                    ? name.substring(0, 20) + "..."
                    : name}
                </Text>
                {rewardTokens.length > 0 ? (
                  <>
                    <Text mx={2} fontWeight={"bold"}>
                      ·
                    </Text>
                    <Text fontSize={14} color={"rgb(200, 128, 200)"}>
                      🎉 Offering rewards
                    </Text>
                    <AvatarGroup size="2xs" max={30} ml={2}>
                      {rewardTokens.map((address) => {
                        return <CTokenIcon key={address} address={address} />;
                      })}
                    </AvatarGroup>
                  </>
                ) : null}
              </Row>
            </Row>
          </Column>

          {isMobile ? null : (
            <>
              <Center height="100%" width="13%">
                <b>{poolNumber}</b>
              </Center>
                <Center height="100%" width="16%">
                  <b>{smallUsdFormatter(tvl)}</b>
                </Center>
                <Center height="100%" width="16%">
                  <b>{smallUsdFormatter(borrowed)}</b>
                </Center>
            </>
          )}
        </Row>
      </AppLink>

      {noBottomDivider ? null : <ModalDivider />}
    </>
  );
};
export default PoolRow;
