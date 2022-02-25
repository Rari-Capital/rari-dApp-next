// import { getChainMetadata } from "esm/utils/networks";
// import { Provider, chain, defaultChains, defaultL2Chains } from "wagmi";
// import { InjectedConnector } from "wagmi/connectors/injected";
// import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
// import { WalletLinkConnector } from "wagmi/connectors/walletLink";

// let chains = defaultChains;

// // Set up connectors
// export const connectors = ({ chainId }: { chainId?: number }) => {
//   const rpcUrl = getChainMetadata(chainId ?? 1).rpcUrl;

//   console.log({ rpcUrl });

//   return [
//     new InjectedConnector({ chains: [...chains, ...defaultL2Chains] }),
//     new WalletConnectConnector({
//       options: {
//         qrcode: true,
//         rpc: rpcUrl,
//       },
//     }),
//     new WalletLinkConnector({
//       options: {
//         appName: "Rari Capital dApp",
//         jsonRpcUrl: rpcUrl,
//       },
//     }),
//   ];
// };
export default {};
