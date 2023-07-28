import { useEffect, useState } from "react";
import { Record } from "./record";
import Events from "./events";

export default function useRecords ({ serverRecords, speedy = false }: { speedy?: boolean, serverRecords: Record[] }): [Record[], number] {
    const [records, setRecords] = useState<Record[]>(serverRecords);
    const [eventTimestamp, setEventTimestamp] = useState(Date.now());

    useEffect(() => {
        (window as any).Events = Events;
        const interval = setInterval(async () => {
            const events = await Events.read();
            setEventTimestamp(lastTimestamp => {
                const latestEvents = events.filter((event: any) => event.timestamp > lastTimestamp);

                console.log({ latestEvents });

                for (const { elements, eventName } of latestEvents) {
                    if (eventName == "group.checkin") {
                        const [pod, ...membersIds] = elements;
                        setRecords(records => records.map((record) => {
                            if (membersIds.includes(record.id)) {
                                return {
                                    ...record,
                                    checkedIn: true,
                                    pod
                                };
                            }

                            return record;
                        }));
                    }
                }

                return Math.max(latestEvents.reduce((lastTimestamp: number, event: any) => lastTimestamp > event.timestamp ? lastTimestamp : event.timestamp, lastTimestamp), Date.now() - 1000);
            });
        }, speedy ? 1000 : 5000);

        return () => clearInterval(interval);
    }, []);

    return [records, eventTimestamp];
}

export async function getServerRecords () {
    let records: Record[] = [];

    try {
        const fetchPage = async (offset: string) => {
            const pageSize = 100;
            const response = await fetch(`https://api.airtable.com/v0/applfCora9qnm274A/Main?offset=${offset}&pageSize=${pageSize}&fields[]=ID&fields[]=Name&fields[]=Pod&fields[]=Club%20Leader%3F&fields[]=Checked%20In%3F`, {
                headers: {
                    Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
                }
            }).then((res) => res.json());

            const records: Record[] = (response.records || []).map((record: any) => ({
                id: record.id,
                name: record.fields["Name"] || "",
                pod: record.fields["Pod"] || "",
                isLeader: record.fields["Club Leader?"] || "",
                checkedIn: record.fields["Checked In?"] || ""
            }));

            return { records, offset: response.offset };
        }
        
        let offset: string | undefined;

        do {
            const response = await fetchPage(offset || "");
            records.push(...response.records);
            offset = response.offset;
        } while (offset);
    } catch (error) {
        console.log(error);
    }

    return records;
}