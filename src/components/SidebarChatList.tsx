'use client'
import { ROUTES } from '@/helpers/routes'
import { chatHrefConstructor } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type SidebarChatListProps = {
    friends: User[],
    sessionId: string
}

function SidebarChatList({ friends, sessionId }: SidebarChatListProps) {
    const router = useRouter();
    const pathName = usePathname();
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (pathName?.includes('chat')) {
            setUnseenMessages((prev) => {
                return prev.filter((msg) => !pathName.includes(msg.senderId));
            })
        }
    }, [pathName])

    return (
        <ul role='list ' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
            {

                friends.sort().map(((friend) => {
                    const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
                        return unseenMsg.senderId === friend.id
                    }).length;

                    return (
                        <li
                            key={friend.id}
                        >
                            <a
                                className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 goup flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                href={`${ROUTES.dashboard}${ROUTES.chat}/${chatHrefConstructor(sessionId, friend.id)}`}>
                                {friend.name}
                                {unseenMessagesCount > 0 &&
                                    <div 
                                    className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'
                                    >
                                        {unseenMessagesCount}
                                    </div>}
                            </a>
                        </li>
                    );
                }))
            }

        </ul>
    )
}

export default SidebarChatList