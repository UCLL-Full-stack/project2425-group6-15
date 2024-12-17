import AccountRegisterForm from "@/components/account/accountRegisterForm";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

const Register: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("signup.title")} - JoinMe</title>
        <meta charSet="utf-8" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
        <div className="mb-8">
        </div>

        <h1 className="text-5xl font-bold text-gray-900">{t("signup.title")}</h1>

        <AccountRegisterForm />

        <div className="mt-4">
          <Link href="/login">
            <span className="text-blue-500 hover:underline cursor-pointer">
              {t("signup.form.login")}
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});

export default Register;
