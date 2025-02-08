"use client"
import { MessageContext } from '@/app/context/MessagesContext';
import { UserDetailContext } from '@/app/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import { UpdateMessage } from '@/convex/workspace';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
function ChatView() {

    const { id } = useParams();
    const convex = useConvex();
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    const { messages, setMessages } = useContext(MessageContext);
    const [userInput, setUserInput] = useState();
    const [loading, setLoading] = useState(false);
    const UpdateMessage = useMutation(api.workspace.UpdateMessage);
    useEffect(() => {
        id && GetWorkspaceData();
    }, [id])

    // used to et workspace data using workspace id
    const GetWorkspaceData = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        })
        setMessages(result?.messages)
        console.log("workspace result------>", result);
    }

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role == 'user') {
                GetAiResponce();
            }
        }
    }, [messages])

    const GetAiResponce = async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
        const result = await axios.post('/api/ai-chat', {
            prompt: PROMPT
        })

        console.log("AI responce result ------->", result.data.result)

        const aiResp = {
            role: 'ai',
            content: result.data.result
        }

        setMessages(prev => [...prev, aiResp])

        await UpdateMessage({
            messages: [...messages, aiResp],
            workspaceId: id
        })
        console.log("Upadated the db workspace")
        setLoading(false);
    }

    const onGenerate = (input) => {
        setMessages(prev => [...prev, {
            role: 'user',
            content: input
        }])
    }

    return (
        <div className='relative h-[85vh] w-full flex flex-col'>
            <div className='flex-1 overflow-y-scroll scrollbar-hide'>
                {
                    messages?.map((msg, index) => (
                        <div key={index}
                            className='p-3 rounded-lg mb-2 flex gap-2 items-center leading-7'
                            style={{
                                backgroundColor: Colors.CHAT_BACKGROUND
                            }}>
                            {
                                msg.role == 'user' && <Image src={userDetail?.picture} width={35} height={35} className='rounded-full' alt='' />
                            }
                            <ReactMarkdown className='flex flex-col'>{msg.content}</ReactMarkdown>


                        </div>
                    ))
                }

                {
                    loading && <div className='p-3 rounded-lg mb-2 flex gap-2 items-center'
                        style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
                    >
                        <Loader2Icon className='animate-spin' />
                        <h2>Generating Responce...</h2>
                    </div>
                }
            </div>

            {/* input section */}

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
        </div>
    )
}

export default ChatView