import React, { useContext } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignInDialog = ({ openDialog, closeDialog }) => {

    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const CreateUser = useMutation(api.users.CreteUser);
    const router = useRouter();

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponce) => {
            console.log(tokenResponce);
            const userInfo = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: 'Bearer' + tokenResponce?.access_token }
            });

            console.log(userInfo);
            const user = userInfo.data;


            const dbUser = await CreateUser({
                name: user?.name,
                email: user?.email,
                picture: user?.picture,
                uid: uuid4()
            })

            if (typeof window !== undefined) {
                localStorage.setItem('user', JSON.stringify(dbUser[0]))
            }
            setUserDetail(dbUser[0])
            // save this inside our database 
            if (userDetail?.token < 10) {
                toast("You don't have enough token!")
                router.push('/pricing')
                closeDialog(false);
                return
            }
            closeDialog(false);
        },
        onError: errorResponse => console.log(errorResponse),
    });

    return (
        <Dialog open={openDialog} onOpenChange={closeDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription >
                        <div className="flex flex-col items-center justify-center gap-3">
                            <h2 className="font-bold text-2xl   text-white text-center">{Lookup.SIGNIN_HEADING}</h2>
                            <p className="mt-2 text-center">{Lookup.SIGNIN_SUBHEADING}</p>
                            <Button className="bg-blue-500 text-white hover:bg-blue-400 mt-3"
                                onClick={googleLogin}
                            >Sign In With Google</Button>
                            <p>{Lookup?.SIGNIn_AGREEMENT_TEXT}</p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
};

export default SignInDialog;