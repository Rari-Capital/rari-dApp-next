import {
  MenuItemInterface,
  MenuItemType,
} from "components/shared/Header2/HeaderLink";
import { ChainID } from "esm/utils/networks";

export const PRODUCTS_DROPDOWN_ITEMS: MenuItemInterface[] = [
  { type: MenuItemType.LINK, link: { name: "Fuse", route: "/fuse" } },
  // { type: MenuItemType.LINK, link: { name: "Vaults", route: "/vaults" } },
  {
    type: MenuItemType.LINK,
    link: { name: "Legacy Portal", route: "https://v2.rari.capital" },
  },
  {
    type: MenuItemType.MENUGROUP,
    title: "Vaults",
    links: [
      { name: "DAI", route: "https://v2.rari.capital/pools/dai" },
      { name: "USDC", route: "https://v2.rari.capital/pools/usdc" },
    ],
  },
];

export const GOVERNANCE_DROPDOWN_ITEMS: MenuItemInterface[] = [
  {
    type: MenuItemType.LINK,
    link: { name: "Snapshot", route: "https://vote.rari.capital/" },
  },
  {
    type: MenuItemType.LINK,
    link: { name: "Forums", route: "https://forums.rari.capital/" },
  },
];

export const UTILS_DROPDOWN_ITEMS: MenuItemInterface[] = [
  // {
  //   type: MenuItemType.LINK,
  //   link: { name: "Positions", route: "/positions" },
  // },
  {
    type: MenuItemType.LINK,
    link: { name: "Liquidations", route: "/fuse/liquidations" },
  },
  {
    type: MenuItemType.LINK,
    link: { name: "Metrics (Mainnet)", route: "https://rari.grafana.net/goto/61kctV_Gk" },
  },
  {
    type: MenuItemType.LINK,
    link: { name: "Metrics (Arbitrum)", route: "https://metrics.rari.capital/d/BOdF7Hbnk/fuse-overview-arbitrum?orgId=1&refresh=5m&from=now-5m&to=now" },
  },
  {
    type: MenuItemType.LINK,
    link: {
      name: "Bridge Assets to Arbitrum",
      route: "https://xpollinate.io/",
    },
  },
];

export const UTILS_DROPDOWN_ITEMS_ARBITRUM: MenuItemInterface[] = [
  // {
  //   type: MenuItemType.LINK,
  //   link: { name: "Positions", route: "/positions" },
  // },
  {
    type: MenuItemType.LINK,
    link: { name: "Liquidations", route: "/fuse/liquidations" },
  },
  {
    type: MenuItemType.LINK,
    link: { name: "Metrics", route: "https://metrics.rari.capital/d/BOdF7Hbnk/fuse-overview-arbitrum?orgId=1&refresh=5m&from=now-5m&to=now" },
  },
  {
    type: MenuItemType.LINK,
    link: {
      name: "Bridge Assets to Arbitrum",
      route: "https://xpollinate.io/",
    },
  },
];


export const UtilLinks = (chainId: number) => {
  return chainId === ChainID.ETHEREUM ? UTILS_DROPDOWN_ITEMS : UTILS_DROPDOWN_ITEMS_ARBITRUM
}