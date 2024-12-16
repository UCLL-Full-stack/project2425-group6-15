import ChangeInterests from "@/components/interest/changeInterests";
import Head from "next/head";
import Router from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

const AddFirstInterests: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("interests.title")} - JoinMe</title>
        <meta charSet="utf-8" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
        <h1 className="text-5xl font-bold text-gray-900">{t("interests.title")}</h1>
        <ChangeInterests onClose={() => Router.push("/")} />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});

export default AddFirstInterests;
