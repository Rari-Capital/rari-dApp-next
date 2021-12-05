import { Contract, utils } from "ethers";
import { Fuse } from "esm/index";
import VaultFactoryABI from "./abi/VaultFactory.json";
import { useRari } from "context/RariContext";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useToast } from "@chakra-ui/toast";

const VAULT_FACTORY_ADDRESS_TENDERLY =
  "0x41389f80957d45f9459cb41156472cf9ae641aef";

export const createVaultFactory = (fuse: Fuse) => {
  const vaultFactory = new Contract(
    VAULT_FACTORY_ADDRESS_TENDERLY,
    VaultFactoryABI,
    fuse.provider.getSigner()
  );
  return vaultFactory;
};

export const deployVault = async (tokenAddress: string, fuse: Fuse) => {
  const address = utils.getAddress(tokenAddress);
  const vaultFactory = createVaultFactory(fuse);
  return await vaultFactory.deployVault(address);
};

export const isVaultCreated = async (
  tokenAddress: string,
  fuse: Fuse
): Promise<boolean> => {
  const address = utils.getAddress(tokenAddress);
  const vaultFactory = createVaultFactory(fuse);
  const vault = await vaultFactory.getVaultFromUnderlying(address);
  return await vaultFactory.isVaultDeployed(vault);
};

export const useIsVaultCreated = (tokenAddress: string) => {
  const { fuse } = useRari();

  const { data } = useQuery(
    "is Vault created for " + tokenAddress,
    async () => {
      return await isVaultCreated(tokenAddress, fuse);
    }
  );

  return data ?? false;
};

export const useDeployVault = () => {
  const { fuse } = useRari();
  const toast = useToast();
  const [isDeploying, setIsDeploying] = useState(false);

  const deployFn = useCallback(
    (tokenAddress: string) => {
      setIsDeploying(true);
      deployVault(tokenAddress, fuse)
        .then(() => {
          setIsDeploying(false);
        })
        .catch((err) => {
          console.log({ err });
          toast({
            title: "Error deploying Vault",
            description: err.message,
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top-right",
          });
          setIsDeploying(false);
        });
    },
    [fuse, toast, setIsDeploying, deployVault]
  );

  return { deployVault: deployFn, isDeploying };
};
