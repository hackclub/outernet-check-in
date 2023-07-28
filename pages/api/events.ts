import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from "@vercel/kv";

async function write (eventName: "group.stage" | "group.checkin", elements: string[]) {
    const timestamp = Date.now();
    const record = {
        timestamp,
        eventName,
        elements
    };

    return await kv.lpush('events', JSON.stringify(record));
}

async function read () {
    return await kv.lrange('events', 0, -1);
}

export default async(req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        const events = await read();
        return res.status(200).json(events);
    }

    if (req.method === "POST") {
        const { eventName, elements } = req.body;
        await write(eventName, elements);
        return res.status(200).json({ eventName, elements });
    }

    if (req.method === "DELETE") {
        await kv.del('events');
        return res.status(200).json(await read());
    }
}
