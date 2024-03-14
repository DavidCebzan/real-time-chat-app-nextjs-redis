const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;


type Comands = 'zrange' | 'sismember' | 'get' | 'smembers';

export async function fetchRedis(comand: Comands, ...args: (string| number)[]) {

    const commandUrl = `${upstashRedisRestUrl}/${comand}/${args.join('/')}`;

    const response = await fetch(commandUrl,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        }
        )

        if(!response.ok) {
            throw new Error(`Error expecution Redis command: ${response.statusText}`)
        }


        const data = await response.json();

        return data.result
}