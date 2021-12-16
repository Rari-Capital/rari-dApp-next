import { GET_VAULT_FOR_UNDERLYING } from "gql/vaults/getVault";
import { GET_VAULTS } from "gql/vaults/getVaults";
import { makeVaultsGqlRequest } from "utils/gql";
import { SubgraphVault, SubgraphStrategy } from "./types";

export type GetVaultsResult_Vault = Pick<
  SubgraphVault,
  | "id"
  | "initialized"
  | "totalHoldings"
  | "totalStrategyHoldings"
  | "totalFloat"
  | "totalSupply"
  | "underlying"
  | "underlyingDecimals"
  | "underlyingSymbol"
> & { trustedStrategies: SubgraphStrategy[] };

interface GetVaultsResult {
  vaults: GetVaultsResult_Vault[];
}

export const fetchVaults = async () => {
  const { vaults }: GetVaultsResult = await makeVaultsGqlRequest(GET_VAULTS);
  return vaults;
};

interface GetVaultByUnderlyingResult {
  vaults: SubgraphVault[];
}

export const fetchVaultByUnderlying = async (tokenAddress: string) => {
  const res: GetVaultByUnderlyingResult = await makeVaultsGqlRequest(
    GET_VAULT_FOR_UNDERLYING,
    { tokenAddress }
  );
  const vault = res.vaults[0];
  return vault;
};
