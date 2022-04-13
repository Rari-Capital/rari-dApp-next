// Chakra and UI stuff
import {
  Heading,
  Box,
  Button,
  Text,
  Image,
  Input,
  useToast,
  Switch,
  Tab,
  TabList,
  Tabs,
  Spinner,
} from "@chakra-ui/react";
import { Row, Column, Center } from "lib/chakraUtils";
import DashboardBox from "../../../../shared/DashboardBox";
import { ModalDivider } from "../../../../shared/Modal";
import { SwitchCSS } from "../../../../shared/SwitchCSS";

// React
import { useState } from "react";
import { HashLoader } from "react-spinners";
import { useQuery, useQueryClient } from "react-query";

// LogRocket
import LogRocket from "logrocket";

// Rari
import { useRari } from "../../../../../context/RariContext";
import { Fuse } from "../../../../../esm/index";

// Hooks
import { useTranslation } from "next-i18next";
import { fetchTokenBalance } from "../../../../../hooks/useTokenBalance";
import {
  ETH_TOKEN_DATA,
  TokenData,
  useTokenData,
} from "../../../../../hooks/useTokenData";
import { useBorrowLimit } from "../../../../../hooks/useBorrowLimit";
import useUpdatedUserAssets from "hooks/fuse/useUpdatedUserAssets";

// Utils
import { smallUsdFormatter } from "../../../../../utils/bigUtils";
import { Mode } from ".";
import { USDPricedFuseAsset } from "../../../../../utils/fetchFusePoolData";
import { useCreateComptroller } from "../../../../../utils/createComptroller";
import { handleGenericError } from "../../../../../utils/errorHandling";
import { ComptrollerErrorCodes } from "../../FusePoolEditPage";
import {
  convertMantissaToAPR,
  convertMantissaToAPY,
} from "../../../../../utils/apyUtils";

import { Contract } from "ethers";
import { BigNumber, utils, constants } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useIsSmallScreen } from "hooks/useIsSmallScreen";
import { ChainID } from "esm/utils/networks";
import useAssetCaps, { AssetCapsMap } from "hooks/fuse/useAssetCapsForPool";

enum UserAction {
  NO_ACTION,
  WAITING_FOR_TRANSACTIONS,
}

export enum CTokenErrorCodes {
  NO_ERROR,
  UNAUTHORIZED,
  BAD_INPUT,
  COMPTROLLER_REJECTION,
  COMPTROLLER_CALCULATION_ERROR,
  INTEREST_RATE_MODEL_ERROR,
  INVALID_ACCOUNT_PAIR,
  INVALID_CLOSE_AMOUNT_REQUESTED,
  INVALID_COLLATERAL_FACTOR,
  MATH_ERROR,
  MARKET_NOT_FRESH,
  MARKET_NOT_LISTED,
  TOKEN_INSUFFICIENT_ALLOWANCE,
  TOKEN_INSUFFICIENT_BALANCE,
  TOKEN_INSUFFICIENT_CASH,
  TOKEN_TRANSFER_IN_FAILED,
  TOKEN_TRANSFER_OUT_FAILED,
  UTILIZATION_ABOVE_MAX,
}

interface Props {
  onClose: () => any;
  assets: USDPricedFuseAsset[];
  index: number;
  mode: Mode;
  setMode: (mode: Mode) => any;
  comptrollerAddress: string;
  isBorrowPaused?: boolean;
}

const AmountSelect = ({
  onClose,
  assets,
  index,
  mode,
  setMode,
  comptrollerAddress,
  isBorrowPaused = false,
}: Props) => {
  const asset = assets[index];

  const { address, fuse, isAuthed, chainId } = useRari();

  const toast = useToast();

  const queryClient = useQueryClient();

  const tokenData = useTokenData(asset.underlyingToken);

  const [userAction, setUserAction] = useState(UserAction.NO_ACTION);

  const [userEnteredAmount, _setUserEnteredAmount] = useState("");

  const [amount, _setAmount] = useState<BigNumber>(constants.Zero);

  const showEnableAsCollateral = !asset.membership && mode === Mode.SUPPLY;
  const [enableAsCollateral, setEnableAsCollateral] = useState(
    showEnableAsCollateral
  );

  const assetCaps = useAssetCaps(comptrollerAddress, assets?.map(a => a.cToken) ?? [])

  const { t } = useTranslation();

  const updateAmount = (newAmount: string) => {
    if (newAmount.startsWith("-")) return;

    _setUserEnteredAmount(newAmount);

    try {
      const bigAmount = utils.parseUnits(newAmount, tokenData?.decimals);
      _setAmount(bigAmount);
    } catch (e) {
      // If the number was invalid, set the amount to null to disable confirming:
      _setAmount(constants.Zero);
    }

    setUserAction(UserAction.NO_ACTION);
  };

  const { data: amountIsValid } = useQuery(
    (amount?.toString() ?? "null") + " " + mode + " isValid",
    async () => {
      if (amount === null || amount.isZero()) {
        return false;
      }

      try {
        const max = await fetchMaxAmount(
          mode,
          fuse,
          address,
          asset,
          comptrollerAddress,
          assetCaps,
        );

        return amount.div(constants.WeiPerEther).lte(max);
      } catch (e) {
        handleGenericError(e, toast);
        return false;
      }
    }
  );

  let depositOrWithdrawAlert = null;
  if (mode === Mode.BORROW && isBorrowPaused) {
    depositOrWithdrawAlert = t("Borrowing is disabled for this asset.");
  } else if (amount === null || amount.isZero()) {
    if (mode === Mode.SUPPLY) {
      depositOrWithdrawAlert = t("Enter a valid amount to supply.");
    } else if (mode === Mode.BORROW) {
      depositOrWithdrawAlert = t("Enter a valid amount to borrow.");
    } else if (mode === Mode.WITHDRAW) {
      depositOrWithdrawAlert = t("Enter a valid amount to withdraw.");
    } else {
      depositOrWithdrawAlert = t("Enter a valid amount to repay.");
    }
  } else if (amountIsValid === undefined) {
    depositOrWithdrawAlert = t("Loading your balance of {{token}}...", {
      token: tokenData?.symbol,

    });
  } else if (!amountIsValid) {
    if (mode === Mode.SUPPLY) {
      depositOrWithdrawAlert = t("You don't have enough {{token}}!", {
        token: tokenData?.symbol,
      });
    } else if (mode === Mode.REPAY) {
      depositOrWithdrawAlert = t(
        "You don't have enough {{token}} or are over-repaying!",
        {
          token: tokenData?.symbol,
        }
      );
    } else if (mode === Mode.WITHDRAW) {
      depositOrWithdrawAlert = t("You cannot withdraw this much!");
    } else if (mode === Mode.BORROW) {
      depositOrWithdrawAlert = t("You cannot borrow this much!");
    }
  } else {
    depositOrWithdrawAlert = null;
  }

  const isMobile = useIsSmallScreen();

  const length = depositOrWithdrawAlert?.length ?? 0;
  let depositOrWithdrawAlertFontSize;
  if (length < 40) {
    depositOrWithdrawAlertFontSize = !isMobile ? "xl" : "17px";
  } else if (length < 50) {
    depositOrWithdrawAlertFontSize = !isMobile ? "15px" : "11px";
  } else if (length < 60) {
    depositOrWithdrawAlertFontSize = !isMobile ? "14px" : "10px";
  }

  const onConfirm = async () => {
    try {
      setUserAction(UserAction.WAITING_FOR_TRANSACTIONS);


      const isETH = asset.underlyingToken === ETH_TOKEN_DATA.address;

      const isRepayingMax =
        amount!.eq(asset.borrowBalance) && !isETH && mode === Mode.REPAY;

      isRepayingMax && console.log("Using max repay!");

      const max = BigNumber.from(2).pow(BigNumber.from(256)).sub(constants.One); //big fucking #

      const cToken = new Contract(
        asset.cToken,
        isETH
          ? JSON.parse(
            fuse.compoundContracts[
              "contracts/CEtherDelegate.sol:CEtherDelegate"
            ].abi
          )
          : JSON.parse(
            fuse.compoundContracts[
              "contracts/CErc20Delegate.sol:CErc20Delegate"
            ].abi
          ),
        fuse.provider.getSigner()
      );

      if (mode === Mode.SUPPLY || mode === Mode.REPAY) {
        // if not eth check if amounti is approved for thsi token
        if (!isETH) {
          const token = new Contract(
            asset.underlyingToken,
            JSON.parse(
              fuse.compoundContracts[
                "contracts/EIP20Interface.sol:EIP20Interface"
              ].abi
            ),
            fuse.provider.getSigner()
          );

          const hasApprovedEnough = (
            await token.callStatic.allowance(address, cToken.address)
          ).gte(amount);

          if (!hasApprovedEnough) {
            let approveTx = await token.approve(cToken.address, max);
            await approveTx.wait(1)
          }

          LogRocket.track("Fuse-Approve");
        }


        // 2.) If collateral, send enterMarkets()
        if (mode === Mode.SUPPLY) {
          // If they want to enable as collateral now, enter the market:
          if (enableAsCollateral) {
            const comptroller = useCreateComptroller(comptrollerAddress, fuse, isAuthed);
            // Don't await this, we don't care if it gets executed first!
            await comptroller.enterMarkets([asset.cToken]);

            LogRocket.track("Fuse-ToggleCollateral");
          }

          // 3 - supplying eth
          if (isETH) {
            const balance = await fuse.provider.getBalance(address)
            // console.log({ amount, balance })
            if (
              // If they are supplying their whole balance:
              amount.eq(balance)
            ) {

              // Get gas price of transaction in wei
              const { gasWEI } = await fetchGasForCall(
                cToken.estimateGas.mint,
                amount,
                fuse,
                address
              );


              // If there's an error fetching gas price return
              if (!gasWEI) return

              // console.log({ gasWEI, total: amount.sub(gasWEI), amount, balance })

              // Mint max amount, after substracting fees
              // Gas price is best handled by the wallet. 
              // On our side we just make sure to leave enough balance to pay for fees.
              let tx = await cToken.mint({
                from: address,
                value: amount.sub(gasWEI),
              });

              await tx.wait(1)

            } else {
              // Custom amount of ETH
              await cToken.mint({ value: amount });
            }
          } else {
            //  Custom amount of ERC20
            let tx = await testForCTokenErrorAndSend(
              cToken.callStatic.mint,
              amount,
              cToken.mint,
              "Cannot deposit this amount right now!"
            );
            await tx.wait(1)
          }
          LogRocket.track("Fuse-Supply");
        } else if (mode === Mode.REPAY) {
          if (isETH) {
            const balance = await fuse.provider.getBalance(address)

            if (
              // If they are repaying their whole balance:
              amount.eq(balance)
            ) {
              // Subtract gas for max ETH

              // Get gas 
              const { gasWEI } = await fetchGasForCall(
                cToken.estimateGas.repayBorrow,
                amount,
                fuse,
                address
              );

              // If there was an error fetching gas return
              if (!gasWEI) return

              // Repay max amount, after substracting fees
              // Gas price is best handled by the wallet. 
              // On our side we just make sure to leave enough balance to pay for fees.
              await cToken.repayBorrow({
                from: address,
                value: amount.sub(gasWEI),
              });
            } else {
              await cToken.repayBorrow({
                from: address,
                value: amount,
              });
            }
          } else {
            let tx = await testForCTokenErrorAndSend(
              cToken.callStatic.repayBorrow,
              isRepayingMax ? max : amount,
              cToken.repayBorrow,
              "Cannot repay this amount right now!"
            );
            await tx.wait(1)
          }
          LogRocket.track("Fuse-Repay");
        }
      } else if (mode === Mode.BORROW) {
        await testForCTokenErrorAndSend(
          cToken.callStatic.borrow,
          amount,
          cToken.borrow,
          "Cannot borrow this amount right now!",
          chainId
        );
        LogRocket.track("Fuse-Borrow");
      } else if (mode === Mode.WITHDRAW) {
        let tx = await testForCTokenErrorAndSend(
          cToken.callStatic.redeemUnderlying,
          amount,
          cToken.redeemUnderlying,
          "Cannot withdraw this amount right now!"
        );

        await tx.wait(1)

        LogRocket.track("Fuse-Withdraw");
      }

      queryClient.refetchQueries();

      // Wait 2 seconds for refetch and then close modal.
      // We do this instead of waiting the refetch because some refetches take a while or error out and we want to close now.
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onClose();
    } catch (e) {
      handleGenericError(e, toast);
      setUserAction(UserAction.NO_ACTION);
    }
  };

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      height={showEnableAsCollateral ? "575px" : "500px"}
    >
      {userAction === UserAction.WAITING_FOR_TRANSACTIONS ? (
        <Column
          expand
          mainAxisAlignment="center"
          crossAxisAlignment="center"
          p={4}
        >
          <HashLoader size={70} color={tokenData?.color ?? "#FFF"} loading />
          <Heading mt="30px" textAlign="center" size="md">
            {t("Check your wallet to submit the transactions")}
          </Heading>
          <Text fontSize="sm" mt="15px" textAlign="center">
            {t("Do not close this tab until you submit all transactions!")}
          </Text>
        </Column>
      ) : (
        <>
          <Row
            width="100%"
            mainAxisAlignment="center"
            crossAxisAlignment="center"
            p={4}
            height="72px"
            flexShrink={0}
          >
            <Box height="35px" width="35px">
              <Image
                width="100%"
                height="100%"
                borderRadius="50%"
                src={
                  tokenData?.logoURL ??
                  "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg"
                }
                alt=""
              />
            </Box>

            <Heading fontSize="27px" ml={3}>
              {!isMobile && asset.underlyingName.length < 25
                ? asset.underlyingName
                : tokenData?.symbol}
            </Heading>
          </Row>

          <ModalDivider />

          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="center"
            px={4}
            pb={4}
            pt={1}
            height="100%"
          >
            <Column
              mainAxisAlignment="flex-start"
              crossAxisAlignment="flex-start"
              width="100%"
            >
              <TabBar color={tokenData?.color} mode={mode} setMode={setMode} />

              <DashboardBox width="100%" height="70px">
                <Row
                  p={4}
                  mainAxisAlignment="space-between"
                  crossAxisAlignment="center"
                  expand
                >
                  <AmountInput
                    color={tokenData?.color ?? "#FFF"}
                    displayAmount={userEnteredAmount}
                    updateAmount={updateAmount}
                    disabled={mode === Mode.BORROW && isBorrowPaused}
                  />
                  <TokenNameAndMaxButton
                    comptrollerAddress={comptrollerAddress}
                    mode={mode}
                    tokenData={tokenData}
                    asset={asset}
                    updateAmount={updateAmount}
                    assetCaps={assetCaps}
                  />
                </Row>
              </DashboardBox>
            </Column>

            <StatsColumn
              amount={amount}
              tokenData={tokenData}
              assets={assets}
              index={index}
              mode={mode}
              enableAsCollateral={enableAsCollateral}
              assetCaps={assetCaps}
            />

            {showEnableAsCollateral ? (
              <DashboardBox p={4} width="100%" mt={4}>
                <Row
                  mainAxisAlignment="space-between"
                  crossAxisAlignment="center"
                  width="100%"
                >
                  <Text fontWeight="bold">{t("Enable As Collateral")}:</Text>
                  <SwitchCSS
                    symbol={tokenData?.symbol ?? asset.underlyingSymbol}
                    color={tokenData?.color}
                  />
                  <Switch
                    h="20px"
                    className={tokenData?.symbol ?? asset.underlyingSymbol + "-switch"}
                    isChecked={enableAsCollateral}
                    onChange={() => {
                      setEnableAsCollateral((past) => !past);
                    }}
                  />
                </Row>
              </DashboardBox>
            ) : null}

            <Button
              mt={4}
              fontWeight="bold"
              fontSize={
                depositOrWithdrawAlert ? depositOrWithdrawAlertFontSize : "2xl"
              }
              borderRadius="10px"
              width="100%"
              height="70px"
              bg={tokenData?.color ?? "#FFF"}
              color={tokenData?.overlayTextColor ?? "#000"}
              // If the size is small, this means the text is large and we don't want the font size scale animation.
              className={
                isMobile ||
                  depositOrWithdrawAlertFontSize === "14px" ||
                  depositOrWithdrawAlertFontSize === "15px"
                  ? "confirm-button-disable-font-size-scale"
                  : ""
              }
              _hover={{ transform: "scale(1.02)" }}
              _active={{ transform: "scale(0.95)" }}
              onClick={onConfirm}
              isDisabled={!amountIsValid}
            >
              {depositOrWithdrawAlert ?? t("Confirm")}
            </Button>
          </Column>
        </>
      )}
    </Column>
  );
};

export default AmountSelect;

const TabBar = ({
  color,
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (mode: Mode) => any;
  color: string | null | undefined;
}) => {
  const isSupplySide = mode < 2;
  const { t } = useTranslation();

  // Woohoo okay so there's some pretty weird shit going on in this component.

  // The AmountSelect component gets passed a `mode` param which is a `Mode` enum. The `Mode` enum has 4 values (SUPPLY, WITHDRAW, BORROW, REPAY).
  // The `mode` param is used to determine what text gets rendered and what action to take on clicking the confirm button.

  // As part of our simple design for the modal, we only show 2 mode options in the tab bar at a time.

  // When the modal is triggered it is given a `defaultMode` (starting mode). This is passed in by the component which renders the modal.
  // - If the user starts off in SUPPLY or WITHDRAW, we only want show them the option to switch between SUPPLY and WITHDRAW.
  // - If the user starts off in BORROW or REPAY, we want to only show them the option to switch between BORROW and REPAY.

  // However since the tab list has only has 2 tabs under it. It accepts an `index` parameter which determines which tab to show as "selected". Since we only show 2 tabs, it can either be 0 or 1.
  // This means we can't just pass `mode` to `index` because `mode` could be 2 or 3 (for BORROW or REPAY respectively) which would be invalid.

  // To solve this, if the mode is BORROW or REPAY we pass the index as `mode - 2` which transforms the BORROW mode to 0 and the REPAY mode to 1.

  // However, we also need to do the opposite of that logic in `onChange`:
  // - If a user clicks a tab and the current mode is SUPPLY or WITHDRAW we just pass that index (0 or 1 respectively) to setMode.
  // - But if a user clicks on a tab and the current mode is BORROW or REPAY, we need to add 2 to the index of the tab so it's the right index in the `Mode` enum.
  //   - Otherwise whenver you clicked on a tab it would always set the mode to SUPPLY or BORROW when clicking the left or right button respectively.

  // Does that make sense? Everything I described above is basically a way to get around the tab component's understanding that it only has 2 tabs under it to make it fit into our 4 value enum setup.
  // Still confused? DM me on Twitter (@transmissions11) for help.

  return (
    <>
      <style>
        {`
            
            .chakra-tabs__tab {
              color: ${color ?? "#FFFFFF"} !important;

              border-bottom-width: 1px;
            }

            .chakra-tabs__tablist {
              border-bottom: 1px solid;
              border-color: #272727;
            }
            
        `}
      </style>
      <Box px={3} width="100%" mt={1} mb="-1px" zIndex={99999}>
        <Tabs
          isFitted
          width="100%"
          align="center"
          index={isSupplySide ? mode : mode - 2}
          onChange={(index: number) => {
            if (isSupplySide) {
              return setMode(index);
            } else {
              return setMode(index + 2);
            }
          }}
        >
          <TabList>
            {isSupplySide ? (
              <>
                <Tab fontWeight="bold" _active={{}} mb="-1px">
                  {t("Supply")}
                </Tab>
                <Tab fontWeight="bold" _active={{}} mb="-1px">
                  {t("Withdraw")}
                </Tab>
              </>
            ) : (
              <>
                <Tab fontWeight="bold" _active={{}} mb="-1px">
                  {t("Borrow")}
                </Tab>
                <Tab fontWeight="bold" _active={{}} mb="-1px">
                  {t("Repay")}
                </Tab>
              </>
            )}
          </TabList>
        </Tabs>
      </Box>
    </>
  );
};

const StatsColumn = ({
  mode,
  assets,
  index,
  amount,
  enableAsCollateral,
  tokenData,
  assetCaps,
}: {
  mode: Mode;
  assets: USDPricedFuseAsset[];
  index: number;
  amount: BigNumber;
  enableAsCollateral: boolean;
  tokenData: TokenData | undefined,
  assetCaps: AssetCapsMap
}) => {
  const { t } = useTranslation();

  // Get the new representation of a user's USDPricedFuseAssets after proposing a supply amount.
  const updatedAssets: USDPricedFuseAsset[] | undefined = useUpdatedUserAssets({
    mode,
    assets,
    index,
    amount,
  });

  const color = tokenData?.color ?? "#FFF"


  // Define the old and new asset (same asset different numerical values)
  const asset = assets[index];
  const updatedAsset = updatedAssets ? updatedAssets[index] : null;

  // Calculate Old and new Borrow Limits
  const borrowLimit = useBorrowLimit(assets);
  const updatedBorrowLimit = useBorrowLimit(updatedAssets ?? [], {
    ignoreIsEnabledCheckFor: enableAsCollateral ? asset.cToken : undefined,
  }, `new limit`);

  // console.log({ assets, updatedAssets })

  const isSupplyingOrWithdrawing =
    mode === Mode.SUPPLY || mode === Mode.WITHDRAW;

  const supplyAPY = convertMantissaToAPY(asset.supplyRatePerBlock, 365);
  const borrowAPR = convertMantissaToAPR(asset.borrowRatePerBlock);

  const updatedSupplyAPY = convertMantissaToAPY(
    updatedAsset?.supplyRatePerBlock ?? constants.Zero,
    365
  );

  const updatedBorrowAPR = convertMantissaToAPR(
    updatedAsset?.borrowRatePerBlock ?? constants.Zero
  );

  // If the difference is greater than a 0.1 percentage point change, alert the user
  const updatedAPYDiffIsLarge = isSupplyingOrWithdrawing
    ? Math.abs(updatedSupplyAPY - supplyAPY) > 0.1
    : Math.abs(updatedBorrowAPR - borrowAPR) > 0.1;


  const parsedBorrowLimit = "$" + utils.commify(parseFloat(borrowLimit.toString()))
  const parsedUpdatedBorrowLimit = "$" + utils.commify(parseFloat(updatedBorrowLimit.div(constants.WeiPerEther).div(constants.WeiPerEther).div(constants.WeiPerEther).toString()))

  const parsedDebtBalance = asset
    ?
    asset.borrowBalanceUSD.toString()
    : "0.00";
  const parsedUpdatedDebtBalance = updatedAsset
    ? utils.formatEther(
      updatedAsset.borrowBalanceUSD.div(constants.WeiPerEther).div(constants.WeiPerEther)
    )
    : "0.00";



  const { supplyCap, borrowCap } = assetCaps[asset.cToken] ?? {
    supplyCap: constants.Zero,
    borrowCap: constants.Zero
  }


  return (
    <DashboardBox width="100%" height="190px" mt={4}>
      {updatedAsset ? (
        <Column
          mainAxisAlignment="space-between"
          crossAxisAlignment="flex-start"
          expand
          py={3}
          px={4}
          fontSize="lg"
        >
          <Row
            mainAxisAlignment="space-between"
            crossAxisAlignment="center"
            width="100%"
            color={color}
          >
            <Text fontWeight="bold" flexShrink={0}>
              {t("Supply Balance")}:
            </Text>
            <Text
              fontWeight="bold"
              flexShrink={0}
              fontSize={isSupplyingOrWithdrawing ? "sm" : "lg"}
            >
              {utils.commify(
                parseFloat(
                  utils.formatUnits(asset.supplyBalance, asset.underlyingDecimals)
                ).toFixed(2)
              )}
              {isSupplyingOrWithdrawing ? (
                <>
                  {" → "}
                  {utils.commify(
                    parseFloat(
                      utils.formatUnits(
                        updatedAsset.supplyBalance,
                        updatedAsset.underlyingDecimals
                      )).toFixed(2)
                  )}
                </>
              ) : null}{" "}
              {tokenData?.symbol ?? asset.underlyingSymbol}
            </Text>
          </Row>

          <Row
            mainAxisAlignment="space-between"
            crossAxisAlignment="center"
            width="100%"
          >
            <Text fontWeight="bold" flexShrink={0}>
              {isSupplyingOrWithdrawing ? t("Supply APY") : t("Borrow APR")}:
            </Text>
            <Text
              fontWeight="bold"
              fontSize={updatedAPYDiffIsLarge ? "sm" : "lg"}
            >
              {isSupplyingOrWithdrawing
                ? supplyAPY.toFixed(2)
                : borrowAPR.toFixed(2)}
              %
              {updatedAPYDiffIsLarge ? (
                <>
                  {" → "}
                  {isSupplyingOrWithdrawing
                    ? updatedSupplyAPY.toFixed(2)
                    : updatedBorrowAPR.toFixed(2)}
                  %
                </>
              ) : null}
            </Text>
          </Row>

          <Row
            mainAxisAlignment="space-between"
            crossAxisAlignment="center"
            width="100%"
          >
            <Text fontWeight="bold" flexShrink={0}>
              {t("Borrow Limit")}:
            </Text>
            <Text
              fontWeight="bold"
              fontSize={isSupplyingOrWithdrawing ? "sm" : "lg"}
            >
              {parsedBorrowLimit}

              {borrowLimit.eq(updatedBorrowLimit) ? null : (
                <>
                  {" → "}
                  {parsedUpdatedBorrowLimit}
                </>
              )}
            </Text>
          </Row>

          <Row
            mainAxisAlignment="space-between"
            crossAxisAlignment="center"
            width="100%"
          >
            <Text fontWeight="bold">{t("Debt Balance")}:</Text>
            <Text
              fontWeight="bold"
              fontSize={!isSupplyingOrWithdrawing ? "sm" : "lg"}
            >
              {
                "$" +
                utils.commify(
                  parsedDebtBalance
                ) // smallUsdFormatter(
              }
              {!isSupplyingOrWithdrawing ? (
                <>
                  {" → "}
                  {
                    "$" +
                    utils.commify(
                      parsedUpdatedDebtBalance.slice(
                        0,
                        parsedUpdatedDebtBalance.indexOf(".") + 3
                      )
                    ) // smallUsdFormatter(
                  }
                </>
              ) : null}
            </Text>
          </Row>
          {isSupplyingOrWithdrawing && supplyCap.gt(0) || !isSupplyingOrWithdrawing && borrowCap.gt(0) ?
            <Row
              mainAxisAlignment="space-between"
              crossAxisAlignment="center"
              width="100%"
            >
              <Text fontWeight="bold" flexShrink={0}>
                {isSupplyingOrWithdrawing ? t("Supply Remaining") : t("Borrow Remaining")}:
              </Text>
              <Text
                fontWeight="bold"
                fontSize={updatedAPYDiffIsLarge ? "sm" : "lg"}
              >
                {isSupplyingOrWithdrawing
                  ?
                  utils.commify(
                    parseFloat(
                      utils.formatUnits(supplyCap.sub(asset.totalSupply), asset.underlyingDecimals)
                    ).toFixed(2)
                  )
                  :
                  utils.commify(
                    parseFloat(
                      utils.formatUnits(borrowCap.sub(asset.totalBorrow), asset.underlyingDecimals)
                    ).toFixed(2)
                  )}
              </Text>
            </Row>
            :
            null
          }
        </Column>
      ) : (
        <Center expand>
          <Spinner />
        </Center>
      )
      }
    </DashboardBox >
  );
};

const TokenNameAndMaxButton = ({
  updateAmount,
  tokenData,
  asset,
  mode,
  comptrollerAddress,
  assetCaps,
}: {
  tokenData: TokenData | undefined,
  asset: USDPricedFuseAsset;
  mode: Mode;
  comptrollerAddress: string;
  updateAmount: (newAmount: string) => any;
  assetCaps: AssetCapsMap
}) => {
  const { fuse, address } = useRari();

  const toast = useToast();

  const [isMaxLoading, setIsMaxLoading] = useState(false);

  const setToMax = async () => {
    setIsMaxLoading(true);

    try {
      const maxBN = await fetchMaxAmount(
        mode,
        fuse,
        address,
        asset,
        comptrollerAddress,
        assetCaps
      );

      if (maxBN!.lt(constants.Zero) || maxBN!.isZero()) {
        updateAmount("");
      } else {
        const str = formatUnits(maxBN, asset.underlyingDecimals);

        updateAmount(str);
      }

      setIsMaxLoading(false);
    } catch (e) {
      handleGenericError(e, toast);
    }
  };

  const { t } = useTranslation();

  return (
    <Row
      mainAxisAlignment="flex-start"
      crossAxisAlignment="center"
      flexShrink={0}
    >
      <Row mainAxisAlignment="flex-start" crossAxisAlignment="center">
        <Box height="25px" width="25px" mb="2px" mr={2}>
          <Image
            width="100%"
            height="100%"
            borderRadius="50%"
            backgroundImage={`url(/static/small-white-circle.png)`}
            src={tokenData?.logoURL ??
              "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg"}
            alt=""
          />
        </Box>
        <Heading fontSize="24px" mr={2} flexShrink={0}>
          {tokenData?.symbol ?? asset.underlyingSymbol}
        </Heading>
      </Row>

      <Button
        ml={1}
        height="28px"
        width="58px"
        bg="transparent"
        border="2px"
        borderRadius="8px"
        borderColor="#272727"
        fontSize="sm"
        fontWeight="extrabold"
        _hover={{}}
        _active={{}}
        onClick={setToMax}
        isLoading={isMaxLoading}
      >
        {t("MAX")}
      </Button>
    </Row>
  );
};

const AmountInput = ({
  displayAmount,
  updateAmount,
  color,
  disabled = false,
}: {
  displayAmount: string;
  updateAmount: (symbol: string) => any;
  color: string;
  disabled?: boolean;
}) => {
  return (
    <Input
      type="number"
      inputMode="decimal"
      fontSize="3xl"
      fontWeight="bold"
      variant="unstyled"
      _placeholder={{ color }}
      placeholder="0.0"
      value={displayAmount}
      color={color}
      onChange={(event) => updateAmount(event.target.value)}
      mr={4}
      disabled={disabled}
    />
  );
};

export async function testForCTokenErrorAndSend(
  txObjectStaticCall: any, // for static calls
  txArgs: any,
  txObject: any, // actual method
  failMessage: string,
  chainId: number = 1
) {
  let response = await txObjectStaticCall(txArgs);
  // For some reason `response` will be `["0"]` if no error but otherwise it will return a string of a number.
  if (response.toString() !== "0") {
    response = parseInt(response);

    let err;

    if (response >= 1000) {
      const comptrollerResponse = response - 1000;

      let msg = ComptrollerErrorCodes[comptrollerResponse];


      if (msg === "BORROW_BELOW_MIN") {
        msg =
          `As part of our guarded launch, you cannot borrow less than ${chainId === ChainID.ARBITRUM ? '.01' : '1'} ETH worth of tokens at the moment.`;
      }

      // This is a comptroller error:
      err = new Error(failMessage + " Comptroller Error: " + msg);
    } else {
      // This is a standard token error:
      err = new Error(
        failMessage + " CToken Code: " + CTokenErrorCodes[response]
      );
    }

    LogRocket.captureException(err);
    throw err;
  }

  return await txObject(txArgs);
}

export const fetchGasForCall = async (
  call: any,
  amountBN: BigNumber,
  fuse: Fuse,
  address: string
) => {
  const estimatedGas = BigNumber.from(
    (
      (await call({
        from: address,
        // Cut amountBN in half in case it screws up the gas estimation by causing a fail in the event that it accounts for gasPrice > 0 which means there will not be enough ETH (after paying gas)
        value: amountBN.div(BigNumber.from(2)),
      })) *
      // 50% more gas for limit:
      5
    ).toFixed(0)
  );

  // Ex: 100 (in GWEI)
  // const { standard } = await fetch("https://gasprice.poa.network").then((res) =>
  //   res.json()
  // );

  const gasInfo = await fuse.provider.getFeeData()
  const gasPrice = gasInfo.maxFeePerGas
  const gasWEI = gasPrice ? estimatedGas.mul(gasPrice).add(gasInfo.maxPriorityFeePerGas ?? constants.Zero) : null;

  return { gasWEI, gasPrice, estimatedGas };


};

async function fetchMaxAmount(
  mode: Mode,
  fuse: Fuse,
  address: string,
  asset: USDPricedFuseAsset,
  comptrollerAddress: string,
  assetCaps: AssetCapsMap,
) {

  const { supplyCap, borrowCap } = assetCaps[asset.cToken] ?? {
    supplyCap: constants.Zero,
    borrowCap: constants.Zero
  }

  if (mode === Mode.SUPPLY) {
    const balance = await fetchTokenBalance(
      asset.underlyingToken,
      fuse,
      address
    );

    // 
    const supplyRemaining = supplyCap.sub(asset.totalSupply)
    const value = supplyRemaining.gt(0) ? (balance.lt(supplyRemaining) ? balance : supplyRemaining) : balance;
    return value
  }

  if (mode === Mode.REPAY) {
    const balance = await fetchTokenBalance(
      asset.underlyingToken,
      fuse,
      address
    );
    const debt = BigNumber.from(asset.borrowBalance);

    if (balance.gt(debt)) {
      return debt;
    } else {
      return balance;
    }
  }

  if (mode === Mode.BORROW) {
    try {
      const maxBorrow =
        await fuse.contracts.FusePoolLensSecondary.callStatic.getMaxBorrow(
          address,
          asset.cToken
        );

      const amount = maxBorrow.mul(3).div(4);

      const borrowRemaining = borrowCap.sub(asset.totalBorrow)
      return borrowRemaining.gt(0) ? (amount.gt(borrowRemaining) ? borrowRemaining : amount.div(1)) : amount.div(1);
      //const amount = BigNumber.from(formatEther(maxBorrow.mul(utils.parseEther("0.75"))));
      //console.log("fetchMaxAmount", { amount, maxBorrow, utils })
    } catch (err) {
      throw new Error("Could not fetch your max borrow amount! Code: " + err);
    }
  }

  if (mode === Mode.WITHDRAW) {
    try {
      const maxRedeem =
        await fuse.contracts.FusePoolLensSecondary.callStatic.getMaxRedeem(
          address,
          asset.cToken
        );

      return maxRedeem;
    } catch (err) {
      throw new Error("Could not fetch your max borrow amount! Code: " + err);
    }
  }
}
