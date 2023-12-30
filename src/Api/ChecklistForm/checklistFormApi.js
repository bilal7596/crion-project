

import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";

const axiosForJSON = axiosInstance("application/json");
const axiosForMultipart = axiosInstance("multipart/form-data");

// This Api is getting use to create the form template for chechlist forms
export function createChecklistForm(payload) {
  const token = getToken()
  return axiosForJSON.post("/forms/createform", payload, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
}

export function getAllChecklistForms () {
  const token = getToken()
  return axiosForJSON.get("/forms/listforms", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
}

/**
 * This function is getting use to save the dynamic forms records
 * @param {*} payload It contains the record of the dynamic form 
 * @returns  It returns the promise which we have resolve
 */
export function saveFormData (payload) {
  const token = getToken()
  return axiosForJSON.post("/forms/saveform", payload, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})

}
export function getSavedDocData (assetId, formId) {
  const token = getToken()
  return axiosForJSON.get(`/forms/getformdatas?assetId=${assetId}&formId=${formId}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
}
// export function createDynamicForm(payload) {
//   console.log('payload:', payload)
//   const token = getToken()
//   return axiosForJSON.post("/forms/createdynamicform", payload, {
//   headers: {
//     Authorization: `Bearer ${token}`
//   }
// });
// }



/**
 * This api is getting use to get all the dynamic forms details
 * @returns It returns the promise which we have resolve
 */
// export function getAllDynamicForms () {
//   const token = getToken()
//   return axiosForJSON.get("forms/listDynamicForms", {
//   headers: {
//     Authorization: `Bearer ${token}`
//   }
// })
// }



// export function createForm (payload) {
//   return axiosForJSON.post("/forms/createform",payload)
// }
// export function deleteForm(payload) {
//   return axiosForJSON.delete("/forms/deleteform",{ data: payload })
// }
// export function getForm(payload) {
//   return axiosForJSON.get(`/forms/getform/${payload}`)
// }
// export function getTemplateDatas(payload) {
//   return axiosForJSON.get(`/forms/getformdatas?docId=${payload}`)
// }
// export function editTemplate(payload) {
//   return axiosForJSON.put("/forms/editform", payload)
// }