import UserLoginForm from "@/components/user/userLoginForm";
import LoginUsersTable from "@/components/login/loginUsersTable";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";



const Login: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
        <div className="mb-8">
        </div>

        <h1 className="text-5xl font-bold text-gray-900">{t("login.title")}</h1>

        <UserLoginForm />
        <LoginUsersTable />
        <div className="mt-4">
          <Link href="/register">
            <span className="text-blue-500 hover:underline cursor-pointer">
              {t("login.form.signup")}
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

export default Login;
