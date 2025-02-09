import Image from "next/image";
import React, { useContext, useEffect } from "react"
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { useSidebar } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ActionContext } from "@/app/context/ActionContext";
import { ChevronDown, EditIcon, LucideDownload, Rocket, SidebarCloseIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { GeminiModelContext } from "@/app/context/GeminiModelContext";

function Header() {

    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    const { toggleSidebar } = useSidebar();
    const { action, setAction } = useContext(ActionContext)
    const path = usePathname();
    const { geminiModel, setGeminiModel } = useContext(GeminiModelContext);

    console.log(path?.includes('workspace'))

    useEffect(() => {
        console.log("Gemini Model ----> ", geminiModel)
    }, [geminiModel])

    const onActionBtn = (action) => {
        setAction({
            actionType: action,
            timeStamp: Date.now()
        })

    }


    return (
        <div className="p-4 flex justify-between items-center border-b">
            <div className="flex  items-center justify-between gap-5">
                {
                    userDetail && <SidebarCloseIcon onClick={toggleSidebar} className="cursor-pointer" />
                }
                {
                    userDetail && <Link href={'/'} className="cursor-pointer"> <EditIcon /></Link>
                }


                <div >

                    {!userDetail && <Image src={'/logo.png'} alt='Logo' width={30} height={30} />}
                    {
                        userDetail && <DropdownMenu>
                            <DropdownMenuTrigger ><Button className=" bg-trasperant hover:bg-gray-800"><Image src={'/logo.png'} alt='Logo' width={30} height={30} /> <ChevronDown width={20} height={20} className="text-white" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Select Gemini model</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setGeminiModel("gemini-2.0-flash")}>Gemini 2.0 Flash</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setGeminiModel("gemini-2.0-flash-lite-preview-02-05")}>Gemini 2.0 Flash-Lite</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setGeminiModel("gemini-2.0-pro-exp-02-05")}>Gemini 2.0 Pro Experimental </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setGeminiModel("gemini-1.5-pro")}>Gemini 1.5 Pro</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    }
                </div>


            </div>

            {
                !userDetail ? <div className="flex gap-5">
                    <Button varient="ghost" > Sign In</Button>
                    <Button className="text-white" style={{ backgroundColor: Colors.BLUE }}> Get Started</Button>
                </div> :
                    <div className="flex gap-4">
                        {
                            path?.includes('workspace') && <div className="flex gap-2 items-center">
                                <Button varient="ghost" onClick={() => onActionBtn('export')}><LucideDownload /> Export</Button>
                                <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => onActionBtn('deploy')}><Rocket /> Deploy</Button>
                            </div>
                        }
                        {userDetail && <Image src={userDetail?.picture} alt='user' width={30} height={30}
                            className="rounded-full w-[30px] cursor-pointer"
                            onClick={toggleSidebar}
                        />}
                    </div>
            }
        </div>
    )
};

export default Header;