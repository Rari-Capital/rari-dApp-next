import { NextPage } from "next";

// Components
import FusePoolEditPage from "components/pages/Fuse/FusePoolEditPage";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
  };``

const FusePoolEditPageNext: NextPage = () => {
    return (
        <FusePoolEditPage />
    )
}

export default FusePoolEditPageNext
