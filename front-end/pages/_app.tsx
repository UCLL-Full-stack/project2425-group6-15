import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Helmet } from "react-helmet";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { appWithTranslation } from "next-i18next";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const publicRoutes = ["/login", "/register", "/about", "/"];

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token && !publicRoutes.includes(router.pathname)) {
      router.push('/login');
    }
  }, [router.pathname]);


  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>JoinMe</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Helmet>
      <div className="bg-white" >
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default appWithTranslation(App);
