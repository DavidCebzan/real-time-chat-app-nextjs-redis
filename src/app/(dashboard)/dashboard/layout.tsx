import { Icons } from '@/components/Icons';
import { authoOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react'

type LayoutProps = {
    children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {

    const session = await getServerSession(authoOptions)

    if (!session) {
        notFound();
    }

    return (
        <div className='w-full flex h-screen'>
            <div className='flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>



                <Link href={'/dashboard'} className='flex shrink-0 items-center h-16'>
                    <Icons.Logo className='h-8 w-auto text-indigo-600' />
                </Link>

                <div className='text-xs font-semibold leading-6 text-gray-400'>
                    your chats
                </div>

                <nav className=''></nav>
            </div>
            {children}
        </div>
    )
}

export default Layout