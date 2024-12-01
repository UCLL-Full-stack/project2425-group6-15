import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="fixed left-0 top-0 bg-white p-2 w-full font-sans grid grid-cols-[max-content,1fr,max-content,max-content] grid-rows-2 gap-x-2">
        <h1 className="text-3xl w-fit font- font-normal text-blue-950"><strong className="font-bold">Join</strong>Me</h1>
        <input type="search" className="outline-none border border-gray-300 rounded-full px-4 max-w-xl" placeholder="Zoek op locatie, activiteit,..."/>
        <button className="text-blue-600 border-2 border-blue-600 rounded-full px-2 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white">Maak activiteit</button>
        <button className="h-full bg-blue-200 aspect-square rounded-full" title="Profile"></button>
    </header>
  );
};

export default Header;
