import userService from "@/services/userService";
import { Gender } from "@/types";
import React, { useState } from "react";
import { useRouter } from 'next/router';
import authService from "@/services/authService";
import { useTranslation } from "next-i18next";

const UserRegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState<number | null>(null);
  const [phoneError, setPhoneError] = useState("");
  const [countryCode, setCountryCode] = useState("+32"); // Default country code
  const [gender, setGender] = useState<Gender | "">("");
  const [genderError, setGenderError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const validate = (): boolean => {
    setEmailError("");
    setPhoneError("");
    setGenderError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (firstName.trim() === "") {
      setEmailError(t("signup.form.first_name") + " " + t("signup.form.required"));
      return false;
    }
    if (lastName.trim() === "") {
      setEmailError(t("signup.form.last_name") + " " + t("signup.form.required"));
      return false;
    }
    if (email.trim() === "") {
      setEmailError(t("signup.form.email") + " " + t("signup.form.required"));
      return false;
    }
    if (phone === null) {
      setPhoneError(t("signup.form.phone") + " " + t("signup.form.required"));
      return false;
    }
    if (gender === "") {
      setGenderError(t("signup.form.gender") + " " + t("signup.form.required"));
      return false;
    }
    if (password === "") {
      setPasswordError(t("signup.form.password") + " " + t("signup.form.required"));
      return false;
    }
    if (confirmPassword === "") {
      setConfirmPasswordError(t("signup.form.confirm_password") + " " + t("signup.form.required"));
      return false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(t("signup.form.password_mismatch"));
      setPasswordError(t("signup.form.password_mismatch"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    if (gender !== "male" && gender !== "female") {
      setGenderError(t("signup.form.gender") + " " + t("signup.form.required"));
      return;
    }

    const userLogin = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: { countryCode: countryCode, number: (phone ?? 0).toString() },
      gender: gender,
      password: password,
    };

    const response = await authService.register(userLogin);
    const data = await response.json();
    if (response.status == 200) {
      sessionStorage.setItem("token", data.token)
      router.push('/register/interests');
    }
    else {
      setServerError(t("signup.errors.invalid_credentials"));
    }

    // Reset fields
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone(null);
    setCountryCode("+32");
    setGender("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("signup.form.first_name")}</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("signup.form.first_name")}
            title={t("signup.form.first_name")}
          />
          {firstName.trim() === "" && (
            <p className="text-red-500 text-sm">{t("signup.form.first_name") + " " + t("signup.form.required")}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("signup.form.last_name")}</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={t("signup.form.last_name")}
            placeholder={t("signup.form.last_name")}
          />
          {lastName.trim() === "" && (
            <p className="text-red-500 text-sm">{t("signup.form.last_name") + " " + t("signup.form.required")}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("signup.form.email")}</label>
          <input
            title={t("signup.form.email")}
            placeholder={t("signup.form.email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("signup.form.phone")}</label>
          <div className="flex">
            <select
              title="countryCode"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="p-2 w-fit border border-gray-300 rounded-tl-lg rounded-bl-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border border-gray-300 rounded-tr-lg rounded-br-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("signup.form.phone")}
            />
          </div>
          {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("signup.form.gender")}</label>
          <select
            title={t("signup.form.gender")}
            aria-label={t("signup.form.gender")}
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>{t("signup.form.select_gender")}</option>
            <option value="male">{t("signup.form.male")}</option>
            <option value="female">{t("signup.form.female")}</option>
          </select>
          {genderError && <p className="text-red-500 text-sm">{genderError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("signup.form.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={t("signup.form.password")}
            placeholder={t("signup.form.password")}
          />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("signup.form.confirm_password")}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={t("signup.form.confirm_password")}
            placeholder={t("signup.form.confirm_password")}
          />
          {confirmPasswordError && (
            <p className="text-red-500 text-sm">{confirmPasswordError}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300 mt-4"
        >
          {t("signup.form.submit")}
        </button>
        {serverError && (
          <p className="text-red-500 text-sm">{serverError}</p>
        )}
      </form>
    </>
  );
};

export default UserRegisterForm;
