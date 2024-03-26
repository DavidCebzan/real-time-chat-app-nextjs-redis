import { fetchRedis } from '@/helpers/redis'
import { authoOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { messageArrayValidator } from '@/lib/validations/message'
import { getServerSession } from 'next-auth'
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
    <div>{params.chatId}</div>
  )
}

export default Chat;