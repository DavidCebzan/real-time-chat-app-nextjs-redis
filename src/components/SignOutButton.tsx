'use client'

import React, { ButtonHTMLAttributes, useState } from 'react'
import Button from './ui/Button';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Loader2Icon, LogOut } from 'lucide-react';

type SignOutButton = ButtonHTMLAttributes<HTMLButtonElement>

function SignOutButton(props: SignOutButton) {

    const [isSingningOut, setIsSigningOut] = useState(false);

    const handliButtonClick = async () => {
        setIsSigningOut(true);
        try {
            await signOut()
        } catch (e) {
            toast.error('There was a problem signing out')
        } finally {
            setIsSigningOut(false);
        }
    }

    return (
        <Button {...props} variant={'ghost'} onClick={handliButtonClick}>
            {isSingningOut ? 
            (<Loader2Icon className='animate-spin w-4 h-4' />)
                : <LogOut className='w-4 h-4' />}
        </Button>
    )
}

export default SignOutButton