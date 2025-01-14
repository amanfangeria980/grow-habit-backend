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

            // Convert empty strings to "no"
            dayYesterday = dayYesterday === "" ? "no" : dayYesterday;
            dayBeforeYesterday =
                dayBeforeYesterday === "" ? "no" : dayBeforeYesterday;

            // Helper function to check valid status
            const isValidStatus = (status: string) =>
                ["gateway", "plus", "elite"].includes(status);

            // Determine status based on conditions
            const status =
                (isValidStatus(dayYesterday) &&
                    isValidStatus(dayBeforeYesterday)) ||
                (isValidStatus(dayYesterday) && dayBeforeYesterday === "no")
                    ? "duck"
                    : dayYesterday === "no" && isValidStatus(dayBeforeYesterday)
                    ? "crab"
                    : "cross";

            return { username, status };
        } catch (error) {
            console.error(`Error fetching status for user ${username}:`, error);
            return null;
        }
    };

    // Fetch statuses for all users in parallel
    const userStatuses = await Promise.all(allUsers.map(fetchStatusForUser));

    // Filter out null results and add valid statuses
    userStatuses
        .filter(
            (status): status is { username: string; status: string } =>
                status !== null
        )
        .forEach((status) => finStatus.push(status));

    return finStatus;
};

export default calculateTwoPointerStatusAdmin;
