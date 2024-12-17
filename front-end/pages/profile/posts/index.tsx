import { useState } from 'react';
import AccountPostOverview from "@/components/event/UserPostOverview";
import Header from '@/components/header/header';
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

const Posts: React.FC = () => {
    return (
        <>
            <Header />
            <div className="bg-slate-50 flex w-full h-screen pt-24">
                <div >
                    <h1 className='text-2xl '>Your events</h1>
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

export default Posts;