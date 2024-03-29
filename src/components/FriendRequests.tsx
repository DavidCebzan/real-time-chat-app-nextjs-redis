'use client'
import { pusherClient } from '@/lib/pusher'
import { toPuherKey } from '@/lib/utils'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type FriendRequestsProps = {
    incomingFriendRequest: IncomingFriendRequest[]
    sesionId: string,
}

function FriendRequests({incomingFriendRequest, sesionId}: FriendRequestsProps) {
    const [friendRequest, setFriendRequest] = useState(incomingFriendRequest)

    const router = useRouter();
    

    const friendRequestHanlder = ({senderId, senderEmail}: IncomingFriendRequest) => {
        setFriendRequest((prev) => [...prev, {senderId, senderEmail}])
    }

    useEffect(() => {
        pusherClient.subscribe(toPuherKey(`user:${sesionId}:incoming_friend_request`));

        pusherClient.bind('incoming_friend_request', friendRequestHanlder);

        return () => {
            pusherClient.unsubscribe(toPuherKey(`user:${sesionId}:incoming_friend_request`));

            pusherClient.unbind('incoming_friend_request', friendRequestHanlder);
        }
    }, [])


    const acceptFriend = async (senderId: string) => {
        await axios.post('/api/friends/accept', {id: senderId});

        setFriendRequest((prev) => prev.filter(req => req.senderId !== senderId));

        router.refresh();
    }

    const denyFriend = async (senderId: string) => {
        await axios.post('/api/friends/deny', {id: senderId});

        setFriendRequest((prev) => prev.filter(req => req.senderId !== senderId));

        router.refresh();
    }

  return (
    <>
        {
            friendRequest.length === 0 ? (<p className='text-sm text-zinc-500'>Nothing to show here...</p>) 
            : (
                friendRequest.map((item) => {
                  return <div key={item.senderId} className='flex gap-4 items-center'>
                        <UserPlus className='text-black'/>
                        <p className=' font-medium text-lg'>{item.senderEmail}</p>
                        <button
                         aria-label='Accept friend' 
                         className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'
                         onClick={() => acceptFriend(item.senderId)}
                         >
                            <Check className=' font-semibold text-white w-3/4 h-3/4'/>
                        </button>
                        <button
                         aria-label='deny friend'
                         className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'
                         onClick={() => denyFriend(item.senderId)}
                         >
                            <X className=' font-semibold text-white w-3/4 h-3/4'/>
                        </button>
                    </div>
                })
            )
        }
    </>
  )
}

export default FriendRequests