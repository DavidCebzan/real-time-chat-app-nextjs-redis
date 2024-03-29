import { fetchRedis } from "@/helpers/redis";
import { authoOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPuherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { z } from "zod";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { email: emailToAdd } = addFriendValidator.parse(body.email);

        const idToAdd = await fetchRedis('get', `user:email:${emailToAdd}`) as string;

        if (!idToAdd) {
            return new Response('This person does not exist.', { status: 400 })
        }

        const session = await getServerSession(authoOptions);

        if (!session) {
            return new Response('Unauthorized', { status: 401 });
        }

        if (idToAdd === session.user.id) {
            return new Response('You can not add yourself as friend', { status: 400 })
        }

        //check if the user is already added
        const isAreadyAdded = (await fetchRedis('sismember', `user:${idToAdd}:incoming_friend_request`, session.user.id)) as 0 | 1

        if (isAreadyAdded) {
            return new Response('Aldready added this user', { status: 400 })
        }

        //is already a friend
        const isAreadyFriend = (await fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd)) as 0 | 1

        if (isAreadyFriend) {
            return new Response('Aldready friend with this user', { status: 400 })
        }

        //notify all clients

        pusherServer.trigger(toPuherKey(`user:${idToAdd}:incoming_friend_request`),
            'incoming_friend_request',
            {
                senderId: session.user.id,
                senderEmail: session.user.email
            }
        )

        //add user

        db.sadd(`user:${idToAdd}:incoming_friend_request`, session.user.id);


        return new Response('Ok')
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', { status: 422 })
        }

        return new Response('Invalid request', { status: 400 })
    }
} 