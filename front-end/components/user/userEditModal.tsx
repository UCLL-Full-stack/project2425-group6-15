import userService from "@/services/userService";
import { useEffect, useState } from "react";
import { Gender, User } from "@/types";

import unselectmaleimage from "@/images/icons/profile/unselectmale.svg";
import unselectfemaleimage from "@/images/icons/profile/unselectfemale.svg";
import selectfemaleimage from "@/images/icons/profile/selectfemale.svg";
import selectmaleimage from "@/images/icons/profile/selectmale.svg";
import Image from "next/image";

interface UserProfileProps {
    user: User;
    isOpen: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, isOpen }) => {
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);
    const [emailError, setEmailError] = useState("");
    const [phone, setPhone] = useState<number | null>(user.phoneNumber.number ? Number(user.phoneNumber.number) : 0);
    const [phoneError, setPhoneError] = useState("");
    const [countryCode, setCountryCode] = useState(user.phoneNumber.countryCode || "+32");
    const [gender, setGender] = useState<Gender | "">(user.gender || "");
    const [genderError, setGenderError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [serverError, setServerError] = useState("");

    if (!isOpen) return null;

    return (
        <div className="bg-white border border-slate-300 p-4 rounded-lg shadow-lg flex flex-col w-9/12">
            <div className="w-full border-b-2 border-gray-300">
                <h1 className="text-2xl font-semibold">Account Details</h1>
                <p className="text-base text-gray-300">manage your profile</p>
            </div>
            <div className="w-full grid grid-cols-2 grid-rows-5 gap-x-2 gap-y-3 pt-2">
                <div className="flex flex-col">
                    <label htmlFor="firstName" className="text-base text-slate-600">First Name</label>
                    <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="lastName" className="text-base text-slate-600">Last Name</label>
                    <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                </div>
                <div className="flex flex-col col-span-2">
                    <label htmlFor="" className="text-base text-slate-600">Sex</label>
                    <div className="w-full grid grid-cols-2">
                        <button
                            className={`p-2 w-full border border-gray-300 rounded-l-lg focus:outline-none text-base flex ${gender === "male" ? "bg-[#7EC7DE]" : ""}`}
                            title="Male"
                            onClick={() => setGender("male")}
                        >
                            {gender === "male" ? <Image src={selectmaleimage} alt="Male" className="h-5" /> : <Image src={unselectmaleimage} alt="Male" className="h-5" />}
                        </button>
                        <button
                            className={`p-2 w-full border border-gray-300 rounded-r-lg focus:outline-none text-base flex ${gender === "female" ? "bg-[#E896C2]" : ""}`}
                            title="Female"
                            onClick={() => setGender("female")}
                        >
                            {gender === "female" ? <Image src={selectfemaleimage} alt="Female" className="h-5" /> : <Image src={unselectfemaleimage} alt="Female" className="h-5" />}
                        </button>
                    </div>
                </div>
                <div className="flex flex-col col-span-2">
                    <label htmlFor="email" className="text-base text-slate-600">Email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                </div>
                <div className="flex flex-col col-span-2">
                    <label htmlFor="phone" className="text-base text-slate-600">Phone Number</label>
                    <div className="flex">
                        <select
                            title="countryCode"
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="p-2 w-fit border border-gray-300 rounded-tl-lg rounded-bl-lg focus:outline-none text-base"
                        >
                            <option value="+32">+32 (BE)</option>
                            <option value="+31">+31 (NL)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+1">+1 (USA)</option>
                        </select>
                        <input
                            type="tel"
                            value={phone ?? ""}
                            onChange={(e) => setPhone(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-tr-lg rounded-br-lg focus:outline-none text-base"
                            placeholder="Enter your phone number"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
