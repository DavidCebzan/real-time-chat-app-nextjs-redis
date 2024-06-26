'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Message } from '@/lib/validations/message'
import { cn, toPuherKey } from '@/lib/utils'
import { format } from 'date-fns';
import Image from 'next/image';
import { pusherClient } from '@/lib/pusher';

type MessagesProps = {
    initialMessage: Message[],
    ownUserId: string,
    ownImage: string | null | undefined,
    chatPartner: User,
    chatId: string,
}

function formatTimestamp(timestamp: number) {
    return format(timestamp, 'HH:mm');
}


function Messages({
    initialMessage,
    ownUserId,
    ownImage,
    chatPartner,
    chatId
}: MessagesProps) {

    const scrolldownRef = useRef<HTMLDivElement | null>(null);

    const [messages, setMessages] = useState(initialMessage);


    useEffect(() => {
        pusherClient.subscribe(toPuherKey(`chat:${chatId}`));

        const messageHanlder = (message: Message) => {
            setMessages((prev) => [message, ...prev])
        }
    
        pusherClient.bind('incoming-message', messageHanlder);

        return () => {
            pusherClient.unsubscribe(toPuherKey(`chat:${chatId}`));

            pusherClient.unbind('incoming-message', messageHanlder);
        }
    }, [chatId])


    return (
        <div
            id='messages'
            className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
        >
            <div ref={scrolldownRef} />
            {
                messages.map((message, index) => {
                    const isCurrentUser = message.senderId == ownUserId;

                    const hasNextMessageFromSameUser = messages[index - 1]?.senderId === messages[index].senderId;

                    return (
                        <div
                            key={`${message.id}-${message.timestamp}`}
                            className='chat-message'
                        >
                            <div className={cn('flex items-end', {
                                'justify-end': isCurrentUser
                            })}>
                                <div
                                    className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2', {
                                        'order-1 items-end': isCurrentUser,
                                        'order-2 items-start': !isCurrentUser,
                                    })}
                                >
                                    <span
                                        className={cn('px-4 py-2 rounded-lg inline-block'
                                            , {
                                                'bg-indigo-600 text-white': isCurrentUser,
                                                'bg-gray-200 text-gray-900': !isCurrentUser,
                                                'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
                                                'rounded-bl-none': !hasNextMessageFromSameUser && !isCurrentUser
                                            }
                                        )}
                                    >
                                        {message.text}{' '}
                                        <span className='ml-2 text-xs text-gray-400'>
                                            {formatTimestamp(message.timestamp)}
                                        </span>
                                    </span>
                                </div>
                                {<div
                                    className={cn('relative w-6 h-6', {
                                        'order-2': isCurrentUser,
                                        'order-1': !isCurrentUser,
                                        'invisible': hasNextMessageFromSameUser,
                                    })}
                                >
                                    <Image
                                        fill
                                        src={isCurrentUser ? (ownImage as string) : chatPartner.image}
                                        alt={`User Image`}
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                    />
                                </div>}
                            </div>
                        </div>)
                })
            }

        </div>
    )
}

export default Messages