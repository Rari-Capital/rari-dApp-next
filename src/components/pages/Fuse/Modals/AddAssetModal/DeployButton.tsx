// Chakra and UI
import { Button } from "@chakra-ui/button";
import { Center } from "@chakra-ui/react";

// Rari
import { useRari } from "context/RariContext";

// Hooks
import { useTranslation } from "react-i18next";
import useCheckUniV2Oracle from "hooks/fuse/useCheckUniV2Oracle";

// Components
import TransactionStepper from "components/shared/TransactionStepper";
import { Column } from "lib/chakraUtils";
import { useAddAssetContext } from "context/AddAssetContext";
import { utils } from "ethers";

const DeployButton = ({ steps, deploy }: { deploy: any; steps: any }) => {
  const { t } = useTranslation();
  const { fuse } = useRari();

  const {
    mode,
    stage,
    tokenData,
    activeStep,
    isDeploying,
    oracleAddress,
    handleSetStage,
    uniV3BaseTokenOracle,
    shouldShowUniV3BaseTokenOracleForm,
    needsRetry,
    // New stuff
    hasPriceForAsset,
    hasDefaultOracle,
    defaultOracle,
    tokenAddress,
    uniV3BaseTokenAddress,
    activeOracleModel,
    activeUniSwapPair
  } = useAddAssetContext();

  const isItReady = useCheckUniV2Oracle(tokenAddress, uniV3BaseTokenAddress, activeOracleModel)
  // If user hasnt edited the form and we have a default oracle price for this asset
  const hasDefaultOraclePriceAndHasntEdited =
    hasDefaultOracle && hasPriceForAsset && oracleAddress === defaultOracle;

  // This checks whether the user can proceed in the Oracle Configuration step.
  const checkUserOracleConfigurationState = (
    oracleAddress: string,
    shouldShowUniV3BaseTokenOracleForm: boolean,
    uniV3BaseTokenOracle: string
  ) => {
    // If the user needs to configure a BaseToken Oracle for their Univ3 Pair, then disable until its set
    if (shouldShowUniV3BaseTokenOracleForm) {
      console.log('lol1')
      return utils.isAddress(uniV3BaseTokenOracle);
    }

    // NEW: If this Fuse pool has a default oracle and price
    // AND if the oracle is not set yet in the UI, let them continue
    // console.log("checkUserOracleConfigurationState", {
    //   hasDefaultOracle,
    //   hasPriceForAsset,
    //   oracleAddress,
    //   hasDefaultOraclePriceAndHasntEdited,
    // });

    if (hasDefaultOraclePriceAndHasntEdited) return true;

    // If its depending on a twap bot wait for it to be ready
      // once isItReady is true disabled should be false..
    if (
      activeOracleModel === "Uniswap_V2_Oracle"
      || activeOracleModel === "SushiSwap_Oracle"
    ) {
      console.log('lol333')
      return isItReady
    }

    // If the oracle address is not set at all, then disable until it is set.
    console.log({oracleAddress, activeUniSwapPair},"SDSDSDSDSD", {shouldShowUniV3BaseTokenOracleForm})
    return utils.isAddress(oracleAddress);
  };

  const shouldNextButtonBeDisabled = !checkUserOracleConfigurationState(
    oracleAddress,
    shouldShowUniV3BaseTokenOracleForm,
    uniV3BaseTokenOracle
  );

  console.log({shouldNextButtonBeDisabled})

  return (
    <Column
      mainAxisAlignment="center"
      crossAxisAlignment="center"
      px={4}
      width="100%"
      height="100%"
      flexBasis="10%"
      // bg="red"
    >
      {isDeploying ? (
        <TransactionStepper
          activeStep={activeStep}
          tokenData={tokenData}
          steps={steps}
        />
      ) : null}
      <Column
        mainAxisAlignment="center"
        crossAxisAlignment="center"
        px={4}
        width="100%"
        height="100%"
      >
        <Center w="100%" h="100%">
          {stage !== 1 && !isDeploying && (
            <Button
              width={stage === 3 ? "20%" : "50%"}
              mx={4}
              height="100%"
              // fontSize="2xl"
              onClick={() => handleSetStage(-1)}
              fontWeight="bold"
              borderRadius="10px"
              disabled={isDeploying}
              bg={tokenData.color! ?? "#FFF"}
              _hover={{ transform: "scale(1.02)" }}
              _active={{ transform: "scale(0.95)" }}
              color={tokenData.overlayTextColor! ?? "#000"}
            >
              {t("Previous")}
            </Button>
          )}

          {stage < 3 && (
            <Button
              width="100%"
              height="100%"
              // height="70px"
              mx={4}
              // fontSize="2xl"
              onClick={() => handleSetStage(1)}
              fontWeight="bold"
              borderRadius="10px"
              disabled={stage === 2 ? shouldNextButtonBeDisabled : false}
              bg={tokenData.color! ?? "#FFF"}
              _hover={{ transform: "scale(1.02)" }}
              _active={{ transform: "scale(0.95)" }}
              color={tokenData.overlayTextColor! ?? "#000"}
            >
              {t("Next")}
            </Button>
          )}

          {stage === 3 && (
            <Button
              width={needsRetry ? "100%" : "75%"}
              height="70px"
              fontSize={{
                base: "sm",
                sm: "sm",
                md: "md",
                lg: "xl",
              }}
              onClick={() => deploy()}
              fontWeight="bold"
              borderRadius="10px"
              disabled={!needsRetry && isDeploying}
              bg={tokenData.color! ?? "#FFF"}
              _hover={{ transform: "scale(1.02)" }}
              _active={{ transform: "scale(0.95)" }}
              color={tokenData.overlayTextColor! ?? "#000"}
              style={{
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              {needsRetry
                ? `(RETRY) ${steps[activeStep]}`
                : isDeploying
                ? steps[activeStep]
                : t("Confirm")}
            </Button>
          )}
        </Center>
      </Column>
    </Column>
  );
};

export default DeployButton;
