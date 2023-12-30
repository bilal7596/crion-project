import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";

const axiosForJSON = axiosInstance('application/json');
const axiosForMultipart = axiosInstance('multipart/form-data');
export function getAllSchedules() {
    const token = getToken()
    return axiosForJSON.get("/alarms/listjobs", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
}
export function createAlarm(payload) {
    const token = getToken()
    return axiosForJSON.post("/alarms/schedulejob", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
}
export function deleteSchedule(payload) {
    const token = getToken()
    return axiosForJSON.delete("/alarms/removejob",{ data: payload }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
}

export function stopSchedule(payload) {
    const token = getToken()
    return axiosForJSON.post("/alarms/stopjob",payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
}