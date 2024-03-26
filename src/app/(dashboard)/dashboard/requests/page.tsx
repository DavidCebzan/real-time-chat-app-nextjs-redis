import FriendRequests from '@/components/FriendRequests';
import { fetchRedis } from '@/helpers/redis';
import { authoOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation';
import React from 'react'

async function Requests() {

    const session = await getServerSession(authoOptions);
    if (!session) notFound()

    const incomingSenderIds = await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_request`) as string[]

    const incomingFriendRequest = await Promise.all(
        incomingSenderIds.map(async (senderId) => {
            const seder = await fetchRedis('get', `user:${senderId}`) as string;
            const parsedSender = JSON.parse(seder) as User;
            return {
                senderId,
                senderEmail: parsedSender.email,
            }
        })
    )
        
    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8'>Add a friendcqwer</h1>
            <div
                className='flex flex-col gap-4'
            >
                <FriendRequests incomingFriendRequest={incomingFriendRequest} sesionId={session.user.id}/>
            </div>
        </main>
    )
}

export default Requests