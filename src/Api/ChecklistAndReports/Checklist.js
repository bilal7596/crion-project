import { getToken } from "../../utils/clonosCommon";
import axios from 'axios';
import { axiosInstance } from "../AxioClient";
import { localConfigs } from "../../config/local.config";

const axiosForJSON = axiosInstance("application/json");
console.log('axiosForJSON:', axiosForJSON)
const axiosForMultipart = axiosInstance("multipart/form-data");

export const saveChecklistGeneralDetails = (payload) => {
  const token = getToken();
  return axiosForJSON.post("/checklists", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editChecklistGeneralDetailsAPI = (payload) => {
  console.log('payload:', payload)
  const token = getToken();
  return axiosForJSON.put("checklists/edit", { ...payload.payload }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createChecklistFromStaging = (payload) => {
  const token = getToken();
  return axiosForJSON.post("/checklists/stagings", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// This Api is getting use to save checklist as template.

export const saveChecklistDataSets = ({ checklistId, payload }) => {
  const token = getToken();
  return axiosForJSON.post(`/checklists/${checklistId}/dataSets`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

// This Api is getting use to create the form template for chechlist forms.
export const getChecklistAPI = () => {
  const token = getToken();
  return axiosForJSON.get("/checklists?assignee=1&team=1", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// This Api is getting use to delete the checklists.
export const deleteChecklistAPI = (props) => {
  const token = getToken();
  return axiosForJSON.put("/checklists/delete", props, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// This Api is getting use to get single checklist details.
export const getSingleChecklistAPI = ({ checklistId, optionalParams }) => {
  const token = getToken()
  return axiosForJSON.get(`/checklists/${checklistId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: optionalParams
  });
}
// This Api is getting use to get single checklist details.
export const getSingleChecklistDataSetsAPI = ({ checklistId, optionalParams }) => {
  console.log('optionalParams:', optionalParams)
  const token = getToken()
  return axiosForJSON.get(`checklists/${checklistId}/dataSets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: optionalParams
  });
}



export const changeChecklistStatusAPI = ({ checklistId, payload }) => {
  const token = getToken()
  return axiosForJSON.put(`checklists/changeStatus/${checklistId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
}

export const createValidateRequestsAPI = ({ checklistId }) => {
  const token = getToken()

  const apiUrl = `${localConfigs.url}/api/v1/checklists/requestValidation/${checklistId}`; // Replace with your API endpoint
  console.log('getToken:', getToken)
  const payload = { status: "completed" }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Set the content type based on your API's requirements
      // Add any other headers if needed
      Authorization: `Bearer ${token}`
    },
  };
  return fetch(apiUrl, requestOptions)
}


export const getValidateRequestsAPI = ({ checklistId }) => {
  const token = getToken()
  return axiosForJSON.get(`checklists/requestValidation/${checklistId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
}




export const approveTheValidateRequestAPI = ({ requestId, payload }) => {
  const apiUrl = `${localConfigs.url}/api/v1/checklists/aprroveValidateRequest/${requestId}`
  const token = getToken()


  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Set the content type based on your API's requirements
      // Add any other headers if needed
      Authorization: `Bearer ${token}`

    },
    body: JSON.stringify(payload),

  };

  return fetch(apiUrl, requestOptions)

}



