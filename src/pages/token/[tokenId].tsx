import { NextPage } from "next";

// Components
import TokenDetails from "components/pages/TokenDetails";

// Constants
import { ETH_TOKEN_DATA, fetchTokenData, TokenData } from "hooks/useTokenData";

// Util
import { utils } from "ethers";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Spinner, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import { Column } from "lib/chakraUtils";

const tokenDataFetcher = async (
  tokenAddress: string
): Promise<TokenData | undefined> => {
  console.log({ tokenAddress });
  if (!tokenAddress) return undefined;
  const token: TokenData = await fetchTokenData(tokenAddress);
  return token;
};

const TokenDetailsPage: NextPage<{ token: TokenData }> = () => {
  const router = useRouter();
  const [tokenAddress, setTokenAddress] = useState<string>("");

  useEffect(() => {
    const tokenId = (router.query.tokenId as string)

    try {
      const tokenAddress = ["ETH", ETH_TOKEN_DATA.address].includes(tokenId)
        ? ETH_TOKEN_DATA.address
        : utils.getAddress(tokenId);
      setTokenAddress(tokenAddress);
    } catch (err) {
      console.error(err);
    }
  }, [router.query]);

  const { data, error } = useSWR(tokenAddress, tokenDataFetcher);

  console.log({ data, error });

  if (!data)
    return (
      <Column
        mainAxisAlignment="center"
        crossAxisAlignment="center"
        w="100%"
        h="100%"
      >
        <Spinner />;
      </Column>
    );

  if (error)
    return (
      <Column
        mainAxisAlignment="center"
        crossAxisAlignment="center"
        w="100%"
        h="100%"
      >
        <Heading color="white">Error loading data...</Heading>
      </Column>
    );

  console.log({ error });

  return <TokenDetails token={data} />;
};

export default TokenDetailsPage;
