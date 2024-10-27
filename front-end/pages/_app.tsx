import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Helmet } from "react-helmet";
import { appWithTranslation } from "next-i18next";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8"/>
        <title>JoinMe</title>
      </Helmet>
        <div >
            <Component {...pageProps} />
        </div>
    </>
  )
}

export default appWithTranslation(App);
