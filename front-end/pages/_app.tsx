import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Helmet } from "react-helmet";
import { appWithTranslation } from "next-i18next";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import TokenHandler from "@/util/tokenhandler";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const publicRoutes = ["/login", "/register", "/about", "/"];

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token && !publicRoutes.includes(router.pathname)) {
      router.push('/login');
    }
  }, [router.pathname]);

  // TokenHandler();

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
