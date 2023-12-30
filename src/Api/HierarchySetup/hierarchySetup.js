import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";

const axiosForJSON = axiosInstance('application/json');
const axiosForMultipart = axiosInstance('multipart/form-data');

export function getUserApprovalList (userId) {
    const token = getToken()
    return axiosForJSON.get(`/hierarchies/hierarchiesList/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
}

export function getUsersList () {
  const token = getToken()
  return axiosForJSON.get(`admin/userDropdown`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}

export function assignSupervisor (payload) {
    const token = getToken()
    return axiosForJSON.post("/hierarchies",payload, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
}

export function getAllHierarchies () {
  const token = getToken()
  return axiosForJSON.get(`/hierarchies`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}

export function getFilterdHierarchies (payload) {
  const token = getToken()
  return axiosForJSON.post(`/hierarchies/filteredHierarchies`,payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}