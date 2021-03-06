import { useRari } from "context/RariContext";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useBalanceOf } from "hooks/useBalanceOf";
import useHasApproval from "hooks/useHasApproval";
import { createSafeAndDeposit } from "lib/turbo/transactions/createSafeAndDeposit";
import { createSafe } from "lib/turbo/transactions/safe";
import { TRIBE, TurboAddresses } from "lib/turbo/utils/constants";
import { useRouter } from "next/router";
import { Heading, Modal, Text } from "rari-components";
import { useState } from "react";
import { approve } from "utils/erc20Utils";
import { handleGenericError } from "utils/errorHandling";
import { Flex, useToast } from "@chakra-ui/react";
import { CreateSafeCtx, MODAL_STEPS } from "./modalSteps";
import { MAX_APPROVAL_AMOUNT } from "utils/tokenUtils";
import { createTurboMaster } from "lib/turbo/utils/turboContracts";
import { getRecentEventDecoded } from "lib/turbo/utils/decodeEvents";
import { useQuery } from "react-query";
import { getEthUsdPriceBN } from "esm/utils/getUSDPriceBN";
import { getPriceFromOracles } from "hooks/rewards/useRewardAPY";
import { BigNumber, constants } from "ethers";
import { calculateMaxBoost } from "lib/turbo/fetchers/safes/getSafeInfo";
import { getMarketCf } from "lib/turbo/utils/getMarketCF";
import { USDPricedTurboSafe } from "lib/turbo/fetchers/safes/getUSDPricedSafeInfo";
import useApprovedCollateral from "hooks/turbo/useApprovedCollateral";

type CreateSafeModalProps = Pick<
  React.ComponentProps<typeof Modal>,
  "isOpen" | "onClose"
>;

export type SimulatedSafe = {
  collateralUSD: BigNumber;
  maxBoost: BigNumber;
};

export const CreateSafeModal: React.FC<CreateSafeModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Rari and NextJs
  const router = useRouter();
  const { address, provider, chainId, fuse, isAuthed } = useRari();
  const toast = useToast();

  // Modal State
  const [stepIndex, setStepIndex] = useState(0);
  function incrementStepIndex() {
    if (stepIndex + 1 !== MODAL_STEPS.length) {
      setStepIndex(stepIndex + 1);
    }
  }
  // Modal Buttons
  const [approving, setApproving] = useState(false);
  const [creatingSafe, setCreatingSafe] = useState(false);
  const [navigating, setNavigating] = useState(false);

  // Safe's chosen underlying asset
  const [createdSafe, setCreatedSafe] = useState<undefined | string>(undefined);

  const underlyingTokenAddresses = useApprovedCollateral();
  const [underlyingTokenAddress, setUnderlyingTokenAddress] = useState(TRIBE);
  const collateralBalance = useBalanceOf(address, underlyingTokenAddress);

  // Used only if user will deposit after creating.
  const [depositAmount, setDepositAmount] = useState<string>("");

  // Router State
  const hasApproval = useHasApproval(
    underlyingTokenAddress,
    TurboAddresses[chainId ?? 1]?.ROUTER,
    depositAmount,
    address
  );

  const { data: safeSimulation } = useQuery<SimulatedSafe | undefined>(
    "Safe creation and deposit simulation for deposit amount:" + depositAmount,
    async () => {
      if (depositAmount === "0" || !depositAmount || !chainId) return;

      // 1. Get eth price and collateral price.
      // @note - collateral price is denominated in ether. collateralPrice * ethPrice = collateralPriceToUSD
      const ethUSDBN = (await getEthUsdPriceBN()).div(constants.WeiPerEther);
      const collateralPriceBN = await getPriceFromOracles(
        TRIBE,
        TurboAddresses[1].COMPTROLLER,
        fuse,
        isAuthed
      );

      // Get collateral factor
      const collateralFactor = await getMarketCf(
        provider,
        chainId,
        underlyingTokenAddress
      );

      // Calculations
      const amountBN = BigNumber.from(depositAmount);
      const collateralUSD = collateralPriceBN.mul(ethUSDBN).mul(amountBN);
      const maxBoost = calculateMaxBoost(collateralUSD, collateralFactor);

      const safe: SimulatedSafe = {
        collateralUSD,
        maxBoost,
      };
      return safe;
    }
  );

  // Modal Logic
  const onClickCreateSafe = async () => {
    if (!address || !provider || !chainId) return;

    setCreatingSafe(true);

    const amountBN = parseEther(depositAmount === "" ? "0" : depositAmount);

    let receipt;
    if (!amountBN.isZero()) {
      try {
        const tx = await createSafe(underlyingTokenAddress, provider, 1);

        receipt = await tx.wait(2);
        const turboMasterContract = createTurboMaster(provider, chainId);
        const event = await getRecentEventDecoded(
          turboMasterContract,
          turboMasterContract.filters.TurboSafeCreated
        );
        setCreatedSafe(event.safe);
        incrementStepIndex();
      } catch (err) {
        handleGenericError(err, toast);
        console.log({ err });
        throw err;
      } finally {
        setCreatingSafe(false);
      }
    } else {
      try {
        const tx = await createSafe(underlyingTokenAddress, provider, chainId);
        const receipt = await tx.wait(1);
        const turboMasterContract = createTurboMaster(provider, chainId);
        const event = await getRecentEventDecoded(
          turboMasterContract,
          turboMasterContract.filters.TurboSafeCreated
        );
        setCreatedSafe(event.safe);
        incrementStepIndex();
      } catch (err) {
        handleGenericError(err, toast);
        console.log({ err });
        throw err;
      } finally {
        setCreatingSafe(false);
      }
    }

    return receipt;
  };

  async function onClickApprove() {
    if (!depositAmount || !chainId) return;

    setApproving(true);

    try {
      await approve(
        provider.getSigner(),
        TurboAddresses[chainId].ROUTER,
        underlyingTokenAddress,
        MAX_APPROVAL_AMOUNT
      );
    } finally {
      setApproving(false);
    }
  }

  const balance = formatEther(collateralBalance);

  const onClickMax = async () => {
    if (!chainId) return;
    try {
      setDepositAmount(balance.slice(0, balance.indexOf(".")));
    } catch (err) {
      handleGenericError(err, toast);
    }
  };

  // Modal Context
  const createSafeCtx: CreateSafeCtx = {
    incrementStepIndex,
    underlyingTokenAddresses,
    underlyingTokenAddress,
    setUnderlyingTokenAddress,
    depositAmount,
    setDepositAmount,
    hasApproval,
    approving,
    onClickApprove,
    onClickCreateSafe,
    creatingSafe,
    safeSimulation,
    navigating,
    collateralBalance: balance,
    onClickMax,
    createdSafe,
    onClose() {
      // Only allow close if a transaction isn't in progress.
      if (!approving && !creatingSafe) {
        setStepIndex(0);
        onClose();
      }
    },
    async navigateToCreatedSafe() {
      if (!createdSafe) return;
      setNavigating(true);
      try {
        await router.push(`/turbo/safe/${createdSafe}`);
      } finally {
        setNavigating(false);
      }
    },
  };

  return (
    <Modal
      ctx={createSafeCtx}
      isOpen={isOpen}
      onClose={() => {
        if (!approving && !creatingSafe) {
          setStepIndex(0);
          onClose();
        }
      }}
      progressValue={((stepIndex + 1) / MODAL_STEPS.length) * 100}
      {...MODAL_STEPS[stepIndex]}
      footerChildren={
        <>
          <Heading size="xs">Common questions:</Heading>
          <Flex justifyContent="space-between">
            <Text mt={2} fontSize="xs">
              What are safes?
            </Text>
            <Text mt={2} fontSize="xs">
              What is boosting?
            </Text>
            <Text mt={2} fontSize="xs">
              How do liquidations work?
            </Text>
          </Flex>
        </>
      }
    />
  );
};

export default CreateSafeModal;
