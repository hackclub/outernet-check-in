import { NextApiRequest, NextApiResponse } from 'next';
import { Record } from '@/lib/record';
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
            const fetchPage = async (offset: string) => {
                const pageSize = 100;
                const response = await fetch(`https://api.airtable.com/v0/applfCora9qnm274A/Main?offset=${offset}&pageSize=${pageSize}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
                    }
                }).then((res) => res.json());

                const records: Record[] = (response.records || []).map((record: any) => ({
                    id: record.id,
                    name: record.fields["Name"],
                    pod: record.fields["Pod"],
                    isLeader: record.fields["Club Leader?"],
                    checkedIn: record.fields["Checked In?"]
                }));

                return { records, offset: response.offset };
            }
            
            const records: Record[] = [];
            let offset: string | undefined;

            do {
                const response = await fetchPage(offset || "");
                records.push(...response.records);
                offset = response.offset;
            } while (offset);

            return res.status(200).json(records);
        } catch (error) {
            console.log(error);
        }
    }

    if (req.method === "PATCH") {
        try {
            const checkIn = async (id: string, pod: string) => {
                const resp = await fetch(`https://api.airtable.com/v0/applfCora9qnm274A/Main/${id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fields: {
                            "Pod": pod,
                            "Checked In?": true
                        }
                    })
                });
                console.log({bar:await resp.json()});
                return resp.ok;
            }

            const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
            let failed = false;

            for (let i = 0; i < req.body.ids.length; i++) {
                const id = req.body.ids[i];
                const isLast = i === req.body.ids.length - 1;

                const status = await checkIn(id, req.body.pod);
                if (!status) failed = true;

                if (!isLast) await sleep(220);
            }
            
            if (!failed) {
                return res.status(200).json(true);
            } else {
                return res.status(500).json(false);
            }
        } catch (error) {
            console.log(error);
            console.log("PATCH ERROR")
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}