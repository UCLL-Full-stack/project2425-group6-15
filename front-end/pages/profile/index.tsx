import { useState } from 'react';
import UserProfile from "@/components/user/userEditModal";
import Header from '@/components/header/header';
import Head from "next/head";
import USerProfileOverview from '@/components/user/profileOvervieuw';

const Profile: React.FC = () => {
    return (
        <>
            <Header />
            <div className="bg-slate-50 flex items-center justify-center w-full h-screen pt-24">
                <USerProfileOverview/>
            </div>
        </>   
    );
};

export default Profile;