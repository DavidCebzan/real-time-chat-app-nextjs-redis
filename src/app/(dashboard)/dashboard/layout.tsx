import FriendRequestSidebarOption from '@/components/FriendRequestSidebarOption';
import { Icon, Icons } from '@/components/Icons';
import MobileChatLayout from '@/components/MobileChatLayout';
import SidebarChatList from '@/components/SidebarChatList';
import SignOutButton from '@/components/SignOutButton';
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id';
import { fetchRedis } from '@/helpers/redis';
import { ROUTES } from '@/helpers/routes';
import { authoOptions } from '@/lib/auth';
import { SideBarOptions } from '@/types/typings';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react'

type LayoutProps = {
    children: React.ReactNode;
}

const sideBarOptions: SideBarOptions[] = [
    {
        id: 1,
        name: 'Add friend',
        href: `${ROUTES.dashboard}${ROUTES.add}`,
        Icon: 'UserPlus'
    },
]

const Layout = async ({ children }: LayoutProps) => {

    const session = await getServerSession(authoOptions)

    if (!session) {
        notFound();
    }

    const friends = await getFriendsByUserId(session.user.id);

    const unseenRequestCount = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_request`) as User[]).length

    return (
        <div className='w-full flex h-screen'>
            <div className='md:hidden'>
                <MobileChatLayout
                    friends={friends}
                    session={session}
                    sidebarOptions={sideBarOptions}
                    unseenRequestCount={unseenRequestCount}
                />
            </div>
            <div className='hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>



                <Link href={`${ROUTES.dashboard}`} className='flex shrink-0 items-center h-16'>
                    <Icons.Logo className='h-8 w-auto text-indigo-600' />
                </Link>

                {friends.length > 0 && <div className='text-xs font-semibold leading-6 text-gray-400'>
                    Your chats
                </div>
                }
                <nav className='flex flex-1 flex-col'>
                    <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                        {/* Chats that the user has */}
                        <li>
                            <SidebarChatList sessionId={session.user.id} friends={friends} />
                        </li>



                        <li>
                            <div className='text-xs font-semibold left-6 text-gray-400'>
                                Overwiev
                            </div>

                            <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                {sideBarOptions.map((item) => {
                                    const Icon = Icons[item.Icon];
                                    return (
                                        <li key={item.id}>
                                            <Link
                                                href={item.href}
                                                className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                            >
                                                <span
                                                    className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                                                >
                                                    <Icon className='h-4 w-4' />
                                                </span>
                                                <span className='truncate'>
                                                    {item.name}
                                                </span>
                                            </Link>
                                        </li>
                                    )
                                })}

                                {/* navigate  */}

                                <li>
                                    <FriendRequestSidebarOption
                                        sessionId={session.user.id}
                                        initialUnseenRequestCount={unseenRequestCount}
                                    />
                                </li>

                            </ul>
                        </li>


                        <li className=' -mx-6 mt-auto flex items-center'>
                            <div className='flex flex-1 items-center px-6 py-3 text-sm gap-x-4 font-semibold leading-6 text-gray-900'>
                                <div className='relative h-8 w-8 bg-gray-50'>
                                    <Image
                                        fill
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                        src={session.user.image ?? ''}
                                        alt='Your profile picture'
                                    />
                                </div>

                                <span className='sr-only'>Your profile</span>
                                <div className='flex flex-col'>
                                    <span aria-hidden='true'>{session.user.name}</span>
                                    <span className='text-xs text-zinc-400' aria-hidden='true'>
                                        {session.user.email}
                                    </span>
                                </div>
                            </div>

                            <SignOutButton className='h-full aspect-square' />
                        </li>
                    </ul>
                </nav>
            </div>
            <aside
            className=' max-h-screen container py-16 md:py-12 w-full'
            >
            {children}
            </aside>
        </div>
    )
}

export default Layout