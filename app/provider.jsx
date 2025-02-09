"use client"
import React, { useEffect, useState } from "react"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import Header from "@/components/custom/Header";
import { MessageContext } from "./context/MessagesContext";
import { UserDetailContext } from "./context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/AddSideBar";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ActionContext } from "./context/ActionContext";
import { useRouter } from "next/navigation";
import { GeminiModelContext } from "./context/GeminiModelContext";


const Provider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [userDetail, setUserDetail] = useState();
    const [action, setAction] = useState();
    const [geminiModel, setGeminiModel] = useState();
    const convex = useConvex();
    const router = useRouter();

    useEffect(() => {
        IsAuthenticated();
    }, [])

    const IsAuthenticated = async () => {
        if (typeof window !== undefined) {
            const user = JSON.parse(localStorage.getItem('user'))
            // fetch from database

            if (!user) {
                router.push('/')
                return
            }

            const result = await convex.query(api.users.GetUser, {
                email: user?.email
            })
            setUserDetail(result);
            console.log(result)
        }
    }


    return (
        <div >
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}>

                <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>



                    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>

                        <MessageContext.Provider value={{ messages, setMessages }}>
                            <ActionContext.Provider value={{ action, setAction }} >
                                <GeminiModelContext.Provider value={{ geminiModel, setGeminiModel }}>
                                    <NextThemesProvider
                                        attribute="class"
                                        defaultTheme="dark"
                                        enableSystem
                                        disableTransitionOnChange
                                    >
                                        <SidebarProvider defaultOpen={false} className="flex flex-col">
                                            <Header />
                                            <div className="flex">
                                                <AppSidebar />  {/* Sidebar on the left */}
                                                <div className="flex-1 overflow-hidden"> {/* Main content area */}
                                                    {children}
                                                </div>
                                            </div>

                                        </SidebarProvider>
                                    </NextThemesProvider>
                                </GeminiModelContext.Provider>
                            </ActionContext.Provider>
                        </MessageContext.Provider>
                    </UserDetailContext.Provider>
                </PayPalScriptProvider>
            </GoogleOAuthProvider>
        </div>
    )
};

export default Provider;