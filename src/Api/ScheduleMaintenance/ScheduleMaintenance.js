import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";
const axiosForJSON = axiosInstance("application/json");

export function saveAsDraftOrCreateMaintenanceTask(payload) {
    const token = getToken();
    return axiosForJSON.post(`/scheduleMaintenance/`,payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function getScheduledMaintenanceDetails(maintenanceTaskId) {
    const token = getToken();
    return axiosForJSON.get(`/scheduleMaintenance/${maintenanceTaskId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function getAllScheduledMaintenanceOfAsset(assetId) {
    const token = getToken();
    return axiosForJSON.get(`/scheduleMaintenance/lists/${assetId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function deleteScheduledMaintenancePlan(payload) {
    const token = getToken();
    return axiosForJSON.put(`/scheduleMaintenance/delete`,payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
