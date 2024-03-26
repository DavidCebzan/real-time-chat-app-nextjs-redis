import { fetchRedis } from "@/helpers/redis";
import { authoOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        const {id: idToAdd} = z.object({id: z.string()}).parse(body);

        const session = await getServerSession(authoOptions);

        if(!session) {
            return new Response('Unauthorised', {status: 401})
        }

        //verify both user are not already friends

        const isAlreadyFried = await fetchRedis('sismember', 
        `user:${session.user.id}:friends`,
        idToAdd
        )

        if(isAlreadyFried) {
            return new Response('Already Firends', {status: 400});
        }

        const hasFriendRequest = await fetchRedis('sismember', 
        `user:${session.user.id}:incoming_friend_request`,
        idToAdd,
        )

        if(!hasFriendRequest) {
            return new Response('No friend request', {status: 400})
        }

        await db.sadd(`user:${session.user.id}:friends`, idToAdd);

        await db.sadd(`user:${idToAdd}:friends`, session.user.id);

        // await db.srem(`user:${idToAdd}:incoming_friend_request`, session.user.id);

        await db.srem(`user:${session.user.id}:incoming_friend_request`, idToAdd);


        return new Response('OK');
        
    } catch (error) {
        
        if (error instanceof z.ZodError) {
            return new Response('Invali request payload', {status: 422});
        }

        return new Response('Ivalid request', {status: 400})
    }
}