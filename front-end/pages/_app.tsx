import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Helmet } from "react-helmet";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from '../next-i18next.config';
import { jwtDecode } from "jwt-decode";
import MessageHandler from "@/components/messageHandler";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const publicRoutes = ["/login", "/register", "/about", "/", "/nl", "/en"];
  const forbiddenOrginizationRoutes = ["/register/interests", "/profile/interests"];
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token && !publicRoutes.includes(router.pathname)) {
      router.push('/login');
    }

    if (token) {
      const tokenAccountType = jwtDecode<{ accountType: string }>(token).accountType;
      if (tokenAccountType != 'admin') {
        if (router.pathname.includes('/admin')) {
          router.push('/');
        }
      }
      if (tokenAccountType == "admin") {
        if (!router.pathname.includes('/admin')) {
          router.push('/admin');
        }
      }
      if (tokenAccountType == "organization") {
        if (forbiddenOrginizationRoutes.includes(router.pathname)) {
          router.push('/');
        };
      }
    }
  }, [router.pathname]);



  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>JoinMe</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Helmet>
      <MessageHandler />
      <div className="bg-white" >
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default appWithTranslation(App, nextI18NextConfig);
