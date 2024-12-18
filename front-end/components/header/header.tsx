import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import jwt from 'jsonwebtoken';
import dynamic from 'next/dynamic';
import unselectedLogout from "@/images/icons/header/unselectLogout.svg";
import selectedLogout from "@/images/icons/header/selectLogout.svg";
import interestIcon from "@/images/icons/header/interests.svg"
import postIcon from "@/images/icons/header/posts.svg"
import LanguageSide from "../language/Language_side";
import { useTranslation } from "next-i18next";

const CreateNewPostPopup = dynamic(() => import("../event/createNewEventPopup"), { ssr: false });

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState("light");
  const [fullname, setFullname] = useState<String>("");
  const [email, setEmail] = useState<String>("");
  const [CreateNewPostPopupOpen, setCreateNewPostPopupOpen] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decodedToken: any = jwt.decode(token);
      console.log(decodedToken);
      setFullname(decodedToken.fullname);
      setEmail(decodedToken.email);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const L = require('leaflet');
      // ...initialize Leaflet map or other Leaflet-related code...
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    if (accountMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountMenuOpen]);

  const logOut = () => {
    sessionStorage.removeItem("token");
    if (Router.pathname === "/") {
      Router.reload();
    } else {
      Router.push("/");
    }

  };



  return (
    <header className="fixed z-40 left-0 top-0 bg-white p-2 w-full h-30 font-sans grid grid-cols-[max-content,1fr,max-content,max-content,max-content] grid-rows-1 gap-x-2">
      <Link href={"/"} className="text-3xl w-fit font- font-normal text-blue-950"><strong className="font-bold">Join</strong>Me</Link>
      <input type="search" className="outline-none border border-gray-300 rounded-full px-4 max-w-xl" placeholder={t("header.search_placeholder")} />
      <button onClick={() => setCreateNewPostPopupOpen(true)} className="text-blue-600 border-2 border-blue-600 rounded-full px-2 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white">{t("header.create_meetup")}</button>
      <button onClick={() => setAccountMenuOpen(true)} className="h-full bg-blue-200 aspect-square rounded-full" title={t("header.profile")}></button>
      {accountMenuOpen && (
        <div ref={accountMenuRef}>
          <div className="absolute right-2 mt-2 w-72 p-3 bg-white border border-gray-300 rounded-md shadow-lg flex flex-col gap-1.5">
            <Link href="/profile" className="w-full flex items-center hover:bg-gray-100 gap-2 rounded-lg px-2 py-0.5">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center text-center justify-center text-blue-500 border border-blue-500 text-2xl font-mono font-medium">
                {fullname[0].toLowerCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold">{fullname}</h2>
                <p className="text-sm text-gray-500">
                  {email}
                </p>
              </div>
            </Link>
            <div className="bg-gray-300 w-full h-0.5 rounded-xl" />

            <LanguageSide />

            <div className="bg-gray-300 w-full h-0.5 rounded-xl" />

            <Link href="/profile/posts" className="w-full flex gap-2 items-center justify-start px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg">
              <Image src={postIcon.src} alt="Sun Icon" width={20} height={20} />
              {t("header.your_posts")}
            </Link>
            <Link href="/profile/interests" className="w-full flex gap-2 items-center justify-start px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg">
              <Image src={interestIcon.src} alt="Sun Icon" width={20} height={20} />
              {t("header.your_interests")}
            </Link>

            <div className="bg-gray-300 w-full h-0.5 rounded-xl" />

            <button
              onClick={() => { logOut(); }}
              className="w-full flex gap-2 items-center justify-start px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-red-500 rounded-lg"
              onMouseEnter={(e) => { if (e.currentTarget.firstChild) (e.currentTarget.firstChild as HTMLImageElement).src = selectedLogout.src; }} onMouseLeave={(e) => { if (e.currentTarget.firstChild) (e.currentTarget.firstChild as HTMLImageElement).src = unselectedLogout.src; }}
            >
              <Image src={unselectedLogout.src} alt="Sun Icon" width={20} height={20} />
              {t("header.logout")}
            </button>

          </div>
        </div>
      )}
      {CreateNewPostPopupOpen && (<CreateNewPostPopup onClose={() => setCreateNewPostPopupOpen(false)} />)}
    </header>
  );
};

export default Header;
