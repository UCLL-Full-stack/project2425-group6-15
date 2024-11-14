import { useState } from 'react';
import UserProfile from "@/components/user/userProfile";
import Header from '@/components/header';
import Head from "next/head";


const Profile: React.FC = () => {
    return (
        <>
            <Head>
                <title>Profile</title>
                <meta charSet="utf-8" />
            </Head>
            <Header />

        <UserProfile />
       </>   
    );
};

export default Profile;