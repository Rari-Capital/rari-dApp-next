import { useEffect, useState } from "react";

// Context
// Fuse
import { useAddAssetContext } from "context/AddAssetContext";
// Rari
import { useRari } from "context/RariContext";

// Chakra UI
import { Button, Text, useClipboard, Box } from "@chakra-ui/react";
import { CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Column, Row } from "lib/chakraUtils";
import AppLink from "components/shared/AppLink";

// Hooks
import { useSushiOrUniswapV2Pairs } from "hooks/fuse/useOracleData";
import useCheckUniV2Oracle from "hooks/fuse/useCheckUniV2Oracle";
// Utils
import { shortAddress } from "utils/shortAddress";

const UniswapV2TwapInfoForBot = () => {
  const [pairAddress, setPairAddress] = useState("");
  const { fuse, address } = useRari();

  const {
    oracleAddress,
    uniV3BaseTokenAddress,
    activeOracleModel,
    setOracleAddress,
    tokenAddress,
    activeUniSwapPair,
    tokenData,
  } = useAddAssetContext();

  // Get pair options from sushiswap and uniswap
  const { SushiPairs, SushiError, UniV2Pairs, univ2Error } =
    useSushiOrUniswapV2Pairs(tokenAddress);

  // Deploy Oracle
  const deployUniV2Oracle = async () => {
    const addressToUse = await fuse.deployPriceOracle(
      "UniswapTwapPriceOracleV2",
      { baseToken: uniV3BaseTokenAddress },
      { from: address }
    );
    const id =
      activeOracleModel === "Uniswap_V2_Oracle"
        ? UniV2Pairs[activeUniSwapPair].id
        : SushiPairs[activeUniSwapPair].id;
    setPairAddress(id);
    setOracleAddress(addressToUse);
  };

  const [special, setSpecial] = useState(false);

  useEffect(() => {
    if (!isItReady) return;
    deployUniV2Oracle();
    setSpecial(true);
  });

  const rootPriceOracle =
    fuse.addresses.UNISWAP_TWAP_PRICE_ORACLE_V2_ROOT_CONTRACT_ADDRESS;

  const { hasCopied: copiedRoot, onCopy: onCopyRoot } = useClipboard(
    rootPriceOracle ?? ""
  );
  const { hasCopied: copiedBase, onCopy: onCopyBase } = useClipboard(
    uniV3BaseTokenAddress ?? ""
  );
  const { hasCopied: copiedPair, onCopy: onCopyPair } = useClipboard(
    pairAddress ?? ""
  );

  const isItReady = useCheckUniV2Oracle(
    tokenAddress,
    uniV3BaseTokenAddress,
    activeOracleModel
  );
  return (
    <>
      {!isItReady && pairAddress === "" && uniV3BaseTokenAddress.length > 0 ? (
        <>
          <Text fontSize="xs" align="center">
            2) Click below to deploy the oracle.
          </Text>
          <Text fontSize="xs">
            After deploying you'll have to configure your TWAP bot with the
            given information.
          </Text>
          <Button
            onClick={() => deployUniV2Oracle()}
            width="25%"
            height="10%"
            fontWeight="bold"
            borderRadius="5px"
            bg={tokenData.color! ?? "#FFF"}
            _hover={{ transform: "scale(1.02)" }}
            _active={{ transform: "scale(0.95)" }}
            color={tokenData.overlayTextColor! ?? "#000"}
          >
            Deploy!
          </Button>
        </>
      ) : null}
      {pairAddress !== "" && oracleAddress !== "" ? (
        <>
          <Row
            mainAxisAlignment="center"
            crossAxisAlignment="center"
            height="10%"
          >
            <Column mainAxisAlignment="center" crossAxisAlignment="center">
              <Text fontSize="xs" align="center">
                {special ? "2)" : "3)"} With the information below please
                configure your TWAP bot.
              </Text>
              <Text fontSize="xs" align="center">
                <AppLink
                  href="https://github.com/Rari-Capital/fuse-twap-bot"
                  isExternal
                >
                  You can use Rari Capital's recommended twap bot.{" "}
                  <ExternalLinkIcon />
                </AppLink>
              </Text>
            </Column>
          </Row>
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="space-evenly"
            height="50%"
          >
            <TwapBotConfigRow
              label={"Root oracle contract address:"}
              onCopy={onCopyRoot}
              hasCopied={copiedRoot}
              addressToCopy={rootPriceOracle}
            />
            <TwapBotConfigRow
              label={"Pair address:"}
              onCopy={onCopyPair}
              hasCopied={copiedPair}
              addressToCopy={pairAddress}
            />
            <TwapBotConfigRow
              label={"Pair's base token address:"}
              onCopy={onCopyBase}
              hasCopied={copiedBase}
              addressToCopy={uniV3BaseTokenAddress}
            />
          </Box>
          <Row
            mainAxisAlignment="center"
            crossAxisAlignment="center"
            height="10%"
          >
            <Text fontSize="xs" align="center">
              {special ? "3)" : "4)"} Once your TWAP is running please contact
              us to add the supported pair to our Grafana and redundancy bot
              list.
            </Text>
          </Row>
        </>
      ) : null}
    </>
  );
};

const TwapBotConfigRow = ({
  label,
  onCopy,
  hasCopied,
  addressToCopy,
}: {
  label: string;
  onCopy: () => void;
  hasCopied: boolean;
  addressToCopy: string;
}) => {
  return (
    <Row mainAxisAlignment="center" crossAxisAlignment="center">
      <Column
        mainAxisAlignment="center"
        crossAxisAlignment="flex-start"
        width="60%"
      >
        <Text>{label}</Text>
      </Column>
      <Column
        mainAxisAlignment="center"
        crossAxisAlignment="center"
        width="30%"
      >
        <Text
          onClick={() => onCopy()}
          fontSize="sm"
          width="70%"
          display="flex"
          justifyContent="space-evenly"
        >
          {shortAddress(addressToCopy)} <CopyIcon />
        </Text>
        {hasCopied ? (
          <Text opacity="0.6" fontSize="10px">
            Copied!
          </Text>
        ) : null}
      </Column>
    </Row>
  );
};

export default UniswapV2TwapInfoForBot;
