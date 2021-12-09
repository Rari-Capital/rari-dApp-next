import { useEffect, useState } from "react";
import { fetchVaultByUnderlying } from "lib/vaultsv2/vaults";
import { SubgraphVault } from "lib/vaultsv2/types";
import { ETH_TOKEN_DATA, WETH9_TOKEN_ADDRESS_KOVAN } from "hooks/useTokenData";
import { utils } from "ethers";

const useVaultForUnderlying = (tokenAddress: string) => {
  const [vault, setVault] = useState<SubgraphVault | undefined>();

  useEffect(() => {
    if (!tokenAddress) return;
    let address =
      tokenAddress === ETH_TOKEN_DATA.address
        ? WETH9_TOKEN_ADDRESS_KOVAN
        : utils.getAddress(tokenAddress);

    fetchVaultByUnderlying(address).then(setVault);
  }, [tokenAddress]);

  return vault;
};

export default useVaultForUnderlying;
