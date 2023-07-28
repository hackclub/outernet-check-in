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
    const res = await fetch(`${process.env.URL}/api/records`);
    const records = await res.json() as Record[];

    return records;
}