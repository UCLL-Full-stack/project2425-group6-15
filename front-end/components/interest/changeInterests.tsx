import { Gender, Interest } from "@/types";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import userService from "@/services/userService";
import interestService from "@/services/interestService";
import dynamic from 'next/dynamic';
import postService from "@/services/postService";
import { Post } from "@/types/index";
import Sidebar from "@/components/dashboard/postOverview";
import { LatLngExpression } from "leaflet";

const ChangeInterests: React.FC = () => {
    const router = useRouter();
    const [interests, setInterests] = useState<Interest[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);

    const fetchuser = async (): Promise<void> => {
        const response = await userService.findCurrentUser();
        if (!response.ok) {
            console.error("Failed to fetch user");
            return;
        }
        const user = await response.json();
        setSelectedInterests(user.interests);
    }

    useEffect(() => {
        loadInterests();
        fetchuser();
    }, []);

    const loadInterests = async () => {
        const interests = await interestService.findAll();
        if (!interests.ok) {
        console.error("Failed to fetch interests");
        return;
        }
        const interestsJson = await interests.json();
        setInterests(interestsJson);
    };
    
    const saveInterests = async () => {
        if (selectedInterests.length < 5) {
            alert("Please select at least 5 interests");
            return; 
        }
        let interestnames = selectedInterests.map((interest) => { return interest.name });
        const response = await userService.addInterestToUser(interestnames);
        if (!response.ok) {
            console.error("Failed to update interests");
            return;
        }
        router.push("/");
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
