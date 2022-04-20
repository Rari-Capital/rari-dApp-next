import { NextPage } from "next";
import TurboSafePage from "components/pages/Turbo/TurboSafePage/TurboSafePage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import Head from "next/head";
import { chooseBestWeb3Provider } from "utils/web3Providers";
import { createTurboSafe } from "lib/turbo/utils/turboContracts";
import { getSafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import { fetchTokenData } from "hooks/useTokenData";

export async function getStaticProps({
  locale,
  params,
}: {
  locale: string;
  params: any;
}) {
  const { id } = params;
  const provider = chooseBestWeb3Provider();
  const turboSafe = createTurboSafe(provider, id);
  const collateral = await turboSafe.callStatic.asset();
  const { symbol } = await fetchTokenData(collateral);

  return {
    props: {
      ...(await serverSideTranslations(locale)),
      safeId: id,
      symbol,
    },
  };
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const Page: NextPage<{
  safeId: string;
  symbol: string;
}> = ({ safeId, symbol }) => {
  return (
    <>
      <Head>
        <title> Safe | Tribe Turbo</title>
        <meta property="twitter:card" content="summary" />
        <meta property="og:title" content={`${symbol} Safe | Tribe Turbo`} />
        <meta name="twitter:title" content={`${symbol} Safe | Tribe Turbo`} />
        <meta
          property="og:url"
          content={`https://app.rari.capital/turbo/safe/${safeId}`}
        />
        <meta property="og:image" content="/static/turbo/turbo2.png" />
        <meta property="twitter:image" content="/static/turbo/turbo2.png" />
        <meta
          property="og:description"
          content="Earn costless yield and boost FEI liquidity with Tribe Turbo."
        />
        <meta
          property="twitter:description"
          content="Earn costless yield and boost liquidity with Tribe Turbo."
        />
      </Head>
      <TurboSafePage />
    </>
  );
};

export default Page;
