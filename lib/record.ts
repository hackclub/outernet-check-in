export interface Record {
    id: string;
    name: string;
    pod: string;
    isLeader: boolean;
    checkedIn: boolean;
    renderedName?: any;
}