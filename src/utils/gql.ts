// GQL-request
import { request } from "graphql-request";


const SUBGRAPH_V2 = "https://api.studio.thegraph.com/query/853/fuse-zacel/0.2.2"
const SUBGRAPH_V4 = "https://api.studio.thegraph.com/query/853/fuse-zacel/0.4.1"
const SUBGRAPH_V5 = "https://api.studio.thegraph.com/query/853/fuse-zacel/0.5.31"

  
// const FUSE_SUBGRAPH_GQL_ENDPOINT =
//   "https://api.thegraph.com/subgraphs/id/QmZUk988UJSQQtYwTmZobV26FqHZQJscGZMjRR35RnNzMw";

export const makeGqlRequest = async (query: any, vars: any = {}) => {
  try {
    return await request(SUBGRAPH_V4, query, { ...vars });
  } catch (err) {
    console.error(err);
  }
};
