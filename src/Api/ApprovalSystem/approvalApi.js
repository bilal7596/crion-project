import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";

const axiosForJSON = axiosInstance('application/json');
const axiosForMultipart = axiosInstance('multipart/form-data');

export function getApprovalStatusDropdown () {
  const token = getToken()
  return axiosForJSON.get(`/approvals/approvalStatus`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
}

export function getFilteredApprovals (userId,filters) {
    const token = getToken()
    return axiosForJSON.get(`userApprovals/${userId}/filteredApprovals`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params:filters
      })
}

export function approveSingleUserChange (payload) {
  const token = getToken()
  return axiosForJSON.post(`userApprovals/updateUserApproval`,payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}

export function approveMultipleUserChanges (payload) {
  const token = getToken()
  return axiosForJSON.post(`userApprovals/updateUserApprovals`,payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}