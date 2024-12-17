import AccountService from "@/services/accountService";
import { useEffect, useState } from "react";
import { AccountSummary, PublicAccount } from "@/types";

import maleimage from "@/images/icons/profile/unselectmale.svg";
import femaleimage from "@/images/icons/profile/unselectfemale.svg";

import Image from "next/image";


import { useTranslation } from "next-i18next";
import AccountEditProfile from "@/components/account/accountEditModal";
import ChangeInterests from "../interest/changeInterests";
import AccountChangePassword from "@/components/account/accountChangePassword";

const AccountProfileOverview: React.FC = () => {
    const { t } = useTranslation();
    const [Account, setAccount] = useState<PublicAccount | null>(null);

    const [editProfileIsOpen, setEditProfileIsOpen] = useState<Boolean>(false);
    const [changepasswordIsOpen, setChangepasswordIsOpen] = useState<Boolean>(false);
    const [editInterestsIsOpen, setEditInterestsIsOpen] = useState<Boolean>(false);

    if (editProfileIsOpen || editInterestsIsOpen || editInterestsIsOpen) {
        document.body.style.overflow = "hidden"
    }
    const fetchAccount = async () => {
        const response = await AccountService.findCurrentAccount();
        const data = await response.json();
        setAccount(data);
    };

    useEffect(() => {
        if (!editProfileIsOpen && !changepasswordIsOpen && !editInterestsIsOpen) {
            fetchAccount();
        }
    }, [editProfileIsOpen, changepasswordIsOpen, editInterestsIsOpen]);

    useEffect(() => {
        fetchAccount();
    }, []);
    if (!Account) {
        return (<div className="w-full grid grid-cols-2 gap-x-2 gap-y-4 relative" />)
    }
    return (
        <div className='bg-white border border-slate-300 p-4 rounded-lg shadow-lg flex flex-col w-11/12 gap-6'>
            <div className="w-full flex flex-col">
                <h1 className="text-4xl font-bold text-gray-900">{t("profile.title")}</h1>
                <div className='w-full h-0.5 bg-slate-300 rounded' />
            </div>

            <div className="w-full grid grid-cols-2 gap-x-2 gap-y-4 relative">
                <button className="absolute right-1 px-2 py-1 border-gray-200 rounded-lg border text-sm text-slate-500"
                    onClick={() => { setEditProfileIsOpen(!editProfileIsOpen) }}
                >
                    {t("profile.edit")}
                </button>
                <div className="flex flex-col">
                    <p className="text-base text-gray-300">{t("profile.full_name")}</p>
                    <p className="text-xl font-semibold">{Account?.firstName} {Account?.lastName} </p>
                </div>
                <div className="flex flex-col">
                    <p className="text-base text-gray-300">{t("profile.gender")}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-base text-gray-300">{t("profile.email")}</p>
                    <p className="text-xl font-semibold">{Account?.email}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-base text-gray-300">{t("profile.phone")}</p>
                    <p className="text-xl font-semibold">{Account?.phoneNumber.countryCode} {Account?.phoneNumber.number}</p>
                </div>
                <div className="flex flex-col items-start">
                    <p className="text-base text-gray-300">{t("profile.password")}</p>
                    <button
                        onClick={() => setChangepasswordIsOpen(!changepasswordIsOpen)}
                        className="text-md font-semibold text-blue-500 px-2 py-1 border border-blue-500 rounded-lg">
                        {t("profile.change_password")}
                    </button>
                </div>
            </div>
            {Account.type === "user" && (
                <div className="w-full grid grid-cols-[max-content_1fr] items-center gap-2">
                    <p className="text-xl font-semibold text-slate-500 pb-1">{t("profile.interests")}</p>
                    <div className="w-full h-0.5 rounded-full bg-slate-200" />
                </div>)}

            <div className="w-full grid gap-y-4 pr-6 relative">
                {Account.type === "user" && (
                    <button className="absolute top-0 right-1 px-2 py-1 border-gray-200 rounded-lg border text-sm text-slate-500"
                        onClick={() => { setEditInterestsIsOpen(!editProfileIsOpen) }}
                    >
                        {t("profile.edit")}
                    </button>)}

                <div className="flex flex-wrap gap-2 items-center w-full px-6">
                    {Account?.interests.map((interest, index) => (
                        <div key={index} className="bg-slate-200 rounded-lg px-2 py-1">
                            <p className="text-sm font-semibold">{interest.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {editProfileIsOpen && (
                <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black bg-opacity-45 flex items-center justify-center">
                    <div className="w-3/4 bg-white border border-gray-300 shadow-lg rounded-lg">

                        <AccountEditProfile Account={Account} onclose={() => setEditProfileIsOpen(false)} />
                    </div>
                </div>
            )}
            {editInterestsIsOpen && Account.type === "user" && (
                <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black bg-opacity-45 flex items-center justify-center">
                    <div className="w-3/4 bg-white border border-gray-300 shadow-lg rounded-lg p-2">
                        <ChangeInterests onClose={() => setEditInterestsIsOpen(false)} />
                    </div>
                </div>
            )}

            {changepasswordIsOpen && (
                <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black bg-opacity-45 flex items-center justify-center">
                    <div className="w-3/4 bg-white border border-gray-300 shadow-lg rounded-lg p-2">
                        <div className="w-full flex items-center justify-end gap-3">
                            < AccountChangePassword onClose={() => setChangepasswordIsOpen(false)} />
                        </div>
                    </div>
                </div>
            )}


        </div>

    );

};

export default AccountProfileOverview;