"use client"
import { UserDetailContext } from '@/app/context/UserDetailContext';
import PricingModel from '@/components/custom/PricingModel';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup'
import React, { useContext } from 'react'

function page() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    return (
        <div className=' flex flex-col items-center w-full py-5 lg:px-48 gap-5'>
            <h2 className='font-bold text-3xl'>Pricing</h2>
            <p className='text-gray-400 max-w-xl text-center'>{Lookup.PRICING_DESC}</p>

            <div className='p-5 border rounded-xl w-full flex justify-between'
                style={{
                    backgroundColor: Colors.CHAT_BACKGROUND
                }}
            >
                <h2 className='text-lg'>
                    <span className='font-bold '>{userDetail?.token}</span> Tokens Left
                </h2>
                <div>
                    <h2>Need more token?</h2>
                    <p>Upgrade your plan below</p>

                </div>
            </div>
            <PricingModel />
        </div>
    )
}

export default page