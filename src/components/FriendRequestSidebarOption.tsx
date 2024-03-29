'use client'
import { ROUTES } from '@/helpers/routes'
import { pusherClient } from '@/lib/pusher'
import { toPuherKey } from '@/lib/utils'
import { UserIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type FriendRequestSidebarOptionProps = {
    initialUnseenRequestCount: number;
    sessionId: string
}

function FriendRequestSidebarOption({ initialUnseenRequestCount, sessionId }: FriendRequestSidebarOptionProps) {
    const [unseenRequestCount, setUnseenRequestCount] = useState(initialUnseenRequestCount);

    const friendRequestHanlder = () => {
        setUnseenRequestCount((prev) => prev + 1);
    }

    useEffect(() => {
        pusherClient.subscribe(toPuherKey(`user:${sessionId}:incoming_friend_request`));

        pusherClient.bind('incoming_friend_request', friendRequestHanlder);

        return () => {
            pusherClient.unsubscribe(toPuherKey(`user:${sessionId}:incoming_friend_request`));

            pusherClient.unbind('incoming_friend_request', friendRequestHanlder);
        }
    }, [])

    return (
        <Link
            href={`${ROUTES.dashboard}${ROUTES.requests}`}
            className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
        >
            <div
                className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
            >
                <UserIcon className='h-4 w-4' />
            </div>
            <p className='truncate'>Friend requests</p>
            {unseenRequestCount > 0 && (
                <div
                    className='rounded-full w-5 h-5 text-xs flex items-center justify-center text-white bg-indigo-600'
                >
                    {unseenRequestCount}
                </div>)}
        </Link>
    )
}

export default FriendRequestSidebarOption