import { allUsers } from "../constants";

const calculateTwoPointerStatusAdmin = async (day: number) => {
    const finStatus: { username: string; status: string }[] = [];

    const fetchStatusForUser = async (username: string) => {
        const sendData = { username, day };
        try {
            const response = await fetch(
                `${process.env.BACKEND_URL}/admin/get-two-pointer-status`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(sendData),
                }
            );
            const repData: any = await response.json();
            let { dayYesterday, dayBeforeYesterday } = repData.data;

            dayYesterday = dayYesterday === "" ? "no" : dayYesterday;
            dayBeforeYesterday =
                dayBeforeYesterday === "" ? "no" : dayBeforeYesterday;
            const status =
                dayYesterday === "gateway" && dayBeforeYesterday === "gateway"
                    ? "duck"
                    : dayYesterday === "gateway" && dayBeforeYesterday === "no"
                    ? "duck"
                    : dayYesterday === "no" && dayBeforeYesterday === "gateway"
                    ? "crab"
                    : "cross";

            return { username, status };
        } catch (error) {
            console.error(`Error fetching status for user ${username}:`, error);
            return null;
        }
    };

    // Fetch statuses for all users
    const userStatuses = await Promise.all(allUsers.map(fetchStatusForUser));

    // Filter out any null results and add to finStatus
    userStatuses
        .filter((status: any) => status !== null)
        .forEach((status: any) =>
            finStatus.push(status as { username: string; status: string })
        );
    return finStatus;
};

export default calculateTwoPointerStatusAdmin;
