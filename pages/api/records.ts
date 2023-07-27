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
            const resp = await fetch(`https://api.airtable.com/v0/applfCora9qnm274A/Main/rec25ZxwTyfwJj8EO`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
                contentType: "application/json",
            },
            body: JSON.stringify({
                "fields": {
                    pod: "Red",
                    checkedIn: true,
                }
            }),
        })
            const data = await resp.json();
            console.log(data);
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
    }
}
