import { useEffect, useState } from "react";
import {
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Button,
  Box,
  Text,
  Image,
  Spinner,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useClipboard,
} from "@chakra-ui/react";

import { Column, Center, Row } from "lib/chakraUtils";
import { useTranslation } from "react-i18next";

import { ModalDivider, MODAL_PROPS } from "components/shared/Modal";
import { AdminAlert } from "components/shared/AdminAlert";

import { useTokenData } from "hooks/useTokenData";
import SmallWhiteCircle from "static/small-white-circle.png";
import { useRari } from "context/RariContext";

import {
  FusePoolData,
  USDPricedFuseAsset,
} from "utils/fetchFusePoolData";
import { useTokenBalance } from "hooks/useTokenBalance";
import DashboardBox from "components/shared/DashboardBox";
import { createERC20, createRewardsDistributor } from "utils/createComptroller";
import { RewardsDistributor } from "hooks/rewards/useRewardsDistributorsForPool";
import { shortAddress } from "utils/shortAddress";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { handleGenericError } from "utils/errorHandling";

// Styles
const activeStyle = { bg: "#FFF", color: "#000" };
const noop = () => { };

const useRewardsDistributorInstance = (rDAddress: string) => {
  const { fuse } = useRari();
  return createRewardsDistributor(rDAddress, fuse);
};

// Gets Reward Speed of CToken
const useRewardSpeedsOfCToken = (rDAddress: any, decimals: number, cTokenAddress?: string,) => {
  const { fuse } = useRari();

  const [supplySpeed, setSupplySpeed] = useState<number>(0);
  const [borrowSpeed, setBorrowSpeed] = useState<number>(0);

  useEffect(() => {
    if (!cTokenAddress) return;
    const instance = createRewardsDistributor(rDAddress, fuse);

    // Get Supply reward speed for this CToken from the mapping
    instance.callStatic.compSupplySpeeds(cTokenAddress).then((result: any) => {
      setSupplySpeed(parseFloat(formatUnits(result, decimals)));
    });

    // Get Borrow reward speed for this CToken from the mapping
    instance.callStatic.compBorrowSpeeds(cTokenAddress).then((result: any) => {
      // console.log({ result });
      setBorrowSpeed(parseFloat(formatUnits(result, decimals)));
    });
  }, [fuse, cTokenAddress, decimals]);

  return [supplySpeed, borrowSpeed];
};

const EditRewardsDistributorModal = ({
  rewardsDistributor,
  pool,
  isOpen,
  onClose,
}: {
  rewardsDistributor: RewardsDistributor;
  pool: FusePoolData;
  isOpen: boolean;
  onClose: () => any;
}) => {
  const { t } = useTranslation();

  const { address, fuse } = useRari();
  const rewardsDistributorInstance = useRewardsDistributorInstance(
    rewardsDistributor.address
  );
  const tokenData = useTokenData(rewardsDistributor.rewardToken);
  const isAdmin = address === rewardsDistributor.admin;

  //   Balances
  const { data: balanceERC20 } = useTokenBalance(
    rewardsDistributor.rewardToken,
    rewardsDistributor.address
  );

  const { data: myBalance } = useTokenBalance(rewardsDistributor.rewardToken);

  const toast = useToast();

  // Inputs
  const [sendAmt, setSendAmt] = useState<string>('');

  const [supplySpeed, setSupplySpeed] = useState<number>(0.001);
  const [borrowSpeed, setBorrowSpeed] = useState<number>(0.001);

  //  Loading states
  const [fundingDistributor, setFundingDistributor] = useState(false);
  const [seizing, setSeizing] = useState(false);
  const [changingSpeed, setChangingSpeed] = useState(false);
  const [changingBorrowSpeed, setChangingBorrowSpeed] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<
    USDPricedFuseAsset | undefined
  >(pool?.assets[0] ?? undefined);

  //   RewardsSpeeds
  const [supplySpeedForCToken, borrowSpeedForCToken] = useRewardSpeedsOfCToken(
    rewardsDistributor.address,
    tokenData?.decimals ?? 18,
    selectedAsset?.cToken,
  );

  const { hasCopied, onCopy } = useClipboard(rewardsDistributor?.address ?? "");

  // Sends tokens to distributor
  const fundDistributor = async () => {
    // Create ERC20 instance of rewardToken
    const token = createERC20(fuse, rewardsDistributor.rewardToken);

    try {
      if (!sendAmt) throw new Error('No Send Amount Specified')

      setFundingDistributor(true);
      const sendAmtBn = parseUnits((parseInt(sendAmt)).toString(), tokenData?.decimals)
      let tx = await token
        .transfer(
          rewardsDistributor.address,
          sendAmtBn,
          {
            from: address,
          }
        )
      await tx.wait(1)
      setFundingDistributor(false);
    } catch (err) {
      handleGenericError(err, toast);
      setFundingDistributor(false);
    }
  };

  //   Adds LM to supply side of a CToken in this fuse pool
  const changeSupplySpeed = async () => {
    try {
      setChangingSpeed(true);
      const supplySpeedBN = parseUnits(supplySpeed.toString(), tokenData?.decimals ?? 18)
      if (!isAdmin) throw new Error("User is not admin of this Distributor!");
      let tx = await rewardsDistributorInstance
        ._setCompSupplySpeed(
          selectedAsset?.cToken,
          supplySpeedBN,
          { from: address }
        )
      await tx.wait(1)
      setChangingSpeed(false);
    } catch (err) {
      handleGenericError(err, toast);
      setChangingSpeed(false);
    }
  };

  //   Adds LM to supply side of a CToken in this fuse pool
  const changeBorrowSpeed = async () => {
    try {
      setChangingBorrowSpeed(true);
      const borrowSpeedBN = parseUnits(borrowSpeed.toString(), tokenData?.decimals ?? 18)
      if (!isAdmin) throw new Error("User is not admin of this Distributor!");
      let tx = await rewardsDistributorInstance
        ._setCompBorrowSpeed(
          selectedAsset?.cToken,
          borrowSpeedBN,
          { from: address }
        )
      await tx.wait(1)
      setChangingBorrowSpeed(false);
    } catch (err) {
      handleGenericError(err, toast);
      setChangingBorrowSpeed(false);
    }
  };

  const handleSeizeTokens = async () => {
    try {
      setSeizing(true);
      if (isAdmin) {
        await rewardsDistributorInstance._grantComp(
          address,
          balanceERC20
        );
      } else {
        toast({
          title: "Admin Only!",
          description: "Only admin can seize tokens!",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      }
    }
    catch (err) {
      console.log(err);
      toast({
        title: "Error Seizing Tokens",
        description: "Error Withdrawing Tokens from RewardsDistributor",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
    }
    setSeizing(false);
  };

  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent {...MODAL_PROPS}>
        <Heading fontSize="27px" my={4} textAlign="center">
          {t("Edit Rewards Distributor")}
        </Heading>

        <ModalDivider />

        {/*  RewardToken data */}
        <Column
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          p={4}
        >
          <>
            {tokenData?.logoURL ? (
              <Image
                mt={4}
                src={tokenData.logoURL}
                boxSize="50px"
                borderRadius="50%"
                backgroundImage={`url(${SmallWhiteCircle})`}
                backgroundSize="100% auto"
              />
            ) : null}
            <Heading
              my={tokenData?.symbol ? 3 : 6}
              fontSize="22px"
              color={tokenData?.color ?? "#FFF"}
            >
              {tokenData ? tokenData.name ?? "Invalid Address!" : "Loading..."}
            </Heading>
            <Text>
              {balanceERC20
                ? parseFloat(formatUnits(balanceERC20!, tokenData?.decimals)).toFixed(3)
                : 0}{" "}
              {tokenData?.symbol}
            </Text>
            <Text onClick={onCopy}>
              Contract: {shortAddress(rewardsDistributor.address)}{" "}
              {hasCopied && "Copied!"}
            </Text>
          </>
        </Column>

        <AdminAlert
          isAdmin={isAdmin}
          mt={2}
          isNotAdminText="You are not the admin of this RewardsDistributor. Only the admin can configure rewards."
        />

        {/* Basic Info  */}
        <Column
          mainAxisAlignment="flex-start"
          crossAxisAlignment="flex-start"
          py={4}
        >
          {/* <Row mainAxisAlignment="flex-start" crossAxisAlignment="center">
            <Text>Address: {rewardsDistributor.address}</Text>
          </Row>
          <Row mainAxisAlignment="flex-start" crossAxisAlignment="center">
            <Text>Admin: {rewardsDistributor.admin}</Text>
          </Row>
          <Row mainAxisAlignment="flex-start" crossAxisAlignment="center">
            <Text>
              Balance:{" "}
              {balanceERC20 ? parseFloat(balanceERC20?.toString()) / 1e18 : 0}{" "}
              {tokenData?.symbol}
            </Text>
          </Row> */}

          <ModalDivider />

          {/* Fund distributor */}
          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-start"
            p={4}
          >
            <Heading fontSize={"lg"}> Fund Distributor </Heading>
            <Row
              mainAxisAlignment="flex-start"
              crossAxisAlignment="center"
              mt={1}
            >
              <NumberInput
                step={0.1}
                min={0}
                onChange={(valueString) => {
                  setSendAmt(valueString);
                }}
              >
                <NumberInputField
                  width="100%"
                  textAlign="center"
                  placeholder={"0 " + tokenData?.symbol}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Button
                onClick={fundDistributor}
                bg="black"
                disabled={fundingDistributor}
              >
                {fundingDistributor ? <Spinner /> : "Send"}
              </Button>
              {(!balanceERC20?.isZero() ?? false) && (
                <Button onClick={handleSeizeTokens} bg="red" disabled={seizing}>
                  {seizing ? <Spinner /> : "Withdraw Tokens"}
                </Button>
              )}
            </Row>
            <Text mt={1}>
              Your balance:{" "}
              {myBalance
                ? (parseFloat(myBalance?.toString()) / 1e18).toFixed(2)
                : 0}{" "}
              {tokenData?.symbol}
            </Text>
          </Column>

          {/* Add or Edit a CToken to the Distributor */}

          {!!pool.assets.length ? (
            <Column
              mainAxisAlignment="flex-start"
              crossAxisAlignment="flex-start"
              p={4}
              w="100%"
            >
              <Heading fontSize={"lg"}> Manage CToken Rewards </Heading>
              {/* Select Asset */}
              <Row
                mainAxisAlignment="flex-start"
                crossAxisAlignment="center"
                mt={1}
                overflowX="scroll"
                width="100%"
                maxW="100%"
              >
                {pool.assets.map(
                  (asset: USDPricedFuseAsset, index: number, array: any[]) => {
                    return (
                      <Box
                        pr={index === array.length - 1 ? 4 : 2}
                        key={asset.cToken}
                        flexShrink={0}
                      >
                        <DashboardBox
                          as="button"
                          onClick={() => setSelectedAsset(asset)}
                          {...(asset.cToken === selectedAsset?.cToken
                            ? activeStyle
                            : noop)}
                        >
                          <Center expand px={4} py={1} fontWeight="bold">
                            {asset.underlyingSymbol}
                          </Center>
                        </DashboardBox>
                      </Box>
                    );
                  }
                )}
              </Row>

              {/* Change Supply Speed */}
              <Column
                mainAxisAlignment="flex-start"
                crossAxisAlignment="flex-start"
                py={3}
              >
                <Row
                  mainAxisAlignment="flex-start"
                  crossAxisAlignment="flex-start"
                >
                  <NumberInput
                    step={0.1}
                    min={0}
                    onChange={(supplySpeed) => {
                      // console.log({ supplySpeed });
                      setSupplySpeed(parseFloat(supplySpeed));
                    }}
                  >
                    <NumberInputField
                      width="100%"
                      textAlign="center"
                      placeholder={"0 " + tokenData?.symbol}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Button
                    onClick={changeSupplySpeed}
                    bg="black"
                    disabled={changingSpeed}
                  >
                    {changingSpeed ? <Spinner /> : "Set"}
                  </Button>
                </Row>
                <Row
                  mainAxisAlignment="flex-start"
                  crossAxisAlignment="flex-start"
                >
                  <Text>
                    Supply Speed:{" "}
                    {supplySpeedForCToken.toFixed(5)}
                  </Text>
                </Row>
              </Column>

              {/* Change Borrow Speed */}
              <Column
                mainAxisAlignment="flex-start"
                crossAxisAlignment="flex-start"
                py={3}
              >
                <Row
                  mainAxisAlignment="flex-start"
                  crossAxisAlignment="flex-start"
                >
                  <NumberInput
                    step={0.1}
                    min={0}
                    onChange={(borrowSpeed) => {
                      // console.log({ borrowSpeed });
                      setBorrowSpeed(parseFloat(borrowSpeed));
                    }}
                  >
                    <NumberInputField
                      width="100%"
                      textAlign="center"
                      placeholder={"0 " + tokenData?.symbol}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>

                  <Button
                    onClick={changeBorrowSpeed}
                    bg="black"
                    disabled={changingBorrowSpeed}
                  >
                    {changingBorrowSpeed ? <Spinner /> : "Set"}
                  </Button>
                </Row>
                <Row
                  mainAxisAlignment="flex-start"
                  crossAxisAlignment="flex-start"
                >
                  <Text>
                    Borrow Speed:{" "}
                    {borrowSpeedForCToken.toFixed(5)}

                  </Text>
                </Row>
              </Column>
            </Column>
          ) : (
            <Center p={4}>
              <Text fontWeight="bold">
                Add CTokens to this pool to configure their rewards.
              </Text>
            </Center>
          )}
        </Column>
      </ModalContent>
    </Modal>
  );
};

export default EditRewardsDistributorModal;
