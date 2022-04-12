// @ts-nocheck
import { NowRequest, NowResponse } from "@vercel/node";
export default async (request: NowRequest, response: NowResponse) => {
  // const { address, poolID } = request.query as { [key: string]: string };
  response.setHeader("Access-Control-Allow-Origin", "*");
  return response.status(503).send("RSS api route inactive.")
};
