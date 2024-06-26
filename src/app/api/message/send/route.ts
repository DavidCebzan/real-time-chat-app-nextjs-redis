import { fetchRedis } from "@/helpers/redis";
import { authoOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Message, messageValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import { nanoid } from 'nanoid'
import { pusherServer } from "@/lib/pusher";
import { toPuherKey } from "@/lib/utils";

export async function POST(req: Request) {
    try {
        const { text, chatId }: { text: string, chatId: string } = await req.json();
        const session = await getServerSession(authoOptions);

        if (!session) {
            return new Response('Unauthorized', { status: 401 })
        }

        const [userId1, userId2] = chatId.split('--');

        if (session.user.id !== userId1 && session.user.id !== userId2) {
            return new Response('Unauthorized', { status: 401 })
        }

        const friendId = session.user.id === userId1 ? userId2 : userId1;

        const friendList = await fetchRedis('smembers', `user:${session.user.id}:friends`) as string[];

        const isFriend = friendList.includes(friendId);

        if (!isFriend) {
            return new Response('Unauthorized', { status: 401 })
        }

        const sender = await fetchRedis('get', `user:${session.user.id}`) as string;

        const parsedSender = JSON.parse(sender) as User;

        const timestamp = Date.now();

        const messageData: Message = {
            id: nanoid(),
            senderId: session.user.id,
            text,
            timestamp
        }

        const message = messageValidator.parse(messageData);

        //notify all connected chats
        pusherServer.trigger(
            toPuherKey(`chat:${chatId}`),
            'incoming-message',
            messageData
            )

        pusherServer.trigger(toPuherKey(`user:${friendId}:chats`), 'new_message', {
            ...message,
            senderImg: parsedSender.image,
            senderName: parsedSender.name
        })    

        //send message

        await db.zadd(`chat:${chatId}:messages`, {
            score: timestamp,
            member: JSON.stringify(message)
        });

        return new Response('OK')
    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        }

        return new Response('Internal Server Error', { status: 500 })

    }
}