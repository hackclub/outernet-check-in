import { NextApiRequest, NextApiResponse } from 'next';

export default async(req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        try {
            const podCount = await fetch("/records").then((res) => res.json());
            return res.status(200).json(podCount);
        } catch (error)  {
            
        }
    }
}