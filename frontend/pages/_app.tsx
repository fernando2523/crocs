import Head from 'next/head';
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import LoginPage from "../components/login";
import { Buffer } from "buffer";
global.Buffer = global.Buffer || Buffer;

function MyApp({ Component, pageProps }: AppProps) {

  const [Token, setToken]: any = useState(null);

  //hook useEffect
  useEffect(() => {
    { Cookies.get('auth') ? setToken(true) : setToken(false) }
  }, []);

  if (Token === null) {
  } else if (Token === false) {
    return (
      <LoginPage />
    )
  } else {
    return (
      <Layout>
        <Head>
          <title>Smart Apps | Gudangsandal</title>
          <link rel="shortcut icon" href="../favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    )
  }
}
export default MyApp;
