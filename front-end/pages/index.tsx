import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link"; 


const Home: React.FC = () => {


  return (
    <>
      <Head>
        <title>JoinMe</title>
        <meta charSet="utf-8"/>
      </Head>
      <div>
        <div>
          {/* <img src={telenet_LOGO} alt="JoinmeLogo" /> */}
        </div>
        <div>
          <h1>JoinMe</h1>
        </div>
        <div>
          <p>JoinMe is a platform that allows you to connect and make frineds. It's easy to use and free!</p>
        </div>
        <div>
          <Link href="/login">
            Login
          </Link>
          <Link href="/register">
            Register
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
