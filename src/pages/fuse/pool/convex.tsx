import { NextPage } from "next";
import FuseConvexPage from "components/pages/Fuse/ConvexPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

const Page: NextPage = () => {
  return <FuseConvexPage />;
};

export default Page;
