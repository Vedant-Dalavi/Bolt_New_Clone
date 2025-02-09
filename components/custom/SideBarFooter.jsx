import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react'
import React, { useContext } from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { UserDetailContext } from '@/app/context/UserDetailContext';
import { MessageContext } from '@/app/context/MessagesContext';
import { useSidebar } from '../ui/sidebar';
import { toast } from 'sonner';

function SideBarFooter() {
    const router = useRouter();
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    const { message, setMessage } = useContext(MessageContext)
    const { toggleSidebar } = useSidebar();

    const options = [
        {
            name: 'Settings',
            icon: Settings
        },
        {
            name: 'Help Center',
            icon: HelpCircle
        },
        {
            name: 'My Subscription',
            icon: Wallet,
            path: '/pricing'
        },

        {
            name: 'Sign Out',
            icon: LogOut
        },

    ]

    const OnOptionClik = (option) => {
        if (option.name == 'Sign Out') {
            toast.success("Signed Out Successfully")

            toggleSidebar();
            localStorage.clear();
            setUserDetail(null);
            setMessage(null);
            router.push('/')
            return
        }

        if (option?.path == null) {
            return
        }
        router.push(option?.path)

    }

    return (
        <div className='p-2 mb-10 '>
            {
                options.map((option, index) => (
                    <Button key={index} variant="ghost"
                        onClick={() => OnOptionClik(option)}
                        className="w-full flex justify-start">
                        <option.icon />
                        {
                            option.name
                        }
                    </Button>
                ))
            }
        </div>
    )
}

export default SideBarFooter