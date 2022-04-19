import { SimpleGrid } from "@chakra-ui/react";
import { InfoPairs } from "components/pages/Fuse/Modals/PluginModal/PluginRewardsModal";
import { useRari } from "context/RariContext";
import { constants } from "ethers";
import { commify, formatEther } from "ethers/lib/utils";
import useCollateralBoostCap from "hooks/turbo/useCollateralBoostCap";
import { useSafeOwner } from "hooks/turbo/useSafeOwner";
import { useBalanceOf } from "hooks/useBalanceOf";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import { FEI } from "lib/turbo/utils/constants";
import { Modal, Statistic } from "rari-components";

export const SafeInfoModal: React.FC<{
  isOpen: any;
  onClose: any;
  safe: SafeInfo | undefined;
}> = ({ isOpen, onClose, safe }) => {
  const { address } = useRari();
  const safeBalanceOfFei = useBalanceOf(safe?.safeAddress, FEI);
  const userBalanceOfFei = useBalanceOf(address, FEI);

  const collateralBoostCap = useCollateralBoostCap(safe?.collateralAsset);
  const owner = useSafeOwner(safe?.safeAddress);

  return (
    <Modal ctx={{}} isOpen={isOpen} onClose={onClose} title={"Safe Info"}>
      <SimpleGrid columns={2} spacing={4} py={5}>
        <Statistic
          title={"Safe Balance FEI"}
          value={formatEther(safeBalanceOfFei) + " FEI"}
          fontSize="sm"
        />
        {/* <Statistic
          title={"User Balance FEI"}
          value={formatEther(userBalanceOfFei) + " FEI"}
        /> */}
        <Statistic
          title={"Tribe Dao Fee Split"}
          value={
            formatEther(safe?.tribeDAOFee.mul(100) ?? constants.Zero) + "%"
          }
        />
        <Statistic
          title={"Safe Collateral Factor"}
          value={
            formatEther(safe?.collateralFactor.mul(100) ?? constants.Zero) + "%"
          }
        />
        <Statistic
          title={"Collateral Boost Cap"}
          value={
            commify(
              parseFloat(
                formatEther(collateralBoostCap ?? constants.Zero)
              ).toFixed(2)
            ) + " FEI"
          }
        />
      </SimpleGrid>
      <InfoPairs title="Safe" address={safe?.safeAddress ?? ""} />
      <InfoPairs title="Owner" address={owner} />
    </Modal>
  );
};

export default SafeInfoModal;
