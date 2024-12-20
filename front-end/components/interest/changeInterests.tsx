import { Interest } from "@/types";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import AccountService from "@/services/accountService";
import interestService from "@/services/interestService";
import { useTranslation } from "next-i18next";
interface ChangeInterestsProps {
    onClose(): void;
}

const ChangeInterests: React.FC<ChangeInterestsProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [interests, setInterests] = useState<Interest[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);

    const fetchAccount = async (): Promise<void> => {
        try {
            const response = await AccountService.findCurrentAccount();
            if (!response.ok) {
                let error = await response.json();
                router.push({
                    pathname: router.pathname,
                    query: { errorMessage: String(error.message) }
                });
                return;
            }
            const Account = await response.json();
            setSelectedInterests(Account.interests);
        } catch (error) {
            router.push({
                pathname: router.pathname,
                query: { errorMessage: String(error) }
            });
        }
    }

    useEffect(() => {
        loadInterests();
        fetchAccount();
    }, []);

    const loadInterests = async () => {
        try {
            const interests = await interestService.findAll();
            if (!interests.ok) {
                const error = await interests.json();
                router.push({
                    pathname: router.pathname,
                    query: { errorMessage: String(error.message) }
                });
                return;
            }
            const interestsJson = await interests.json();
            setInterests(interestsJson);
        } catch (error) {
            router.push({
                pathname: router.pathname,
                query: { errorMessage: String(error) }
            });
        }
    };

    const saveInterests = async () => {
        if (selectedInterests.length < 5) {
            router.push({
                pathname: router.pathname,
                query: { errorMessage: String(t("interests.select_minimum")) }
            });
            return;
        }
        try {
            let interestnames = selectedInterests.map((interest) => { return interest.name });
            const response = await AccountService.addInterestToAccount(interestnames);
            if (!response.ok) {
                const error = await response.json();
                router.push({
                    pathname: router.pathname,
                    query: { errorMessage: String(error.message) }
                });
                return;
            }
            onClose();
        } catch (error) {
            router.push({
                pathname: router.pathname,
                query: { errorMessage: String(error) }
            });
        }
    }

    return (
        <>
            <div className="w-full bg-white flex flex-col items-center py-5 px-2">
                <div title="selected interests" className="w-full h-fit flex flex-row flex-wrap justify-center">
                    {selectedInterests.map((interest) => (
                        <div
                            key={interest.id}
                            className="bg-white border border-blue-500 text-blue-500 rounded-full px-3 py-1 m-1 hover:border-red-500 hover:text-red-500 cursor-pointer"
                            onClick={() => {
                                setSelectedInterests(selectedInterests.filter(selected => selected.id !== interest.id));
                            }}
                        >
                            {interest.name}
                        </div>
                    ))}
                </div>
                <input type="text" id="interestInput" placeholder="Search here..." className="w-10/12 bg-white border border-gray-300 text-gray-500 rounded-full px-3 py-1 m-1" />
                <div title="interests" className="w-full h-fit flex flex-row flex-wrap">
                    {interests.filter(interest => !selectedInterests.some(selected => selected.id === interest.id)).map((interest) => (
                        <div key={interest.id} className="bg-white border border-gray-300 text-gray-500 rounded-full px-3 py-1 m-1 cursor-pointer" onClick={() => setSelectedInterests([...selectedInterests, interest])}>
                            {interest.name}
                        </div>
                    ))}
                </div>
                <button className={`self-end justify-self-end rounded-full w-32 h-8 border-gray-600 border ${selectedInterests.length > 4 ? 'hover:bg-slate-600 hover:text-white' : ''}`} onClick={saveInterests}>
                    {selectedInterests.length < 5 && `${selectedInterests.length} / 5`}
                    {selectedInterests.length > 4 && "Save"}
                </button>
            </div>
        </>
    );
};

export default ChangeInterests;
