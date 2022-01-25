import { Vaults } from "esm";
import { useState } from "react";
import { chooseBestWeb3Provider } from "utils/web3Providers";

const useVaultsSDK = () => {
    const [rari, setRari] = useState<Vaults>(
        () => new Vaults(chooseBestWeb3Provider(1, true))
      );
    return {rari}
}

export default useVaultsSDK
