import { NextPage } from "next";
import FusePoolCreatePage from "components/pages/Fuse/FusePoolCreatePage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

const FuseCreatePage: NextPage = () => {
  return <FusePoolCreatePage />;
};

export default FuseCreatePage;
