import { useState } from 'react';
import UserProfile from "@/components/user/userEditModal";
import ChangeInterests from "@/components/interest/changeInterests"; // Fix import
import Header from '@/components/header/header';
import Head from "next/head";

const Profile: React.FC = () => {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
                <h1 className="text-5xl font-bold text-gray-900">Your interests!</h1>
                <ChangeInterests />
            </div>
        </>   
    );
};

export default Profile;