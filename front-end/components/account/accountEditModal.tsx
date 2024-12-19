import AccountService from "@/services/accountService";
import { useEffect, useState } from "react";

import unselectmaleimage from "@/images/icons/profile/unselectmale.svg";
import unselectfemaleimage from "@/images/icons/profile/unselectfemale.svg";
import selectfemaleimage from "@/images/icons/profile/selectfemale.svg";
import selectmaleimage from "@/images/icons/profile/selectmale.svg";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { AccountInput, AccountSummary, PublicAccount } from "@/types";
import { set } from "date-fns";
import { tr } from "date-fns/locale";

interface AccountProfileProps {
    Account: PublicAccount;
    onclose(): void;
}

const AccountEditProfile: React.FC<AccountProfileProps> = ({ Account, onclose }) => {
    const { t } = useTranslation();
    const [username, setUsername] = useState(Account.username);
    const [usernameError, setUsernameError] = useState("");
    const [firstName, setFirstName] = useState(Account.firstName);
    const [firstNameError, setFirstNameError] = useState("");
    const [lastName, setLastName] = useState(Account.lastName);
    const [lastNameError, setLastNameError] = useState("");
    const [email, setEmail] = useState(Account.email);
    const [emailError, setEmailError] = useState("");
    const [phone, setPhone] = useState<number | null>(Account.phoneNumber.number ? Number(Account.phoneNumber.number) : 0);
    const [phoneError, setPhoneError] = useState("");
    const [countryCode, setCountryCode] = useState(Account.phoneNumber.countryCode || "+32");
    const [serverError, setServerError] = useState("");

    const validate = () => {
        let valid = true;
        const usernameRegex = /^[a-zA-Z0-9@.]+$/;
        const nameRegex = /^[a-zA-Z]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        setUsernameError("");
        setFirstNameError("");
        setLastNameError("");
        setEmailError("");
        setPhoneError("");
        setServerError("");


        if (!usernameRegex.test(username)) {
            setUsernameError(t("signup.form.username") + " " + t("signup.form.no_special_chars"));
            valid = false;
        }
        if (username.includes(" ")) {
            setUsernameError(t("signup.form.username") + " " + t("signup.form.no_spaces"));
            valid = false;
        }
        if (username.trim() === "") {
            setUsernameError(t("signup.form.username") + " " + t("signup.form.required"));
            valid = false;
        }



        if (!nameRegex.test(firstName)) {
            setFirstNameError(t("signup.form.first_name") + " " + t("signup.form.only_letters"));
            valid = false;
        }
        if (firstName.trim() === "") {
            setFirstNameError(t("signup.form.first_name") + " " + t("signup.form.required"));
            valid = false;
        }


        if (!nameRegex.test(lastName)) {
            setLastNameError(t("signup.form.last_name") + " " + t("signup.form.only_letters"));
            valid = false;
        }
        if (lastName.trim() === "") {
            setLastNameError(t("signup.form.last_name") + " " + t("signup.form.required"));
            valid = false;
        }

        if (!emailRegex.test(email)) {
            setEmailError(t("signup.form.invalid_email"));
            valid = false;
        }
        if (email.trim() === "") {
            setEmailError(t("signup.form.email") + " " + t("signup.form.required"));
            valid = false;
        }
        if (!phone || phone.toString().length < 9) {
            setPhoneError(t("signup.form.phone") + " " + t("signup.form.required"));
            valid = false;
        }
        return valid;
    };
    const handleSave = async () => {
        if (!validate()) {
            return;
        }
        const accountInput: AccountInput = {
            username,
            firstName,
            lastName,
            email,
            phoneNumber: {
                number: phone?.toString() || "",
                countryCode,
            },
        };
        try {
            const response = await AccountService.updateAccount(accountInput);
            if (response.ok) {
                onclose();
            } else {
                const data = await response.json();
                setServerError(data.message);
            }
        } catch (error) {
            if (error instanceof Error) {
                setServerError(error.message);
            } else {
                setServerError(String(error));
            }
        }
    };
    return (
        <div className="bg-transparent p-4 flex flex-col w-full h-full">
            <div className="w-full border-b-2 border-gray-300">
                <h1 className="text-2xl font-semibold">{t("profile.edit_account_details")}</h1>
                <p className="text-base text-gray-300">{t("profile.manage_profile")}</p>
            </div>
            <div className="w-full grid grid-cols-2 grid-rows-5 gap-x-2 gap-y-3 pt-2">
                <div className="flex flex-col col-span-2">
                    <label htmlFor="userName" className="text-base text-slate-600">{t("signup.form.username")}</label>
                    <input id="userName" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t("signup.form.username")} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                    <p className="text-red-500 text-lg">{usernameError}</p>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="firstName" className="text-base text-slate-600">{t("signup.form.first_name")}</label>
                    <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t("signup.form.first_name")} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                    <p className="text-red-500 text-lg">{firstNameError}</p>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="lastName" className="text-base text-slate-600">{t("signup.form.last_name")}</label>
                    <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t("signup.form.last_name")} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                    <p className="text-red-500 text-lg">{lastNameError}</p>
                </div>
                <div className="flex flex-col col-span-2">
                    <label htmlFor="email" className="text-base text-slate-600">{t("signup.form.email")}</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("signup.form.email")} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-base" />
                    <p className="text-red-500 text-lg">{emailError}</p>
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
                    <p className="text-red-500 text-lg">{phoneError}</p>
                </div>
            </div>
            <p className="text-red-500 text-lg">{serverError}</p>

            <div className="w-full flex items-center justify-end gap-3">
                <button onClick={() => onclose()} className="px-2 py-0 border border-gray-500 rounded-lg text-gray-500 hover:bg-red-500 hover:bg-opacity-20 hover:border-red-500 hover:text-red-500 text-lg">{t("profile.cancel")}</button>
                <button onClick={() => handleSave()} className="px-2 py-0 border border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white text-lg">{t("profile.save")}</button>
            </div>
        </div>
    );
};

export default AccountEditProfile;
