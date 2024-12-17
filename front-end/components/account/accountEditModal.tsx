import AccountService from "@/services/accountService";
import { useEffect, useState } from "react";
import { Gender, Account } from "@/types";

import unselectmaleimage from "@/images/icons/profile/unselectmale.svg";
import unselectfemaleimage from "@/images/icons/profile/unselectfemale.svg";
import selectfemaleimage from "@/images/icons/profile/selectfemale.svg";
import selectmaleimage from "@/images/icons/profile/selectmale.svg";
import Image from "next/image";
import { useTranslation } from "next-i18next";

interface AccountProfileProps {
    Account: Account;
    onclose(): void;
}

const AccountEditProfile: React.FC<AccountProfileProps> = ({ Account, onclose }) => {
    const { t } = useTranslation();
    const [firstName, setFirstName] = useState(Account.firstName);
    const [lastName, setLastName] = useState(Account.lastName);
    const [email, setEmail] = useState(Account.email);
    const [emailError, setEmailError] = useState("");
    const [phone, setPhone] = useState<number | null>(Account.phoneNumber.number ? Number(Account.phoneNumber.number) : 0);
    const [phoneError, setPhoneError] = useState("");
    const [countryCode, setCountryCode] = useState(Account.phoneNumber.countryCode || "+32");
    const [gender, setGender] = useState<Gender | "">(Account.gender || "");
    const [genderError, setGenderError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [serverError, setServerError] = useState("");

    return (
        <div className="bg-transparent p-4 flex flex-col w-full h-full">
            <div className="w-full border-b-2 border-gray-300">
                <h1 className="text-2xl font-semibold">{t("profile.edit_account_details")}</h1>
                <p className="text-base text-gray-300">{t("profile.manage_profile")}</p>
            </div>
            <div className="w-full grid grid-cols-2 grid-rows-5 gap-x-2 gap-y-3 pt-2">
                <div className="flex flex-col">
                    <label htmlFor="firstName" className="text-base text-slate-600">{t("signup.form.first_name")}</label>
                    <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t("signup.form.first_name")} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="lastName" className="text-base text-slate-600">{t("signup.form.last_name")}</label>
                    <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t("signup.form.last_name")} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                </div>
                <div className="flex flex-col col-span-2">
                    <label htmlFor="" className="text-base text-slate-600">{t("signup.form.gender")}</label>
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
                    <label htmlFor="email" className="text-base text-slate-600">{t("signup.form.email")}</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("signup.form.email")} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                </div>
                <div className="flex flex-col col-span-2">
                    <label htmlFor="phone" className="text-base text-slate-600">{t("signup.form.phone")}</label>
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
                            placeholder={t("signup.form.phone")}
                        />
                    </div>
                </div>
            </div>

            <div className="w-full flex items-center justify-end gap-3">
                <button onClick={() => onclose()} className="px-2 py-0 border border-gray-500 rounded-lg text-gray-500 hover:bg-red-500 hover:bg-opacity-20 hover:border-red-500 hover:text-red-500 text-lg">{t("profile.cancel")}</button>
                <button className="px-2 py-0 border border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white text-lg">{t("profile.save")}</button>
            </div>
        </div>
    );
};

export default AccountEditProfile;
