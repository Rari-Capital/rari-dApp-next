import { NextPage } from "next";
import TurboSafePage from "components/pages/Turbo/TurboSafePage/TurboSafePage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import Head from "next/head";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const Page: NextPage = () => {
  const {
    query: { id },
  } = useRouter();
  return (
    <>
      <Head>
        <title> Safe | Tribe Turbo</title>
        <meta property="twitter:card" content="summary" />
        <meta property="og:title" content={`Safe| Tribe Turbo`} />
        <meta name="twitter:title" content={`Safe | Tribe Turbo`} />
        <meta
          property="og:url"
          content={`https://app.rari.capital/turbo/safe/${id}`}
        />
        <meta property="og:image" content="/static/turbo/turbo2.png" />
        <meta property="twitter:image" content="/static/turbo/turbo2.png" />
        <meta property="og:description" content="Earn costless yield and boost FEI liquidity with Tribe Turbo." />
        <meta property="twitter:description" content="Earn costless yield and boost liquidity with Tribe Turbo." />
      </Head>
      <TurboSafePage />
    </>
  );
};

export default Page;
