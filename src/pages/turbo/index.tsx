import { NextPage } from "next";
import TurboIndexPage from "components/pages/Turbo/TurboIndexPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

const Page: NextPage = () => {
  return <TurboIndexPage />;
};

export default Page;
