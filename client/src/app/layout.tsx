import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "./globals.css";
import Layout from "@/components/Layout";
import { Auth0Provider } from "@auth0/auth0-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Chatwave",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <UserProvider>
                    <Layout>{children}</Layout>
                </UserProvider>
            </body>
        </html>
    );
}
