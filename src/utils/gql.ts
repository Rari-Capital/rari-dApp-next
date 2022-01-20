// GQL-request
import { ChainID } from "esm/utils/networks";
import { request } from "graphql-request";

// FUSE
const SUBGRAPH_V2 =
  "https://api.studio.thegraph.com/query/853/fuse-zacel/0.2.2";
const SUBGRAPH_V4 =
  "https://api.studio.thegraph.com/query/853/fuse-zacel/0.4.1";
const SUBGRAPH_V5 =
  "https://api.studio.thegraph.com/query/853/fuse-zacel/0.5.91";

const FUSE_SUBGRAPHS: {
  [chainId: number]: string;
} = {
  [ChainID.ETHEREUM]:
    "https://api.studio.thegraph.com/query/853/fuse-zacel/0.5.91",
  [ChainID.ARBITRUM]:
    "https://api.thegraph.com/subgraphs/name/sharad-s/fuse-arbitrum",
};

// VAULTS
const VAULTS_SUBGRAPH =
  "https://api.thegraph.com/subgraphs/name/sharad-s/vaultsv0";

// const FUSE_SUBGRAPH_GQL_ENDPOINT =
//   "https://api.thegraph.com/subgraphs/id/QmZUk988UJSQQtYwTmZobV26FqHZQJscGZMjRR35RnNzMw";

export const makeGqlRequest = async (
  query: any,
  vars: any = {},
  chainId: ChainID = 1
) => {
  try {
    let subgraphURL =
      FUSE_SUBGRAPHS[chainId] ?? FUSE_SUBGRAPHS[ChainID.ETHEREUM];
    return await request(subgraphURL, query, { ...vars });
  } catch (err) {
    console.error(err);
  }
};

export const makeVaultsGqlRequest = async (query: any, vars: any = {}) => {
  try {
    return await request(VAULTS_SUBGRAPH, query, { ...vars });
  } catch (err) {
    console.error(err);
  }
};
