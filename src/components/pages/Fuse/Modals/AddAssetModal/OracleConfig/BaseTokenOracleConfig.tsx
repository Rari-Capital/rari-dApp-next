// Chakra and UI
import { Input, Box, Text, Select, Alert, AlertIcon } from "@chakra-ui/react";
import { Column, Row } from "lib/chakraUtils";
import { DASHBOARD_BOX_PROPS } from "components/shared/DashboardBox";
import { QuestionIcon } from "@chakra-ui/icons";
import { SimpleTooltip } from "components/shared/SimpleTooltip";

// Components
import { CTokenIcon } from "components/shared/Icons/CTokenIcon";

// React
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// Rari
import { useRari } from "context/RariContext";

// Hooks
import { useGetOracleOptions } from "hooks/fuse/useOracleData";
import { useAddAssetContext } from "context/AddAssetContext";

const BaseTokenOracleConfig = () => {
  const { t } = useTranslation();

  const { address } = useRari();

  const {
    mode,
    oracleData,
    uniV3BaseTokenAddress,
    uniV3BaseTokenOracle,
    setUniV3BaseTokenOracle,
    baseTokenActiveOracleName,
    setBaseTokenActiveOracleName,
  } = useAddAssetContext();

  const isUserAdmin = address === oracleData?.admin ?? false;

  // We get all oracle options.
  const options = useGetOracleOptions(oracleData, uniV3BaseTokenAddress);

  // If we're editing the asset, show master price oracle as a default.
  // Should run only once, when component renders.
  useEffect(() => {
    if (
      mode === "Editing" &&
      baseTokenActiveOracleName === "" &&
      options &&
      options["Current_Price_Oracle"]
    )
      setBaseTokenActiveOracleName("Current_Price_Oracle");
  }, [mode, baseTokenActiveOracleName, options, setBaseTokenActiveOracleName]);

  // This will update the oracle address, after user chooses which options they want to use.
  // If option is Custom_Oracle oracle address is typed in by user, so we dont trigger this.
  useEffect(() => {
    if (
      !!baseTokenActiveOracleName &&
      baseTokenActiveOracleName !== "Custom_Oracle" &&
      options
    )
      setUniV3BaseTokenOracle(options[baseTokenActiveOracleName]);
  }, [baseTokenActiveOracleName, options, setUniV3BaseTokenOracle]);

  return (
    <>
      <Row
        crossAxisAlignment="center"
        mainAxisAlignment="center"
        width="100%"
        my={2}
      >
        <Alert status="info" width="80%" height="50px" borderRadius={5} my={1}>
          <AlertIcon />
          <Text fontSize="sm" align="center" color="black">
            {"This Uniswap V3 TWAP Oracle needs an oracle for the BaseToken."}
          </Text>
        </Alert>
      </Row>
      <Column
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        w="100%"
        h="100%"
      >
        <Column
          my={4}
          width="100%"
          crossAxisAlignment="center"
          mainAxisAlignment="space-between"
        >
          <Column
            mainAxisAlignment="center"
            crossAxisAlignment="center"
            height="50%"
            justifyContent="space-around"
          >
            <CTokenIcon address={uniV3BaseTokenAddress} boxSize={"50px"} />
            <SimpleTooltip
              label={t("Choose the best price oracle for this BaseToken.")}
            >
              <Text fontWeight="bold" fontSize="sm" align="center">
                {t("BaseToken Price Oracle")} <QuestionIcon ml={1} mb="4px" />
              </Text>
            </SimpleTooltip>
          </Column>

          {options ? (
            <Box alignItems="center" height="50%">
              <Select
                {...DASHBOARD_BOX_PROPS}
                ml="auto"
                my={2}
                borderRadius="7px"
                _focus={{ outline: "none" }}
                width="260px"
                placeholder={
                  baseTokenActiveOracleName.length === 0
                    ? t("Choose Oracle")
                    : baseTokenActiveOracleName.replaceAll("_", " ")
                }
                value={baseTokenActiveOracleName.toLowerCase()}
                disabled={
                  !isUserAdmin ||
                  (!oracleData?.adminOverwrite &&
                    !options.Current_Price_Oracle === null)
                }
                onChange={(event) =>
                  setBaseTokenActiveOracleName(event.target.value)
                }
              >
                {Object.entries(options).map(([key, value]) =>
                  value !== null &&
                  value !== undefined &&
                  key !== "Uniswap_V3_Oracle" &&
                  key !== "Uniswap_V2_Oracle" ? (
                    <option className="black-bg-option" value={key} key={key}>
                      {key.replaceAll("_", " ")}
                    </option>
                  ) : null
                )}
              </Select>

              {baseTokenActiveOracleName.length > 0 ? (
                <Input
                  width="100%"
                  textAlign="center"
                  height="40px"
                  variant="filled"
                  size="sm"
                  mt={2}
                  mb={2}
                  value={uniV3BaseTokenOracle}
                  onChange={(event) => {
                    const address = event.target.value;
                    setUniV3BaseTokenOracle(address);
                  }}
                  disabled={
                    baseTokenActiveOracleName === "Custom_Oracle" ? false : true
                  }
                  {...DASHBOARD_BOX_PROPS}
                  _placeholder={{ color: "#e0e0e0" }}
                  _focus={{ bg: "#121212" }}
                  _hover={{ bg: "#282727" }}
                  bg="#282727"
                />
              ) : null}
            </Box>
          ) : null}
        </Column>
      </Column>
    </>
  );
};

export default BaseTokenOracleConfig;
