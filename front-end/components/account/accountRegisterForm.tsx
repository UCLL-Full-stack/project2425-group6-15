import React, { useState } from "react";
import { useRouter } from 'next/router';
import authService from "@/services/authService";
import { useTranslation } from "next-i18next";

const AccountRegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();


  const [accountType, setAccountType] = useState<"user" | "organization">("user")

  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState<number | null>(null);
  const [phoneError, setPhoneError] = useState("");
  const [countryCode, setCountryCode] = useState("+32");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const validate = (): boolean => {
    setUserNameError("");
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let correct = true;
    if (userName.trim() === "") {
      setUserNameError(t("signup.form.username") + " " + t("signup.form.required"));
      correct = false;
    }

    if (userName.includes(" ")) {
      setUserNameError(t("signup.form.username") + " " + t("signup.form.no_spaces"));
      correct = false;
    }
    const invalidChars = [",", ";", ":", "!", "?", "#", "$", "%", "^", "&", "*", "(", ")", "[", "]", "{", "}", "<", ">", "/", "\\", "|", "`", "~", "'", '"'];
    if (invalidChars.some(char => userName.includes(char))) {
      setUserNameError(t("signup.form.username") + " " + t("signup.form.no_special_chars"));
      correct = false;
    }

    const namePattern = /^[A-Za-z]+$/;

    if (!namePattern.test(firstName) && accountType === "user") {
      setFirstNameError(t("signup.form.first_name") + " " + t("signup.form.only_letters"));
      correct = false;
    }
    if (!namePattern.test(lastName) && accountType === "user") {
      setLastNameError(t("signup.form.last_name") + " " + t("signup.form.only_letters"));
      correct = false;
    }

    if (firstName.trim() === "" && accountType === "user") {
      setFirstNameError(t("signup.form.first_name") + " " + t("signup.form.required"));
      correct = false;
    }
    if (lastName.trim() === "" && accountType === "user") {
      setLastNameError(t("signup.form.last_name") + " " + t("signup.form.required"));
      correct = false;
    }
    if (email.trim() === "") {
      setEmailError(t("signup.form.email") + " " + t("signup.form.required"));
      correct = false;
    }
    if (phone === null) {
      setPhoneError(t("signup.form.phone") + " " + t("signup.form.required"));
      correct = false;
    }
    if (password === "") {
      setPasswordError(t("signup.form.password") + " " + t("signup.form.required"));
      correct = false;
    }
    if (confirmPassword === "") {
      setConfirmPasswordError(t("signup.form.confirm_password") + " " + t("signup.form.required"));
      correct = false;
    }
    if (password !== confirmPassword && password !== "" && confirmPassword !== "") {
      setConfirmPasswordError(t("signup.form.password_mismatch"));
      setPasswordError(t("signup.form.password_mismatch"));
      correct = false;
    }
    return correct;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    if (accountType === "organization") {
      setFirstName("");
      setLastName("");
    }

    const AccountLogin = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: { countryCode: countryCode, number: (phone ?? 0).toString() },
      password: password,
      type: accountType,
      username: userName,
    };

    const response = await authService.register(AccountLogin);
    const data = await response.json();
    if (response.status == 200) {
      sessionStorage.setItem("token", data.token)
      if (accountType === "organization") {
        router.push('/');
      }
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
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-md space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700">{t("signup.form.username")}</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("signup.form.first_name")}
            title={t("signup.form.first_name")}
          />
          {userNameError && (
            <p className="text-red-500 text-sm">{userNameError}</p>
          )}
        </div>
        {accountType === "user" && (
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
            {firstNameError && (
              <p className="text-red-500 text-sm">{firstNameError}</p>
            )}
          </div>
        )}
        {accountType === "user" && (
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
            {lastNameError && (
              <p className="text-red-500 text-sm">{lastNameError}</p>
            )}
          </div>
        )}
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
          type="button"
          onClick={() => setAccountType(accountType === "user" ? "organization" : "user")}
          className="w-full px-6 py-2 text-blue-500 border-blue-500 rounded border-2 hover:border-blue-600 transition duration-300 mt-4"
        >
          {accountType === "user" ? t("signup.form.register_as_organization") : t("signup.form.register_as_user")}
        </button>
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

export default AccountRegisterForm;
