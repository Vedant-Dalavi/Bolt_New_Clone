import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    useSidebar,
} from "@/components/ui/sidebar"
import { MessageCircleCode, SidebarCloseIcon, SidebarIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "../ui/button"
import WorkspaceHistory from "./WorkspaceHistory"
import SideBarFooter from "./SideBarFooter"
import Link from "next/link"

export function AppSidebar() {

    const { toggleSidebar } = useSidebar();

    return (
        <Sidebar>
            <SidebarHeader className="p-5" >
                <div className="flex items-center justify-between">

                    <Image src={"/logo.png"} alt='log' width={30} height={30} />
                    <SidebarCloseIcon onClick={toggleSidebar} className="cursor-pointer" />
                </div>

                <Link href={'/'} className="mt-5 w-full"> <Button className="w-full"> <MessageCircleCode /> Start New Chat</Button></Link>

            </SidebarHeader>
            <SidebarContent className="p-5">
                <SidebarGroup >
                    <WorkspaceHistory />
                </SidebarGroup>
                {/* <SidebarGroup /> */}
            </SidebarContent>
            <SidebarFooter >
                <SideBarFooter />
            </SidebarFooter>
        </Sidebar>
    )
}
