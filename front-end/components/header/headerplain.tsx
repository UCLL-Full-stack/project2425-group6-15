import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const Headerplain: React.FC = () => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState("light");
  const [fullname, setFullname] = useState<String>("");
  const [email, setEmail] = useState<String>("");

  return (
    <header className="fixed left-0 top-0 bg-white p-2 w-full font-sans grid grid-cols-[max-content,1fr] gap-x-2">
        
        <h1 className="text-3xl w-fit font- font-normal text-blue-950"><strong className="font-bold">Join</strong>Me</h1>
        
        <div className="flex items-center justify-end gap-4 text-base">
          <Link href="/login" className="px-4 py-0.5 border border-blue-500 rounded-full text-white bg-blue-500">
              Login
          </Link>
          <Link href="/register" className="px-4 py-0.5 bg-white border border-blue-500 rounded-full text-blue-500">
              Register
          </Link>
        </div>
        
        
    </header>
  );
};

export default Headerplain;
