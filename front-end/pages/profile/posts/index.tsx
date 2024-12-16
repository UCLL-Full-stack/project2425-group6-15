import { useState } from 'react';
import UserProfile from "@/components/user/userEditModal";
import UserPostOverview from "@/components/posts/UserPostOverview";
import Header from '@/components/header/header';
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

const Profile: React.FC = () => {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
                <h1 className="text-5xl font-bold text-gray-900">Your interests!</h1>
                <UserPostOverview />
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