// Chakra and UI
import { Text, Select, Link, Alert, AlertIcon } from "@chakra-ui/react";
import { Column, Row } from "lib/chakraUtils";
import { DASHBOARD_BOX_PROPS } from "components/shared/DashboardBox";
import { QuestionIcon } from "@chakra-ui/icons";
import { SimpleTooltip } from "components/shared/SimpleTooltip";

// React
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

// Axios
import axios from "axios";

// Utils
import { shortUsdFormatter } from "utils/bigUtils";
import { useAddAssetContext } from "context/AddAssetContext";
import { useMemo } from "react";
import { useRari } from "context/RariContext";
import { ChainID } from "esm/utils/networks";

const UniswapV3PriceOracleConfigurator = () => {
  const { chainId } = useRari();
  const { t } = useTranslation();

  const {
    setFeeTier,
    tokenAddress,
    setOracleAddress,
    setUniV3BaseTokenAddress,
    activeUniSwapPair,
    setActiveUniSwapPair,
  } = useAddAssetContext();

  // We get a list of whitelistedPools from uniswap-v3's the graph.
  const { data: liquidity, error } = useQuery(
    `UniswapV3 pool liquidity for ${tokenAddress} on ChainID: ${chainId}`,
    async () => {
      const tokenAddressFormatted = tokenAddress.toLowerCase();

      // TODO: Config file
      const graphUrl =
        chainId === ChainID.ETHEREUM
          ? "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"
          : "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal";

      return (
        await axios.post(graphUrl, {
          query: `{
            token(id:"${tokenAddressFormatted}") {
              whitelistPools {
                id,
                feeTier,
                totalValueLockedUSD,
                token0 {
                  name,
                  id,
                  symbol
                },
                token1 {
                  name,
                  id,
                  symbol
                },
                volumeUSD
              }
            }
          }`,
        })
      ).data.data;
    },
    { refetchOnMount: false }
  );

  // When user selects an option this function will be called.
  // Active pool, fee Tier, and base token are updated and we set the oracle address to the address of the pool we chose.
  const updateBoth = (value: string) => {
    const uniPool = liquidity.token.whitelistPools[value];

    const baseToken: string =
      uniPool.token0.id.toLowerCase() === tokenAddress.toLocaleLowerCase()
        ? uniPool.token1.id
        : uniPool.token0.id;
    setActiveUniSwapPair(value);
    setFeeTier(uniPool.feeTier);
    setOracleAddress(uniPool.id);
    setUniV3BaseTokenAddress(baseToken);
  };

  // If liquidity is undefined, theres an error or theres no token found return nothing.
  if (liquidity === undefined || liquidity.token === undefined) return null;

  // Sort whitelisted pools by TVL. Greatest to smallest. Greater TVL is safer for users so we show it first.
  // Filter out pools where volume is less than $100,000
  const liquiditySorted = liquidity.token.whitelistPools.sort(
    (a: any, b: any): any =>
      parseInt(a.totalValueLockedUSD) > parseInt(b.totalValueLockedUSD) ? -1 : 1
  );
  // .filter((pool: any) => pool.volumeUSD >= 100000);

  const selectedOracle = liquidity.token.whitelistPools[activeUniSwapPair];
  // const warning = useMemo(() => {
  //   if (selectedOracle.liquidityProviderCount <=100)
  // }, [selectedOracle]);

  return (
    <>
      <Column
        crossAxisAlignment="flex-start"
        mainAxisAlignment="center"
        width={"100%"}
        height={"100%"}
        my={2}
        px={4}
        ml={"auto"}
        // bg="aqua"
        id="UNIv3COLUMN"
      >
        <Row
          crossAxisAlignment="center"
          mainAxisAlignment="space-between"
          w="100%"
          // bg="green"
        >
          <SimpleTooltip
            label={t(
              "This field will determine which pool your oracle reads from. Its safer with more liquidity."
            )}
          >
            <Text fontWeight="bold">
              {t("Pool:")} <QuestionIcon ml={1} mb="4px" />
            </Text>
          </SimpleTooltip>
          <Select
            {...DASHBOARD_BOX_PROPS}
            ml={2}
            mb={2}
            width="180px"
            borderRadius="7px"
            value={activeUniSwapPair}
            _focus={{ outline: "none" }}
            placeholder={
              activeUniSwapPair === "" ? t("Choose Pool") : activeUniSwapPair
            }
            onChange={(event) => {
              updateBoth(event.target.value);
            }}
          >
            {typeof liquidity !== undefined
              ? Object.entries(liquiditySorted).map(([key, value]: any[]) =>
                  value.totalValueLockedUSD !== null &&
                  value.totalValueLockedUSD !== undefined &&
                  value.totalValueLockedUSD >= 100 ? (
                    <option
                      className="black-bg-option"
                      value={key}
                      key={value.id}
                    >
                      {`${value.token0.symbol} / ${
                        value.token1.symbol
                      } (${shortUsdFormatter(value.totalValueLockedUSD)})`}
                    </option>
                  ) : null
                )
              : null}
          </Select>
        </Row>

        {activeUniSwapPair !== "" ? (
          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-start"
          >
            <Row mainAxisAlignment="flex-start" crossAxisAlignment="flex-start">
              <Alert
                status="warning"
                width="100%"
                height="70px"
                borderRadius={5}
                my={1}
              >
                <AlertIcon />
                <Text fontSize="sm" align="center" color="black">
                  {
                    "Make sure this Uniswap V3 Pool has full-range liquidity. If not, your pool could be compromised."
                  }
                </Text>
              </Alert>
            </Row>

            <Row
              mainAxisAlignment="space-between"
              crossAxisAlignment="center"
              my={2}
              w="100%"
              // bg="pink"
            >
              <SimpleTooltip label={t("TVL in pool as of this moment.")}>
                <Text fontWeight="bold">
                  {t("Liquidity:")} <QuestionIcon ml={1} mb="4px" />
                </Text>
              </SimpleTooltip>
              <h1>
                {activeUniSwapPair !== ""
                  ? shortUsdFormatter(
                      liquidity.token.whitelistPools[activeUniSwapPair]
                        .totalValueLockedUSD
                    )
                  : null}
              </h1>
            </Row>
            <Row
              mainAxisAlignment="space-between"
              crossAxisAlignment="center"
              my={2}
              w="100%"
              // bg="pink"
            >
              <SimpleTooltip label={t("Volume of pool.")}>
                <Text fontWeight="bold">
                  {t("Volume:")} <QuestionIcon ml={1} mb="4px" />
                </Text>
              </SimpleTooltip>

              <h1>
                {activeUniSwapPair !== ""
                  ? shortUsdFormatter(
                      liquidity.token.whitelistPools[activeUniSwapPair]
                        .volumeUSD
                    )
                  : null}
              </h1>
            </Row>
            {/* <Row
              mainAxisAlignment="space-between"
              crossAxisAlignment="center"
              my={2}
              w="100%"
              // bg="pink"
            >
              <SimpleTooltip
                label={t(
                  "The fee percentage for the pool on Uniswap (0.05%, 0.3%, 1%)"
                )}
              >
                <Text fontWeight="bold">
                  {t("Fee Tier:")} <QuestionIcon ml={1} mb="4px" />
                </Text>
              </SimpleTooltip>
              <Text>
                %
                {activeUniSwapPair !== ""
                  ? liquidity.data.token.whitelistPools[activeUniSwapPair]
                      .feeTier / 10000
                  : null}
              </Text>
            </Row> */}
            <Row
              crossAxisAlignment="center"
              mainAxisAlignment="center"
              width="100%"
              my={0}
            >
              <Link
                href={`https://info.uniswap.org/#/pools/${liquidity.token.whitelistPools[activeUniSwapPair].id}`}
                isExternal
              >
                Visit Pool in Uniswap
              </Link>
            </Row>
          </Column>
        ) : null}
      </Column>
    </>
  );
};

export default UniswapV3PriceOracleConfigurator;
