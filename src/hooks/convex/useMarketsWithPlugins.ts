import { useRari } from "context/RariContext";
import CTokenWithPluginABI from "contracts/abi/CErc20PluginRewardsDelegate.json";
import ConvexERC4626PluginABI from "contracts/abi/ConvexERC4626.json";
import { Contract } from "ethers";
import { Interface } from "ethers/lib/utils";
import { useMemo } from "react";
import { useQuery } from "react-query";

interface CTokensPluginsMap {
  [cToken: string]: string;
}

interface CTokenClaimRewardsMap {
  [cToken: string]: boolean;
}

/*
 * @note returns a list of cTokenAddresses with ClaimRewards Plugins
 * @param cTokenAddresses: string[]
*/
export const useCTokensWithRewardsPlugin = (cTokenAddresses: string[] = []) => {
  const { fuse } = useRari();
  const { provider } = fuse

  const [ICToken, IPlugin] = useMemo(
    () => [
      new Interface(CTokenWithPluginABI),
      new Interface(ConvexERC4626PluginABI),
    ],
    []
  );

  // filters cTokens that have plugins
  const { data: cTokensPluginsMap } = useQuery(
    `CTokens With Plugins from ${cTokenAddresses.join(", ")}`,
    async () => {
      if (!cTokenAddresses.length) return {};
      let cTokensPluginsMap: CTokensPluginsMap = {};

      (
        await Promise.allSettled(
          cTokenAddresses.map((cT) => {
            try {
              return new Contract(cT, ICToken, provider).callStatic.plugin();
            } catch {}
          })
        )
      ).forEach((promiseResult, i) => {
        const { status } = promiseResult;
        if (status === "fulfilled") {
          cTokensPluginsMap[cTokenAddresses[i]] = (
            promiseResult as PromiseFulfilledResult<string>
          ).value;
        }
      });

      return cTokensPluginsMap;
    }
  );

  // filters cTokens that have plugins that have claimRewards
  const { data: cTokenClaimRewardsMap } = useQuery(
    `CTokens With Plugins from ${Object.keys(cTokensPluginsMap ?? {}).join(
      ", "
    )}`,
    async () => {
      if (!cTokensPluginsMap) return {};
      const cTokenAddresses = Object.keys(cTokensPluginsMap);

      let cTokenClaimRewardsMap: CTokenClaimRewardsMap = {};

      (
        await Promise.allSettled(
          Object.keys(cTokenAddresses).map((cT) => {
            try {
              let plugin = new Contract(
                cTokensPluginsMap[cT],
                IPlugin,
                provider
              );
              return plugin.callStatic.claimRewards();
            } catch {}
          })
        )
      ).forEach(({ status }, i) => {
        if (status === "fulfilled")
          cTokenClaimRewardsMap[cTokenAddresses[i]] = true;
      });

      return cTokensPluginsMap;
    }
  );

  return Object.keys(cTokenClaimRewardsMap ?? {});
};

export default useCTokensWithRewardsPlugin;
