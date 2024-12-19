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
import UsersAdminTable from "@/components/admin/overviews/uersAdmin";
import EventsAdminTable from "@/components/admin/overviews/eventsAdmin";
import InterestsAdminTable from "@/components/admin/overviews/interestsAdmin";

const Overview = dynamic(() => import("@/components/dashboard/userDashboard"), { ssr: false });

const AdminInterestsOverview: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Sidebar />
      <div className="w-full pl-64 bg-slate-100">
        <InterestsAdminTable />
      </div>

    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});

export default AdminInterestsOverview;