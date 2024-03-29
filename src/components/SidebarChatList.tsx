'use client'
import { ROUTES } from '@/helpers/routes'
import { pusherClient } from '@/lib/pusher'
import { chatHrefConstructor, toPuherKey } from '@/lib/utils'
import { Message } from '@/lib/validations/message'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import UnseenChatToast from './UnseenChatToast'


type ExtendedMessage = Message & {
    senderImg: string,
    senderName: string;
}

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

    useEffect(() => {
        pusherClient.subscribe(toPuherKey(`user:${sessionId}:chats`));
        pusherClient.subscribe(toPuherKey(`user:${sessionId}:friends`));

        const chatHandler = (message: ExtendedMessage) => {
            //notify only if we are not in the caht
            const shouldNotify = pathName !== `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

            if(!shouldNotify) {
                return;
            }

            toast.custom((t) => {
                //custom component
                return (
                <UnseenChatToast
                    t={t}
                    sessionId={sessionId}
                    senderId={message.senderId}
                    senderImg={message.senderImg}
                    message={message.text}
                    senderName={message.senderName}
                />)
            })

            setUnseenMessages((prev) => [...prev, message])
        }

        const newFriendHandler = () => {
            router.refresh()
        }
    
        pusherClient.bind('new_message', chatHandler);
        pusherClient.bind('new_friend', newFriendHandler);

        return () => {
            pusherClient.unsubscribe(toPuherKey(`user:${sessionId}:chats`));
            pusherClient.unsubscribe(toPuherKey(`user:${sessionId}:friends`));

            pusherClient.unbind('incoming-message', chatHandler);
            pusherClient.unbind('new_friend', newFriendHandler);
        }
    }, [pathName, sessionId, router])

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