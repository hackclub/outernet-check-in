import Airtable from 'airtable';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const response = fetch({`https://api.airtable.com/${process.env.AIRTABLE_BASE_ID}`})
    }
}
