import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/header/header";
import Headerplain from "@/components/header/headerplain";
import PostOverview from "@/components/dashboard/postOverview";
import postService from "@/services/postService";
import { Post } from "@/types/index";
import { LatLngExpression } from "leaflet";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  if (isLoggedIn) {
    return (
      <>
        <Header />
        <PostOverview />
      </>
    );
  }
  return (
    <>
      <Headerplain />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800">
        <div className="mb-8">
          <img src="/logo.png" alt="JoinMe Logo" className="w-32 h-32" />
        </div>
        <h1 className="text-6xl font-extrabold text-gray-900">JoinMe</h1>
        <p className="mt-4 text-xl text-center max-w-2xl text-gray-700">
          {t("home.description")}
        </p>
        <div className="mt-8 flex space-x-4">
          <Link href="/register" legacyBehavior>
            <a className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
              Get Started
            </a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full text-lg font-semibold hover:bg-gray-300 transition duration-300">
              Learn More
            </a>
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <img src="/images/sample1.jpg" alt="Sample 1" className="w-full h-48 object-cover rounded-t-lg" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Discover New Friends</h2>
            <p className="mt-2 text-gray-700">Connect with people who share your interests and hobbies.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <img src="/images/sample2.jpg" alt="Sample 2" className="w-full h-48 object-cover rounded-t-lg" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Join Communities</h2>
            <p className="mt-2 text-gray-700">Be a part of communities that matter to you.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <img src="/images/sample3.jpg" alt="Sample 3" className="w-full h-48 object-cover rounded-t-lg" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Share Your Moments</h2>
            <p className="mt-2 text-gray-700">Post updates and share your experiences with friends.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;