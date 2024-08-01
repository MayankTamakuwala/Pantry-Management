import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import { AlertProvider } from "@/context";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'

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
                        <meta property="og:type" content="website" />
                        <meta property="og:url" content="https://pantrymanagement.vercel.app" />
                        <meta property="og:image" content="https://some-image.png" />
                        <meta name="twitter:image" content="meta.jpeg"/>
                        <meta name="twitter:title" content="Pantry Management System - Simplify Your Pantry and Meal Planning" />
                        <meta name="twitter:description" content="Discover the new Pantry Management System app with Google login, AI-powered item recognition, and AI-generated recipes based on your pantry items. Built with Next.js, Tailwind CSS, and Material UI." />
                        <title>Pantry Management System - Simplify Your Pantry and Meal Planning</title>
                        <meta property="og:title" content="Pantry Management System - Simplify Your Pantry and Meal Planning" />
                        <meta property="og:description" content="Explore the Pantry Management System app. Easily add items, use AI for item recognition and recipe suggestions, and keep track of your pantry. Built with Next.js, Tailwind CSS, and Material UI." />
                    </Head>
                    <Component {...pageProps} />
                    <GoogleAnalytics gaId="G-R10EFE6EBS" />
                    <GoogleTagManager gtmId="GTM-WW8VX2BS"/>
                </AlertProvider>
            </AuthProvider>
        </>
    );
}
