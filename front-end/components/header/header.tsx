import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import jwt from 'jsonwebtoken';
import unselectedMoon from "@/images/icons/header/unselectMoon.svg";
import selectedMoon from "@/images/icons/header/selectMoon.svg";
import unselectedSun from "@/images/icons/header/unselectSun.svg";
import selectedSun from "@/images/icons/header/selectSun.svg";
import unselectPc from "@/images/icons/header/unselectPc.svg";
import selectedPc from "@/images/icons/header/selectPc.svg";
import unselectedLogout from "@/images/icons/header/unselectLogout.svg";
import selectedLogout from "@/images/icons/header/selectLogout.svg";
import interestIcon from "@/images/icons/header/interests.svg"
import postIcon from "@/images/icons/header/posts.svg"


const Header: React.FC = () => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState("light");
  const [fullname, setFullname] = useState<String>("");
  const [email, setEmail] = useState<String>("");

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

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const logOut = () => {  
    sessionStorage.removeItem("token");
    Router.push("/login");
  };

  return (
    <header className="fixed left-0 top-0 bg-white p-2 w-full font-sans grid grid-cols-[max-content,1fr,max-content,max-content] grid-rows-2 gap-x-2">
        <h1 className="text-3xl w-fit font- font-normal text-blue-950"><strong className="font-bold">Join</strong>Me</h1>
        <input type="search" className="outline-none border border-gray-300 rounded-full px-4 max-w-xl" placeholder="Zoek op locatie, activiteit,..."/>
        <button className="text-blue-600 border-2 border-blue-600 rounded-full px-2 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white">Create Meetup</button>
        <button onClick={() => setAccountMenuOpen(true)} className="h-full bg-blue-200 aspect-square rounded-full" title="Profile"></button>
        {accountMenuOpen && (
        <div ref={accountMenuRef}>
          <div className="absolute right-2 mt-2 w-72 p-3 bg-white border border-gray-300 rounded-md shadow-lg ">
            <Link href="/profile" className="w-full flex items-center hover:bg-gray-100 gap-2">
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

            <div className="bg-gray-300 w-full h-0.5 rounded-xl"/>
            
            <Link href="/profile/posts" className="w-full flex gap-2 items-center justify-start px-4 py-2 text-gray-800 hover:bg-gray-100">
              <Image src={postIcon.src} alt="Sun Icon" width={20} height={20} />
              Your posts
            </Link>
            <Link href="/profile/interests" className="w-full flex gap-2 items-center justify-start px-4 py-2 text-gray-800 hover:bg-gray-100">
              <Image src={interestIcon.src} alt="Sun Icon" width={20} height={20} />
              your interests
            </Link>

            <div className="bg-gray-300 w-full h-0.5 rounded-xl"/>

            <button 
              onClick={() => {logOut();} }
              className="w-full flex gap-2 items-center justify-start px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-red-500"
              onMouseEnter={(e) => { if (e.currentTarget.firstChild) (e.currentTarget.firstChild as HTMLImageElement).src = selectedLogout.src; }} onMouseLeave={(e) => { if (e.currentTarget.firstChild) (e.currentTarget.firstChild as HTMLImageElement).src = unselectedLogout.src; }}
              >
                <Image src={unselectedLogout.src} alt="Sun Icon" width={20} height={20} />
              Log Out
            </button>

           
          </div>
        </div>
        )}
        
    </header>
  );
};

export default Header;
