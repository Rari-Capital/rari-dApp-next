import { constants, providers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { Interface } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { MAX_APPROVAL_AMOUNT } from "./tokenUtils";

export async function checkAllowance(
  signer: any,
  userAddress: string,
  spender: string,
  underlyingAddress: string,
  amount?: BigNumber
) {
  if (isAssetETH(underlyingAddress)) return true;
  const erc20Interface = new Interface([
    "function allowance(address owner, address spender) public view returns (uint256 remaining)",
  ]);

  const erc20Contract = new Contract(underlyingAddress, erc20Interface, signer);
  const allowance = await erc20Contract.callStatic.allowance(
    userAddress,
    spender
  );

  console.log({allowance, amount}, allowance.gte(amount))

  const hasApproval = allowance.gte(amount);

  return hasApproval;
}

export async function balanceOf(
  userAddress: string | undefined,
  underlyingAddress: string | undefined,
  signer: any
): Promise<BigNumber> {
  if (!userAddress || !underlyingAddress) return constants.Zero;

  if (isAssetETH(underlyingAddress)) return parseEther("0");
  const erc20Interface = new Interface([
    "function balanceOf(address _owner) public view returns (uint256 balance)",
  ]);

  const erc20Contract = new Contract(underlyingAddress, erc20Interface, signer);

  const balance: BigNumber = await erc20Contract.callStatic.balanceOf(
    userAddress
  );

  return balance;
}

export async function approve(
  signer: providers.JsonRpcSigner | providers.Web3Provider | any,
  spender: string,
  underlyingAddress: string,
  amount: BigNumber
) {
  if (isAssetETH(underlyingAddress)) return;

  const erc20Interface = new Interface([
    "function allowance(address owner, address spender) public view returns (uint256 remaining)",
    "function approve(address spender, uint256 value) public returns (bool success)",
  ]);

  const erc20Contract = new Contract(underlyingAddress, erc20Interface, signer);

  return await erc20Contract.approve(spender, amount);
}

const isAssetETH = (address: string) =>
  address === "0x0000000000000000000000000000000000000000";

/**
 * @param provider - An initiated ethers provider.
 * @param userAddress - Address of user to check allowance for.
 * @param spender - Address/User to give approval to.
 * @param underlyingAddress - The token to approve.
 * @param amount - Amount user is supplying.
 */
export async function checkAllowanceAndApprove(
  signer: providers.JsonRpcSigner | providers.Web3Provider | any,
  userAddress: string,
  spender: string,
  underlyingAddress: string,
  amount?: BigNumber
) {
  if (process.env.NEXT_PUBLIC_USE_MOCKS === "true") {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return;
  }

  const hasApprovedEnough = await checkAllowance(
    signer,
    userAddress,
    spender,
    underlyingAddress,
    amount
  );

  if (!hasApprovedEnough) {
    const tx = await approve(signer, spender, underlyingAddress, amount ?? MAX_AMOUNT);
    return tx;
  }
}

const MAX_AMOUNT = BigNumber.from(2)
  .pow(BigNumber.from(256))
  .sub(constants.One); // big fucking #
