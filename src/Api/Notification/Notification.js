import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";

const axiosForJSON = axiosInstance('application/json');
const axiosForMultipart = axiosInstance('multipart/form-data');

export function getAlarmsDropdown() {
  const token = getToken()
  return axiosForJSON.get("/alarms/dropdown", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function getCommunicationChannels() {
  const token = getToken()
  return axiosForJSON.get("/communicationChannels/dropdown", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function getUrgencyLevelDropdown() {
  const token = getToken()
  return axiosForJSON.get("/urgencyLevels/dropdown",{
    headers: {
      Authorization : `Bearer ${token}`
    }
  })
} 

export function getAlertTypesDropdown() {
  const token = getToken()
  return axiosForJSON.get("/alertTypes/dropdown",{
    headers: {
      Authorization : `Bearer ${token}`
    }
  })
}

export function getMAMSDropdown() {
  const token = getToken()
  return axiosForJSON.get("/notificationMams/dropdown",{
    headers: {
      Authorization : `Bearer ${token}`
    }
  })
}








// OLD METHODS
export function getReadNotifications(userId) {
  const token = getToken()
  return axiosForJSON.get(`userNotifications/${userId}/readNotifications`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function getUnReadNotifications(userId, tkn) {
  const token = getToken()
  return axiosForJSON.get(`userNotifications/${userId}/unreadNotifications`, {
    headers: {
      Authorization: `Bearer ${token || tkn}`
    }
  })
}

export function getSkippedNotifications(userId) {
  const token = getToken()
  return axiosForJSON.get(`userNotifications/${userId}/skippedNotifications`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


export function updateSingleNotification(payload) {
  const token = getToken()
  return axiosForJSON.post("/userNotifications/updateUserNotification", payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function updateMultipleNotifications(payload) {
  const token = getToken()
  return axiosForJSON.post("/userNotifications/updateUserNotifications", payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function filterNotificationsByDaterange(userId, startDate, endDate) {
  const token = getToken()
  return axiosForJSON.get(`userNotifications/${userId}/filteredNotifications?startDate=${startDate}&endDate=${endDate}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function getFilteredNotifications(userId, filters) {
  const token = getToken()
  return axiosForJSON.get(`userNotifications/${userId}/filteredNotifications`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: filters
  })
}


// New Methods for Notifications 

export function getAllNotificationsAPI() {
  // const token = getToken()
  // return axiosForJSON.get(`userNotifications`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   },
  //   params: filters
  // })
}