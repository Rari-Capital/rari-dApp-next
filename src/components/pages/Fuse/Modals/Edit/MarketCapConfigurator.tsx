// Charka and UI
import { ConfigRow, SaveButton } from "../../FusePoolEditPage";
import { SimpleTooltip } from "components/shared/SimpleTooltip";
import { Box, Text } from "@chakra-ui/layout";
import { QuestionIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { Input } from "@chakra-ui/react";
import { Row } from "lib/chakraUtils";
import { useState } from "react";
import { useQuery } from "react-query";
import { useRari } from "context/RariContext";
import { useCreateComptroller } from "utils/createComptroller";
import { Button } from "@chakra-ui/button";
import { handleGenericError } from "utils/errorHandling";
import { useToast } from "@chakra-ui/toast";
import { TokenData } from "hooks/useTokenData";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { BigNumber, constants } from "ethers";

const MarketCapConfigurator = ({
  comptrollerAddress,
  cTokenAddress,
  tokenData,
  mode,
}: {
  comptrollerAddress: string;
  cTokenAddress: string | undefined;
  tokenData: TokenData;
  mode: "Supply" | "Borrow";
}) => {
  const { t } = useTranslation();
  const [newSupplyCap, setNewSupplyCap] = useState<string>("");
  const { fuse, address, isAuthed } = useRari();
  const toast = useToast();

  const tokenSymbol = tokenData.symbol;

  console.log({ tokenData })
  console.log({ newSupplyCap })

  const comptroller = useCreateComptroller(comptrollerAddress, fuse, isAuthed);

  const { data: supplyCap } = useQuery(
    "Get " + mode + " cap for: " + tokenData.symbol,
    async () => {
      // no cap frfr
      let cap: BigNumber = constants.Zero;
      if (cTokenAddress) {
        if (mode === "Supply") {
          cap = await comptroller.supplyCaps(cTokenAddress);
        }

        if (mode === "Borrow") {
          cap = await comptroller.borrowCaps(cTokenAddress);
        }
      }
      return cap;
    }
  );

  const handleSubmit = async () => {
    const tokenDecimals = tokenData.decimals ?? 18;
    const newSupplyCapBN = parseUnits(newSupplyCap, tokenDecimals)

    if (!cTokenAddress) return;

    try {
      if (mode === "Supply")
        await comptroller._setMarketSupplyCaps(
          [cTokenAddress],
          [newSupplyCapBN],
          {
            from: address,
          }
        );

      if (mode === "Borrow")
        await comptroller._setMarketBorrowCaps(
          [cTokenAddress],
          [newSupplyCapBN],
          {
            from: address,
          }
        );

      toast({
        title: "Success!",
        description: "You've updated the asset's" + mode + " cap.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch (e) {
      handleGenericError(e, toast);
    }
  };
  return (
    <>
      <Row
        mainAxisAlignment="center"
        justifyContent="space-between"
        crossAxisAlignment="center"
        width="100%"
        my={4}
        px={4}
        height="100%"
      >
        <SimpleTooltip
          label={t(
            "Sets cap for the market. Users will not be able to supply/borrow once the cap is met."
          )}
        >
          <Text fontWeight="bold">
            {mode + " caps"} <QuestionIcon ml={1} mb="4px" />
          </Text>
        </SimpleTooltip>
        <Box
          width="50%"
          height="auto"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-end"
          alignContent="center"
        >
          <Input
            width="150px"
            height="30px"
            extAlign="center"
            mb={newSupplyCap !== "" ? 5 : 0}
            placeholder={
              supplyCap?.gt(0)
                ? formatUnits(supplyCap, tokenData.decimals) + tokenSymbol
                : t(`${tokenSymbol} ${mode} Cap`)
            }
            type="number"
            size="sm"
            value={newSupplyCap}
            onChange={(event) => {
              setNewSupplyCap(event.target.value);
            }}
          />

          {newSupplyCap !== "" ? (
            <Box
              height="100%"
              width="100%"
              display="flex"
              justifyContent="flex-end"
              flexDirection="column"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignContent="center"
              >
                <Text fontSize="sm" opacity="0.7">
                  New {mode} cap:
                </Text>
                <Box height="100%" width="40%">
                  <Text opacity="0.5" textAlign="end">
                    {newSupplyCap}{" "}
                    {tokenSymbol}
                  </Text>
                </Box>
              </Box>

              {supplyCap?.isZero() ? null : (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignContent="center"
                >
                  <Text fontSize="sm" opacity="0.7">
                    Current supply cap:
                  </Text>
                  <Box height="100%" width="40%">
                    <Text opacity="0.5" textAlign="end">
                      {tokenSymbol}{" "}
                      {formatUnits(
                        supplyCap ?? constants.Zero,
                        tokenData.decimals
                      )}
                    </Text>
                  </Box>
                </Box>
              )}
              <SaveButton
                mt="2"
                ml="auto"
                onClick={handleSubmit}
                fontSize="xs"
                altText={"Submit"}
              />
            </Box>
          ) : null}
        </Box>
      </Row>
    </>
  );
};

export default MarketCapConfigurator;
