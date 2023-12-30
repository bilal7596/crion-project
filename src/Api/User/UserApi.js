import { loginAxiosClient, axiosInstance } from "../AxioClient";
import { getToken, getUser } from "../../utils/clonosCommon";
import axios from "axios";

const axiosForJSON = axiosInstance("application/json");
const axiosForMultipart = axiosInstance("multipart/form-data");
export function loginUser(payload) {
  return loginAxiosClient.post("/auth/login", payload, {
    userId: "haresh"
  });
}

export function logoutAccount(payload) {
  return axiosForJSON.post("/auth/logout", payload);
}

export function reAuth(payload) {
  const token = getToken();
  return loginAxiosClient.post("/auth/reauth", payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function reqResetPass(payload) {
  const token = getToken();
  return loginAxiosClient.post("/auth/password_reset", payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getCountryDetails() {
  const token = getToken();
  return axios.get("https://ipapi.co/json/", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getAllTeams() {
  const token = getToken();
  return axiosForJSON.get("/teams/getTeams", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getAllUsers() {
  const token = getToken();
  return axiosForJSON.get("/admin/listusers/1", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function searchUsers(payload) {
  const token = getToken();
  return axiosForJSON.get(`/admin/listusers/1?search=${payload}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function createUser(payload) {
  const token = getToken();
  console.log(token, "from api")
  return axiosForMultipart.post("/admin/createuser/", payload), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}
export function createBulkUsers(payload) {
  const token = getToken();
  return axiosForJSON.post("/admin/createbulkusers", payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function changeAccountStatus(payload) {
  const token = getToken();
  return axiosForJSON.post("/admin/changeUserStatus", payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function editUser(payload) {
  const token = getToken();
  return axiosForMultipart.put("/admin/editUser", payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function deleteUser(payload) {
  const token = getToken();
  return axiosForJSON.delete("/admin/deleteuser/", { data: payload }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getUserFilters() {
  const token = getToken();
  return axiosForJSON.get("/admin/filterLists", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function postUserFilters(payload) {
  const token = getToken();
  return axiosForJSON.post("/admin/filteredUsers", payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function getLocations() {
  const token = getToken();
  return axiosForJSON.get("/locations/getlocations", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function getDesignations() {
  const token = getToken();
  return axiosForJSON.get("/designations/getdesignations", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function getUserSessions(payload) {
  const token = getToken();
  return axiosForJSON.get(`/auth/getsessions/${payload}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getAllRoles() {
  const token = getToken();
  return axiosForJSON.get(`/roles/getRoles`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function assignRole(payload) {
  const token = getToken();
  return axiosForJSON.post(`/userRole/assignRole`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function getAssignedRoles(userId) {
  const token = getToken();
  return axiosForJSON.get(`/userRole/getAssignedUserRole/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export function getRoleById(payload) {
  const token = getToken();
  return axiosForJSON.post("/roles/getRole", payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export function getAllPermissions() {
  const token = getToken();
  return axiosForJSON.get(`/permission/getPermissions`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getUserPermissions({ userId, token }) {
  return axiosForJSON.get(`/userrolepermissions/getUserPermissions/${userId}`, {
    headers: {
      Authorization: `Bearer ${token || getToken()}`
    }
  });
}
export function getAllUserPermissions() {
  const token = getToken();
  return axiosForJSON.get(`/userrolepermissions/getAllUsersAndPermission/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function postAssignPermission(payload) {
  const token = getToken();
  return axiosForJSON.post(`userrolepermissions/editPermissions`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function filterPermissions(payload) {
  const token = getToken();
  return axiosForJSON.post(`userrolepermissions/filterUserAndPermissions`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function filterRoles(payload) {
  const token = getToken();
  return axiosForJSON.post(`userRole/filterUserAndRole`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function postAuditLog(payload) {
  const token = getToken();
  // console.log("postAuditLog getUser", getUser());
  const loginDetails = getUser();
  const currentDate = new Date();
  return axiosForJSON.post("/logs/auditlog", {
    email: loginDetails?.email,
    action: payload.action,
    message: payload.message,
    timestamp: currentDate,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function usersDropdownAPI(teamId) {
  const token = getToken();
  return axiosForJSON.get(`admin/getUsersByTeam/${teamId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function teamsDropdownAPI() {
  const token = getToken();
  return axiosForJSON.get(`teams/getTeams`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getAllUsersDropdownAPI() {
  const token = getToken();
  return axiosForJSON.get(`/admin/userDropdown`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}