// Chakra and UI
import { Button, Text, Select, Checkbox, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Row } from "lib/chakraUtils";
import { DASHBOARD_BOX_PROPS } from "../../../../../shared/DashboardBox";
import { QuestionIcon } from "@chakra-ui/icons";
import { SimpleTooltip } from "../../../../../shared/SimpleTooltip";

// React
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Hooks
import { useSushiOrUniswapV2Pairs } from "hooks/fuse/useOracleData";
import { useAddAssetContext } from "context/AddAssetContext";

// Utils
import { smallUsdFormatter, shortUsdFormatter } from "utils/bigUtils";
import { useRari } from "context/RariContext";

const UniswapV2OrSushiPriceOracleConfigurator = ({
  type,
}: {
  // Asset's Address. i.e DAI, USDC

  // Either SushiSwap or Uniswap V2
  type: string;
}) => {
  const { fuse, address } = useRari();
  const { t } = useTranslation();

  // Checks if user has started the TWAP bot.
  const [checked, setChecked] = useState<boolean>(false);

  // Will store oracle response. This helps us know if its safe to add it to Master Price Oracle
  const [checkedStepTwo, setCheckedStepTwo] = useState<boolean>(false);

  const { 
    tokenAddress, 
    setOracleAddress, 
    setUniV3BaseTokenAddress,
    uniV3BaseTokenAddress,
    setActiveUniSwapPair,
    activeUniSwapPair
  } =
    useAddAssetContext();

  // Get pair options from sushiswap and uniswap
  const { SushiPairs, SushiError, UniV2Pairs, univ2Error } =
    useSushiOrUniswapV2Pairs(tokenAddress);

  // This is where we conditionally store data depending on type.
  // Uniswap V2 or SushiSwap
  const Pairs = type === "UniswapV2" ? UniV2Pairs : SushiPairs;
  const Error = type === "UniswapV2" ? univ2Error : SushiError;

  // Will update active pair, set oracle address and base token.
  const updateInfo = (value: string) => {
    const pair = Pairs[value];
    console.log({value})
    setActiveUniSwapPair(value);
    setOracleAddress("");
    setUniV3BaseTokenAddress(
      pair.id === tokenAddress ? pair.token0.id : pair.token1.id
    );
  };

  

  // If pairs are still being fetched, if theres and error or if there are none, return nothing.
  if (Pairs === undefined || Error || Pairs === null) return null;

  return (
    <>
      <Row
        crossAxisAlignment="center"
        mainAxisAlignment="space-between"
        width="260px"
        my={3}
      >
        <Checkbox isChecked={checked} onChange={() => setChecked(!checked)}>
          <Text fontSize="xs" align="left">
          
            Using a UniswapV2 Oracle requires you to continiously run a TWAP bot to keep it updated. 
            <br/>
          </Text>
        </Checkbox>
      </Row>

      {checked ? (
        <>
        <Text fontSize="xs" align="left">
          We'll help you set up the oracle.
        </Text>
        <Row
          crossAxisAlignment="center"
          mainAxisAlignment="space-between"
          width="260px"
          my={3}
        >
          {/* <Button colorScheme="teal">Check</Button> */}

          <Text fontSize="xs" align="center">
            1) Select the uniswap pair you'd like to use:
          </Text>
        </Row>
      
        <Row
          crossAxisAlignment="center"
          mainAxisAlignment="space-between"
          width="260px"
          my={2}
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
            borderRadius="7px"
            _focus={{ outline: "none" }}
            width="180px"
            placeholder={
              activeUniSwapPair.length === 0 ? t("Choose Pool") : activeUniSwapPair
            }
            value={activeUniSwapPair}
            disabled={!checked}
            onChange={(event) => {
              updateInfo(event.target.value);
            }}
          >
            {typeof Pairs !== undefined
              ? Object.entries(Pairs).map(([key, value]: any[]) =>
                  value.totalSupply !== null &&
                  value.totalSupply !== undefined &&
                  value.totalSupply >= 100 ? (
                    <option
                      className="black-bg-option"
                      value={key}
                      key={value.id}
                    >
                      {`${value.token0.symbol} / ${
                        value.token1.symbol
                      } (${shortUsdFormatter(value.totalSupply)})`}
                    </option>
                  ) : null
                )
              : null}
          </Select>
        </Row>
        </>
      ) : null}

      {activeUniSwapPair.length > 0 ? (
        <Row
          crossAxisAlignment="center"
          mainAxisAlignment="space-between"
          width="260px"
          my={2}
        >
          <SimpleTooltip label={t("TVL in pool as of this moment.")}>
            <Text fontWeight="bold">
              {t("Liquidity:")} <QuestionIcon ml={1} mb="4px" />
            </Text>
          </SimpleTooltip>
          <h1>
            {activeUniSwapPair !== ""
              ? smallUsdFormatter(Pairs[activeUniSwapPair].totalSupply)
              : null}
          </h1>
        </Row>
      ) : null}
    </>
  );
};
export default UniswapV2OrSushiPriceOracleConfigurator;
