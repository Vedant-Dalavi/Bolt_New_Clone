"use client"
import React, { useContext, useEffect, useState } from 'react'
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import Prompt from '@/data/Prompt';
import { MessageContext } from '@/app/context/MessagesContext';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { countToken } from './ChatView';
import { UserDetailContext } from '@/app/context/UserDetailContext';
import SandpackPreviewClient from './SandpackPreviewClient';
import { ActionContext } from '@/app/context/ActionContext';


function CodeView() {
    const { id } = useParams();
    const { userDetail, setUserDetail } = useContext(UserDetailContext)

    const [activeTab, setActiveTab] = useState('code');
    const [files, setFiles] = useState(Lookup?.DEFAULT_FILE)
    const { messages, setMessages } = useContext(MessageContext)
    const UpdateFiles = useMutation(api.workspace.UpdateFiles)
    const convex = useConvex();
    const [loading, setLoading] = useState(false);
    const UpdateTokens = useMutation(api.users.UpdateToken);
    const { action, setAction } = useContext(ActionContext)


    useEffect(() => {
        id && GetFiles();
    }, [id])

    // useEffect(() => {
    //     setActiveTab('preview')
    // }, [action])

    const GetFiles = async () => {
        setLoading(true);

        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        })

        const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result.fileData }
        setFiles(mergedFiles)
        setLoading(false);

    }

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role == 'user') {
                GenerateAiCode();
            }
        }
    }, [messages])

    const GenerateAiCode = async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
        // console.log("Promt->", PROMPT)
        const result = await axios.post('/api/gen-ai-code', {
            prompt: PROMPT
        })

        // console.log("code view result ---->", result.data);
        const aiResp = result.data;

        const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files }
        setFiles(mergedFiles)

        await UpdateFiles({
            workspaceId: id,
            files: aiResp?.files
        });

        const remTokens = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
        setUserDetail(prev => ({ ...prev, token: remTokens }))

        const newTokens = await UpdateTokens({
            userId: userDetail?._id,
            token: remTokens
        })

        console.log("Tokens------>", remTokens)
        setLoading(false);
    }

    return (
        <div className='relative'>
            <div className='bg-[#181818] w-full p-2 border'>
                <div className='flex items-center flex-wrap shrink-0 bg-black p-1 w-[140px] gap-3 justify-center rounded-full'>

                    <h2
                        onClick={() => setActiveTab('code')}
                        className={`text-sm cursor-pointer 
                            ${activeTab == 'code' && 'bg-blue-500 text-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}
                    >Code</h2>

                    <h2
                        onClick={() => setActiveTab('preview')}
                        className={`text-sm cursor-pointer 
                            ${activeTab == 'preview' && 'bg-blue-500 text-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}
                    >Preview</h2>
                </div>
            </div>

            <SandpackProvider
                files={files}
                template="react" theme={'dark'}
                customSetup={{
                    dependencies: {
                        ...Lookup.DEPENDANCY
                    }
                }}

                options={{
                    externalResources: ['https://unpkg.com/@tailwindcss/browser@4']
                }}
            >
                <SandpackLayout >
                    {activeTab == 'code' ?
                        <>
                            <SandpackFileExplorer style={{ height: '80vh' }} />
                            <SandpackCodeEditor style={{ height: '80vh' }} />
                        </>
                        :
                        <>
                            <SandpackPreviewClient />
                        </>
                    }
                </SandpackLayout>
            </SandpackProvider>
            {loading &&

                <div className='p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center'>
                    <Loader2Icon className='animate-spin h-10 w-10 text-white' />
                    <h2 className='text-white'>Generating your files...</h2>
                </div>
            }

        </div>
    )
}

export default CodeView