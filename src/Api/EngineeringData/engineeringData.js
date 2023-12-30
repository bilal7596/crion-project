import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";

const axiosForJSON = axiosInstance("application/json");
const axiosForMultipart = axiosInstance("multipart/form-data");
export function getAllEngData() {
  const token = getToken()
  return axiosForJSON.get(`engineeringData/all`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
}

export function getFilteredEngData(payload) {
  const token = getToken()
  return axiosForJSON.post(`engineeringData/filteredEngineeringData`,payload, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
}

export function createNewEngFields(payload) {
  const token = getToken()
  return axiosForJSON.post(`engineeringData`,payload, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
}

export function updateEngineerData(payload) {
  const token = getToken()
  return axiosForJSON.put(`engineeringData/`, payload, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
}

export function deleteEngineerData(payload) {
  const token = getToken()
  return axiosForJSON.put(`engineeringData/delete/`, payload, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
}

  export function getEngineeringDataOfAsset(param) {
    const token = getToken()
    return axiosForJSON.get(`engineeringData/engineeringDataAsset/${param}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
  
}
