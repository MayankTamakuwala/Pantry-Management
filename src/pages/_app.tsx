import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import { initializeApp } from "firebase/app";
import { AlertProvider } from "@/context";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {


    return (
        <>
            <AuthProvider>
                <AlertProvider>
                    <Head>
                        <meta charSet="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        {/* <meta name="theme-color" content="#000000" />
                        <link rel="manifest" href="manifest.json" />
                        <link rel="icon" type="image/x-icon" href="favicon.ico" />
                        <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
                        <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
                        <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" /> */}
                    </Head>
                    <Component {...pageProps} />
                </AlertProvider>
            </AuthProvider>
        </>
    );
}
