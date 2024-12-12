import userService from "@/services/userService";
import { useEffect, useState } from "react";
import { Gender, User } from "@/types";

import maleimage from "@/images/icons/profile/unselectmale.svg";
import femaleimage from "@/images/icons/profile/unselectfemale.svg";

import Image from "next/image";

import userEditModal from "./userEditModal";

const USerProfileOverview: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await userService.findCurrentUser();
            const data = await response.json();
            setUser(data);
        };
        fetchUser();
    }, []);

    return ( 
        <div className="w-full grid grid-cols-2 gap-x-2 gap-y-4 relative">
            <button className="absolute right-1 px-2 py-1 border-gray-200 rounded-lg border text-sm text-slate-500"
            onClick={() => {}}
            >
                Edit
            </button>
            <div className="flex flex-col">
                <p className="text-base text-gray-300">Full name</p>
                <p className="text-xl font-semibold">{user?.firstName} {user?.lastName} </p>
            </div>
            <div className="flex flex-col">
                <p className="text-base text-gray-300">sex/Gender</p>
                <p className="text-xl font-semibold flex  gap-2 items-center">
                    {
                        user?.gender === "male" ? <Image src={maleimage.src} alt="Male profile icon" width={20} height={20}/> : <Image src={femaleimage.src} alt="Female profile icon" width={20} height={20}/>
                    }
                    {user?.gender}
                </p>
            </div>
            <div className="flex flex-col">
                <p className="text-base text-gray-300">Email</p>
                <p className="text-xl font-semibold">{user?.email}</p>
            </div>
            <div className="flex flex-col">
                <p className="text-base text-gray-300">Phone</p>
                <p className="text-xl font-semibold">{user?.phoneNumber.countryCode} {user?.phoneNumber.number}</p>
            </div>
        </div>
    );

};

export default USerProfileOverview;