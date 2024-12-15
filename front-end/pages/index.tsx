import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/header/header";
import Headerplain from "@/components/header/headerplain";
import PostOverview from "@/components/dashboard/postOverview";
import postService from "@/services/postService";
import { Post } from "@/types/index";
import { LatLngExpression } from "leaflet";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import Image from "next/image";

import friendsImg from "@/images/crl/friends.png";
import communitiesImg from "@/images/crl/communities.png";
import momentsImg from "@/images/crl/moments.png";

const Home: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  if (isLoggedIn) {
    return (
      <>
        <Header />
        <PostOverview />
      </>
    );
  }
  return (
    <>
      <Headerplain />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-blue-200 to-white text-gray-800 pt-24 pb-16">
        <h1 className="text-6xl font-extrabold text-gray-900">JoinMe</h1>
        <p className="mt-4 text-xl text-center max-w-2xl text-gray-700">
          {t("home.description")}
        </p>
        <div className="mt-8 flex space-x-4">
          <Link href="/register" legacyBehavior>
            <a className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
              {t("home.buttons.action")}
            </a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full text-lg font-semibold hover:bg-gray-300 transition duration-300">
              {t("home.buttons.info")}
            </a>
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-full aspect-[6/5] object-cover rounded-t-lg relative">
              <Image src={friendsImg} alt="Friends" className="w-full bottom-0 object-cover rounded-t-lg absolute" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">{t("home.cards.friends.title")}</h2>
            <p className="mt-2 text-gray-700">{t("home.cards.friends.description")}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-full aspect-[6/5] object-cover rounded-t-lg relative">
              <Image src={communitiesImg} alt="Communities" className="w-full bottom-0 object-cover rounded-t-lg absolute" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">{t("home.cards.communities.title")}</h2>
            <p className="mt-2 text-gray-700">{t("home.cards.communities.description")}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-full aspect-[6/5] object-cover rounded-t-lg relative">
              <Image src={momentsImg} alt="Moments" className="w-full bottom-0 object-cover rounded-t-lg absolute" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">{t("home.cards.moments.title")}</h2>
            <p className="mt-2 text-gray-700">{t("home.cards.moments.description")}</p>
          </div>
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

export default Home;