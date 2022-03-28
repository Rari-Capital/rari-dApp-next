import { useToast, Button, Input } from "@chakra-ui/react";
import { Modal, Text, TokenSymbol } from "rari-components";

// Hooks
import { useRari } from "context/RariContext";
import { useState } from "react";

// Turbo
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";
import { safeDeposit } from "lib/turbo/transactions/safe";

// Utils
import { formatEther, parseEther } from "ethers/lib/utils";
import { handleGenericError } from "utils/errorHandling";
import { useBalanceOf } from "hooks/useBalanceOf";

// Todo - reuse Modal Prop Types
type DepositSafeCollateralModalProps = {
  isOpen: boolean;
  onClose: () => void;
  safe: SafeInfo | undefined;
};

export const DepositSafeCollateralModal: React.FC<
  DepositSafeCollateralModalProps
> = ({ isOpen, onClose, safe }) => {
  const { address, provider, chainId } = useRari();
  const toast = useToast();

  const [amount, setAmount] = useState<string>("10");

  const [depositing, setDepositing] = useState(false);

  const collateralBalance = useBalanceOf(address, safe?.collateralAsset);

  // TODO - move Approval step outside (check approval/permit and show as a step on UI if not)
  const handleDeposit = async () => {
    if (!amount || !safe) return;
    const amountBN = parseEther(amount);
    const { safeAddress, collateralAsset } = safe;

    try {
      setDepositing(true);

      // TODO - This keeps asking u to approve some reason even if you have
      // await checkAllowanceAndApprove(
      //     await provider.getSigner(),
      //     address,
      //     safeAddress,
      //     TRIBE
      // );

      const tx = await safeDeposit(
        safe.safeAddress,
        address,
        amountBN,
        provider.getSigner()
      );
      console.log({ tx });
    } catch (err) {
      handleGenericError(err, toast);
    } finally {
      setDepositing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Deposit Collateral"}
      subtitle={"Deposit collateral foo"}
    >
      <Input type="number" onChange={(e) => setAmount(e.target.value)} />
      {!!safe && (
        <Text>
          You have {formatEther(collateralBalance)}{" "}
          <TokenSymbol tokenAddress={safe.collateralAsset} />
        </Text>
      )}
      <Button onClick={handleDeposit} disabled={depositing}>
        {depositing ? "Depositing..." : "Deposit"}
      </Button>
    </Modal>
  );
};

export default DepositSafeCollateralModal;
