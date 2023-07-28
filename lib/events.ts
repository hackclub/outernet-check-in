export const Events = {
    async stageGroup (computerNumber: 1|2|3|4, membersIds: string[], pod: string) {
        const response = await fetch(`/api/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventName: "group.stage",
                elements: [computerNumber, pod, ...membersIds]
            })
        });
        return await response.json();
    },
    async checkInGroup (membersIds: string[], pod: string) {
        const response = await fetch(`/api/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventName: "group.checkin",
                elements: [pod, ...membersIds]
            })
        });
        return await response.json();
    },
    async nuke () {
        const response = await fetch(`/api/events`, {
            method: "DELETE"
        });
        return await response.json();
    },
    async read () {
        const response = await fetch(`/api/events`);
        return await response.json();
    }
}

export default Events;