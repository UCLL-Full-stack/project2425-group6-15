import { useState } from 'react';
import UserProfile from "@/components/user/userEditModal";
import Header from '@/components/header/header';
import Head from "next/head";
import USerProfileOverview from '@/components/user/profileOvervieuw';

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

const Profile: React.FC = () => {
    return (
        <>
            <Header />
            <div className="bg-slate-50 flex items-center justify-center w-full h-screen pt-24">
                <USerProfileOverview />
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
});

export default Profile;