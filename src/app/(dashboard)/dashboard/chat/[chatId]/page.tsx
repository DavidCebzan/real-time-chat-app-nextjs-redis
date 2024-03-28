import ChatInput from '@/components/ChatInput'
import Messages from '@/components/Messages'
import { fetchRedis } from '@/helpers/redis'
import { authoOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { messageArrayValidator } from '@/lib/validations/message'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'

interface ChatProps {
  params: {
    chatId: string
  }
}


async function getInitialMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis('zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    )

    const dbMessages = results.map((message) => JSON.parse(message) as Message);

    const resversedMessages = dbMessages.reverse();

    const messages = messageArrayValidator.parse(resversedMessages);

    return messages;
  } catch (error) {
    notFound()
  }
}

async function Chat({ params }: ChatProps) {

  const { chatId } = params

  const session = await getServerSession(authoOptions);

  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatId.split('--');

  if (user.id !== userId1 && user.id !== userId2) {
    notFound()
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;

  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;

  const initialMessages = await getInitialMessages(chatId);

  return (
    <div
      className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'
    >
      {/* contact info */}
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          {/* Image */}
          <div className='relative'>
            <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
              <Image
                fill
                referrerPolicy='no-referrer'
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className='rounded-full'
              />
            </div>
          </div>

          {/* name and email */}
          <div className='flex flex-col leading-tight'>

            <div className='text-xl flex items-center'>
              <span
                className='text-gray-700 mr-3 font-semibold'
              >{chatPartner.name}</span>
            </div>

            <span className='text-sm text-gray-600'>
              {chatPartner.email}
            </span>
          </div>

        </div>

      </div>


      <Messages sessionUserId={session.user.id} initialMessage={initialMessages}/>
      <ChatInput chatPartner={chatPartner} chatId={chatId}/>
    </div>
  )
}

export default Chat;