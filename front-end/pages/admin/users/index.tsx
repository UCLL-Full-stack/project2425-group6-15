import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/header/header";
import Headerplain from "@/components/header/headerplain";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import Image from "next/image";

import friendsImg from "@/images/crl/friends.png";
import communitiesImg from "@/images/crl/communities.png";
import momentsImg from "@/images/crl/moments.png";
import dynamic from "next/dynamic";
import Sidebar from "@/components/admin/sidebar";

const Overview = dynamic(() => import("@/components/dashboard/userDashboard"), { ssr: false });

const AdminUsersOverview: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <>
      <Sidebar />


    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});

export default AdminUsersOverview;