import { fetchRedis } from "./redis";

export async function getFriendsByUserId(userId: string) {

    //get all the friends

    const friendsIds = await fetchRedis('smembers', `user:${userId}:friends`) as string[];


    const friends = await Promise.all(
        friendsIds.map(async (friendId) => {
            const friend = await fetchRedis('get', `user:${friendId}`) as string;
            const parsedFreind = JSON.parse(friend) as User;

            return parsedFreind;
        })
    )

    return friends;

}