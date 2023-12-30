
import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";
const axiosForJSON = axiosInstance("application/json");

export function getAllTasksAPI() {
    const token = getToken();
    return axiosForJSON.get(`workorders/tasks`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}