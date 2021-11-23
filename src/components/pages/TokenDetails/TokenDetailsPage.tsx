import { Box, Heading, Link, Image, VStack } from "@chakra-ui/react";
import { Column, Row, RowOrColumn } from "lib/chakraUtils";
import { useIsSmallScreen } from "hooks/useIsSmallScreen";

import { TokenData } from "hooks/useTokenData";
import MarketChart from "components/modules/MarketChart";
import DashboardBox from "components/shared/DashboardBox";
import { ModalDivider } from "components/shared/Modal";

const TokenDetails = ({ token }: { token: TokenData }) => {
  const isMobile = useIsSmallScreen();

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="center"
      color="#FFFFFF"
      mx="auto"
      mt={5}
      width="100%"
      px={isMobile ? 3 : 10}
    >
      {/* Header */}
      <Header isMobile={isMobile} tokenData={token} />

      <RowOrColumn
        mainAxisAlignment="flex-start"
        crossAxisAlignment="flex-start"
        isRow={!isMobile}
        width="100%"
        h="100%"
        bg="red"
      >
        {/* Column 1 */}
        <Column
          width="100%"
          height="100%"
          mainAxisAlignment="center"
          crossAxisAlignment="flex-start"
          p={2}
          flexBasis={"70%"}
          flexGrow={0}
        >
          {/* Chart */}
          <MarketChart token={token} mb={5} />

          {/* Fuse Pools */}
          {/* <AssetOpportunities token={token} /> */}
        </Column>

        {/* Column 2 */}
        <VStack
          width="100%"
          height="100%"
          mainAxisAlignment="center"
          crossAxisAlignment="flex-start"
          p={2}
          flexBasis={"30%"}
          flexGrow={1}
        >
          <DashboardBox h="150px" w="100%">
            <Heading mx="auto" my="auto">
              Enter Vault
            </Heading>
          </DashboardBox>

          <DashboardBox h="290px" w="100%">
            <Box w="100%" h="30%">
              <Heading mx="auto" my="auto">
                1
              </Heading>
            </Box>
            <ModalDivider />
            <Box w="100%" h="30%">
              <Heading mx="auto" my="auto">
                2
              </Heading>
            </Box>
            <ModalDivider />
            <Box w="100%" h="30%">
              <Heading mx="auto" my="auto">
                3
              </Heading>
            </Box>
          </DashboardBox>

          {/* Chart */}

          {/* Fuse Pools */}
          {/* <AssetOpportunities token={token} /> */}
        </VStack>
      </RowOrColumn>
    </Column>
  );
};

export default TokenDetails;

const Header = ({
  isMobile,
  tokenData,
}: {
  isMobile: boolean;
  tokenData?: TokenData;
}) => {
  return (
    <Row
      mainAxisAlignment="flex-start"
      crossAxisAlignment="center"
      // bg="aqua"
      w="100%"
      h="100%"
    >
      <Row
        mainAxisAlignment="space-between"
        crossAxisAlignment="center"
        w="100%"
        h="100%"
        p={3}
      >
        {/* Token Name + Logo */}
        <Row
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          flexBasis={"75%"}
          //   bg="purple"
        >
          <Image
            src={
              tokenData?.logoURL ??
              "https://static.coingecko.com/s/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png"
            }
            boxSize="50"
          />
          <Heading ml={4} size={isMobile ? "md" : "lg"}>
            {tokenData?.name} ({tokenData?.symbol}){" "}
          </Heading>
        </Row>

        {/* Links */}
        <Row
          mainAxisAlignment="flex-end"
          crossAxisAlignment="center"
          //   bg="blue"
          w="100%"
          h="100%"
          flexBasis={"25%"}
        >
          <Box size="sm" mr={3}>
            <Link href="/home" isExternal>
              <Image
                src={
                  "https://static.coingecko.com/s/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png"
                }
                boxSize="20px"
              />
            </Link>
          </Box>
          <Box size="sm" mr={3}>
            <Link
              href={`https://etherscan.io/address/${tokenData?.address}`}
              isExternal
            >
              <Image
                src={"/static/icons/etherscan-logo-light-circle.svg"}
                boxSize="20px"
              />
            </Link>
          </Box>
          <Box size="sm" mr={3}>
            <Link
              href={`https://info.uniswap.org/#/tokens/${tokenData?.address}`}
              isExternal
            >
              <Image
                src={"/static/icons/uniswap-uni-logo.svg"}
                boxSize="20px"
              />
            </Link>
          </Box>
        </Row>
      </Row>
    </Row>
  );
};
