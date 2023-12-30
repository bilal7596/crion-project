import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";

const axiosForJSON = axiosInstance('application/json');
const axiosForMultipart = axiosInstance('multipart/form-data');
export function getAllForms () {
    const token = getToken()
    return axiosForJSON.get("/forms/listforms", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
}

export function createForm (payload) {
    const token = getToken()
    return axiosForJSON.post("/forms/createform",payload, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
}
export function deleteForm(payload) {
    const token = getToken()
    return axiosForJSON.delete("/forms/deleteform",{ data: payload }, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
}
export function getForm(payload) {
    const token = getToken()
    return axiosForJSON.get(`/forms/getform/${payload}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
}
export function getTemplateDatas(payload) {
    const token = getToken()
    return axiosForJSON.get(`/forms/getformdatas?docId=${payload}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
}
export function editTemplate(payload) {
    const token = getToken()
    return axiosForJSON.put("/forms/editform", payload, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
}
