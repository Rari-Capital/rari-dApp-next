import { constants, Contract, BigNumber, utils } from "ethers";
import { Fuse } from "esm/index";
import VaultFactoryABI from "./abi/VaultFactory.json";
import VaultABI from "./abi/Vault.json";
import { useRari } from "context/RariContext";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useToast } from "@chakra-ui/toast";
import {
  ETH_TOKEN_DATA,
  WETH9_TOKEN_ADDRESS,
  WETH9_TOKEN_ADDRESS_KOVAN,
} from "hooks/useTokenData";
import { createERC20 } from "utils/createComptroller";

const VAULT_FACTORY_ADDRESS_KOVAN =
  "0xc99a698dfB1eB38E0649e6d2d3462Bc2476dE0B4";

// VaultFactory
export const createVaultFactory = (fuse: Fuse) => {
  const vaultFactory = new Contract(
    VAULT_FACTORY_ADDRESS_KOVAN,
    VaultFactoryABI,
    fuse.provider.getSigner()
  );
  return vaultFactory;
};

export const createVault = (vaultAddress: string, fuse: Fuse) => {
  const vaultFactory = new Contract(
    vaultAddress,
    VaultABI,
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
  let address = utils.getAddress(tokenAddress);
  if (address === ETH_TOKEN_DATA.address) address === WETH9_TOKEN_ADDRESS_KOVAN;
  const vaultFactory = createVaultFactory(fuse);
  const vault = await getVaultAddressForUnderlying(address, fuse);
  return await vaultFactory.isVaultDeployed(vault);
};

export const getVaultAddressForUnderlying = async (
  tokenAddress: string,
  fuse: Fuse
): Promise<string> => {
  let address = utils.getAddress(tokenAddress);
  if (address === ETH_TOKEN_DATA.address) address === WETH9_TOKEN_ADDRESS_KOVAN;
  const vaultFactory = createVaultFactory(fuse);
  const vault = await vaultFactory.getVaultFromUnderlying(address);
  return vault;
};

export const useVaultAddressForUnderlying = (tokenAddress: string) => {
  const { fuse } = useRari();

  const { data: vaultAddress } = useQuery(
    "Vault address for " + tokenAddress,
    async () => {
      return await getVaultAddressForUnderlying(tokenAddress, fuse);
    }
  );

  const isCreated = useIsVaultCreated(tokenAddress);

  return isCreated ? vaultAddress : undefined;
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
      let address =
        tokenAddress === ETH_TOKEN_DATA.address
          ? WETH9_TOKEN_ADDRESS_KOVAN
          : tokenAddress;

      setIsDeploying(true);
      deployVault(address, fuse)
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

// Deposit && Withdraw
export const depositIntoVault = async (
  // vaultAddress: string;
  tokenAddress: string,
  amountBN: BigNumber,
  fuse: Fuse,
  user: string,
  setStep: (x: "APPROVING" | "DEPOSITING" | undefined) => void
) => {
  // Vault
  const vaultAddress = await getVaultAddressForUnderlying(tokenAddress, fuse);
  const vault = createVault(vaultAddress, fuse);

  // Token
  const token = createERC20(fuse, tokenAddress);
  const allowance = await token.allowance(user, vaultAddress);

  console.log({
    amountBN,
    tokenAddress,
    amount: amountBN.toString(),
    vault,
    allowance,
  });

  if (!allowance.gte(amountBN)) {
    setStep("APPROVING");
    await token.approve(vaultAddress, amountBN);
  }

  setStep("DEPOSITING");
  await vault.deposit(amountBN);
  setStep(undefined);
};

export const useDepositIntoVault = () => {
  const { fuse, address } = useRari();
  const toast = useToast();

  const [depositStep, setDepositStep] = useState<
    "APPROVING" | "DEPOSITING" | undefined
  >();

  const depositFn = useCallback(
    (tokenAddress: string, amountBN: BigNumber) => {
      depositIntoVault(tokenAddress, amountBN, fuse, address, setDepositStep)
        .then(() => {
          setDepositStep(undefined);
        })
        .catch((err) => {
          console.log({ err });
          toast({
            title: "Error depositing into Vault",
            description: err.message,
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top-right",
          });
          setDepositStep(undefined);
        });
    },
    [fuse, toast, setDepositStep, depositIntoVault]
  );

  return { deposit: depositFn, depositStep };
};

// Vault Balance
const getVaultBalanceOfUnderlying = async (
  user: string,
  vaultAddress: string | undefined,
  fuse: Fuse
) => {
  if (!vaultAddress) return constants.Zero;
  const vault = createVault(vaultAddress, fuse);
  // console.log({ vault, user, vaultAddress });
  const b = await vault.balanceOfUnderlying(user);
  // console.log({ vault, b, user, vaultAddress });
  return b;
};

export const useVaultBalance = (
  vaultAddress: string | undefined
): BigNumber => {
  const { address, fuse } = useRari();

  const { data } = useQuery(
    `Vault Balance for user ${address} vault ${vaultAddress}`,
    async () => {
      return await getVaultBalanceOfUnderlying(address, vaultAddress, fuse);
    }
  );

  return data ?? constants.Zero;
};
