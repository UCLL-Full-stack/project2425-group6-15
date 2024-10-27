import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>JoinMe</title>
        <meta charSet="utf-8" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
        {/* Logo */}
        <div className="mb-8">
          {/* <img src={telenet_LOGO} alt="JoinMe Logo" className="w-32" /> */}
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-gray-900">JoinMe</h1>

        {/* Description */}
        <p className="mt-4 text-lg text-center max-w-md text-gray-600">
          JoinMe is a platform that allows you to connect and make friends.
          It's easy to use and free!
        </p>

        {/* Buttons */}
        <div className="mt-8 flex space-x-4">
          <Link href="/login" legacyBehavior>
            <a className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300">
              Login
            </a>
          </Link>
          <Link href="/register" legacyBehavior>
            <a className="px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition duration-300">
              Register
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
