"use client"

import { MessageContext } from "@/app/context/MessagesContext";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import React, { useContext, useState } from "react"
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Hero = () => {

    const [userInput, setUserInput] = useState();
    const { messages, setMessages } = useContext(MessageContext)
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    const [openDialog, setOpenDialog] = useState(false);
    const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
    const router = useRouter();

    const onGenerate = async (input) => {
        console.log("Inside the onGenerate function");

        if (!userDetail) {
            setOpenDialog(true);
            // return;
        }
        console.log("Hero section token veirfy ->", userDetail?.token)

        if (userDetail?.token < 10) {
            toast("You don't have enough token!")
            router.push('/pricing')
            return;
        }

        // if (userDetail) {
        //     router.push('/workspace')
        // }

        const msg = {
            role: 'user',
            content: input
        }

        setMessages([msg]);
        console.log("userDetail", userDetail);

        const workspaceId = await CreateWorkspace({
            user: userDetail?._id,
            messages: [msg]
        })

        console.log("workspaceID----> ", workspaceId);

        router.push('/workspace/' + workspaceId);

    }

    return (
        <div className="flex flex-col justify-center items-center mt-36  gap-2 ">
            <h2 className="font-bold text-4xl">  {Lookup.HERO_HEADING}</h2>
            <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>

            <div className="p-5 border rounded-xl max-w-2xl w-full mt-3 "

                style={{
                    backgroundColor: Colors.BACKGROUND
                }}>
                <div className="flex gap-2">
                    <textarea type="text" placeholder={Lookup.INPUT_PLACEHOLDER}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
                    />
                    {
                        userInput && <ArrowRight
                            onClick={() => onGenerate(userInput)}
                            className="bg-blue-500 p-2  h-10 w-10 rounded-md cursor-pointer" />
                    }

                </div>

                <div>
                    <Link className="h-5 w-5" />
                </div>
            </div>

            <div className="flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3">
                {Lookup.SUGGSTIONS.map((suggestion, index) => (
                    <h2 key={index}
                        onClick={() => onGenerate(suggestion)}
                        className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
                    >{suggestion}</h2>
                ))}
            </div>

            <SignInDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(v)} />

        </div>
    )
};

export default Hero;
