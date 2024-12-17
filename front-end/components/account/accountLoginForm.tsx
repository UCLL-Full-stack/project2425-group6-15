import AccountService from "@/services/accountService";
import React, { useState } from "react";
import { useRouter } from 'next/router';
import authService from "@/services/authService";
import { useTranslation } from "next-i18next";

const AccountLoginForm: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [serverError, setServerError] = useState("");

  const validate = (): boolean => {
    setEmailError("");
    setPasswordError("");
    if (email.trim() === "") {
      setEmailError(t("login.form.email") + " " + t("login.form.required"));
      return false;
    }
    if (password === "") {
      setPasswordError(t("login.form.password") + " " + t("login.form.required"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const AccountLogin = {
      email: email,
      password: password,
    };

    const response = await authService.login(AccountLogin);
    const data = await response.json();
    if (response.status == 200) {
      sessionStorage.setItem("token", data.token)
      router.push('/');
    }
    else {
      setServerError(t("login.errors.invalid_credentials"));
    }

    setEmail("");
    setPassword("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("login.form.email")}</label>
          <input
            title={t("login.form.email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("login.form.password")}</label>
          <input
            title={t("login.form.password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        </div>
        <button
          type="submit"
          className="w-full px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300 mt-4"
        >
          {t("login.form.submit")}
        </button>
        {serverError && (
          <p className="text-red-500 text-sm">{serverError}</p>
        )}
      </form>
    </>
  );
};

export default AccountLoginForm;
