import { NextApiRequest, NextApiResponse } from 'next';

/*
    - User ID
    - User Name
    - User pod
    - Whether a user is a leader or not
    - Whether a user is checked in or not
*/

export default async(req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        try {
            const response = await fetch("https://api.airtable.com/v0/applfCora9qnm274A/Main", {
            headers: {
                Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
            }
        }).then((res) => res.json())
        return res.status(200).json(response);
        } catch (error) {
            console.log(error);
        }
    }

    if (req.method === "PATCH") {
        try {
            await fetch(`https://api.airtable.com/v0/applfCora9qnm274A/Main/${req.body.id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
                contentType: "application/json",
            },
            body: JSON.stringify({
                "fields": {
                    "pod": req.body.pod,
                    "checkedIn": true,
                }
            }),
        })
        return res.status(200).json("Grazzi mile!");
        } catch (error) {
            console.log(error);
        }
    }
}
