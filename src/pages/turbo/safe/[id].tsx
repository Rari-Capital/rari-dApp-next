import { NextPage } from "next";
import TurboSafePage from "components/pages/Turbo/TurboSafePage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

const Page: NextPage = () => {
  return <TurboSafePage />;
};

export default Page;
