import { Record } from "@/lib/record";
import useRecords, { getServerRecords } from "@/lib/useRecords";
import { useEffect, useState } from "react";

interface Counts {
    checkedIn: number;
    notCheckedIn: number;
    total: number;
}

function userCounts (records: Record[]): Counts {
    const recordsCheckedIn = records.filter((record: Record) => record.checkedIn).length;
    const recordsNotCheckedIn = records.filter((record: Record) => !record.checkedIn).length;

    return {
        checkedIn: recordsCheckedIn,
        notCheckedIn: recordsNotCheckedIn - 140,
        total: records.length
    };
}

export default function TV ({ serverRecords }: any) {
    const [records] = useRecords({ serverRecords });

    useEffect(() => {
        (window as any).live = {
            records,
            serverRecords
        };
    }, [records]);

    const data = userCounts(records);

    const percentage = data.checkedIn / 150;
    const color1 = "#09ce6b";
    const color2 = "#fff";

    const gradientString = `linear-gradient(to right, ${color1} 0%, ${color1} ${percentage * 100}%, ${color2} ${percentage * 100}%, ${color2} 100%)`;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: gradientString,
            width: '100vw',
            height: '100vh',
            position: 'absolute',
            top: '0px',
            left: '0px',
            zIndex: 900,
        }}>
            <h1 style={{
                fontSize: '20rem',
                margin: '0px',
                marginBottom: '-60px'
            }}>{data.checkedIn}</h1>
            <h1>Hackers @ Outernet</h1>
            {data.checkedIn <= 130 && <h1 style={{
                position: 'absolute',
                bottom: '0px',
                right: '0px',
                zIndex: 1000,
                margin: '16px',
                lineHeight: '2.5rem'
            }}>150</h1>}
            <h1 style={{
                position: 'absolute',
                bottom: '0px',
                left: '0px',
                zIndex: 1000,
                margin: '16px',
                lineHeight: '2.5rem'
            }}>{data.checkedIn}</h1>
            <h1 style={{
                position: 'absolute',
                bottom: '0px',
                right: `calc(${100 - (percentage * 100)}%)`,
                zIndex: 1000,
                margin: '16px',
                lineHeight: '2.5rem'
            }}>{Math.round(percentage * 100)}%</h1>
            
        </div>
    )
}

export async function getServerSideProps() {
    return {
        props: {
            serverRecords: await getServerRecords()
        }
    };
}