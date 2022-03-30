import { useRari } from "context/RariContext";
import { constants } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useBalanceOf } from "hooks/useBalanceOf";
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";
import { FEI } from "lib/turbo/utils/constants";
import { Modal, Statistic } from "rari-components";

export const SafeInfoModal: React.FC<{ isOpen: any, onClose: any, safe: SafeInfo | undefined }> = ({
    isOpen,
    onClose,
    safe
}) => {
    const { address } = useRari()
    const safeBalanceOfFei = useBalanceOf(safe?.safeAddress, FEI);
    const userBalanceOfFei = useBalanceOf(address, FEI);

    return (
        <Modal
            ctx={{}}
            isOpen={isOpen}
            onClose={onClose}
            title={"Safe Info"}
        >
            <Statistic
                title={"Safe Balance FEI"}
                value={formatEther(safeBalanceOfFei) + " FEI"}
            />
            <Statistic
                title={"User Balance FEI"}
                value={formatEther(userBalanceOfFei) + " FEI"}
            />
            <Statistic
                title={"Tribe Dao Fee Split"}
                value={formatEther(safe?.tribeDAOFee.mul(100) ?? constants.Zero) + "%"}
            />
        </Modal>
    );
};

export default SafeInfoModal;
