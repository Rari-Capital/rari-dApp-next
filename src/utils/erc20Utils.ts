import { Interface } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { parseEther } from "ethers/lib/utils";
import { constants, providers } from "ethers";

export async function checkAllowance(
  userAddress: string,
  spender: string,
  underlyingAddress: string,
  signer: any
) {
  if (isAssetETH(underlyingAddress)) return true;
  const erc20Interface = new Interface([
    "function allowance(address owner, address spender) public view returns (uint256 remaining)",
  ]);

  const erc20Contract = new Contract(underlyingAddress, erc20Interface, signer);
  const allowance = await erc20Contract.callStatic.allowance(userAddress, spender)

  const max = BigNumber.from(2).pow(BigNumber.from(256)).sub(constants.One);
  const hasApproval = (
    allowance
  ).gte(max);

  return hasApproval;
}

export async function balanceOf(
  userAddress: string,
  underlyingAddress: string,
  signer: any
): Promise<BigNumber> {
  if (isAssetETH(underlyingAddress)) return parseEther("0");
  const erc20Interface = new Interface([
    "function balanceOf(address _owner) public view returns (uint256 balance)",
  ]);

  const erc20Contract = new Contract(underlyingAddress, erc20Interface, signer);

  const balance: BigNumber = await erc20Contract.callStatic.balanceOf(userAddress);

  return balance;
}

export async function approve(
  spender: string,
  underlyingAddress: string,
  signer: providers.JsonRpcSigner | providers.Web3Provider | any
) {
  if (isAssetETH(underlyingAddress)) return
  
  const erc20Interface = new Interface([
      'function allowance(address owner, address spender) public view returns (uint256 remaining)',
      'function approve(address spender, uint256 value) public returns (bool success)',
  ])

  const erc20Contract = new Contract(
      underlyingAddress,
      erc20Interface,
      signer
  )
      
    const max = BigNumber.from(2).pow(BigNumber.from(256)).sub(constants.One); //big fucking #
    return await erc20Contract.approve(spender, max);
}

const isAssetETH = (address: string) =>
  address === "0x0000000000000000000000000000000000000000";
