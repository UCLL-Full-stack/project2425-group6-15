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
                <div className='bg-white border border-slate-300 p-4 rounded-lg shadow-lg flex flex-col w-11/12'>
                    <h1 className="text-4xl font-bold text-gray-900">Your Profile!</h1>
                    <div className='w-full h-0.5 bg-slate-300 rounded mb-2'/>
                    <USerProfileOverview/>
                </div>

            </div>
        </>   
    );
};

export default Profile;