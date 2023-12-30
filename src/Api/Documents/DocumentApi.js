import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";

const axiosForJSON = axiosInstance("application/json");
const axiosForMultipart = axiosInstance("multipart/form-data");

export function getDocumentTypesDropdown() {
  const token = getToken()
  return axiosForJSON.get(`/documents/getDocumentType`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}


export function uploadAssociateDocs(payload) {
  const token = getToken()
  return axiosForMultipart.post("/assetDocuments", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}


export function editAssociateDocs(payload) {
  const token = getToken()
  return axiosForMultipart.put("/assetDocuments/edit", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}





export function getDocumentsAssociatedWithAsset(id) {
  const token = getToken()
  return axiosForMultipart.get(`/documents/getDocuments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}


export function getAllAssoDocs(payload) {
  const token = getToken()
  return axiosForJSON.get(`document/list/${payload}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function getAllAssoDocsAndForms(payload) {
  const token = getToken()
  return axiosForJSON.get(`asset/listAssociatedDocsnForms/${payload}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function deleteDoc(payload) {
  const token = getToken()
  return axiosForJSON.put(`document/changeIsDeleted`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function viewDoc(payload) {
  const token = getToken()
  return axiosForJSON.get(`document/${payload}?&mode=view`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function downloadDoc(payload) {
  const token = getToken()
  return axiosForJSON.get(`document/${payload}/download`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function getAllDocs() {
  const token = getToken()
  return axiosForJSON.get(`document/getalldocs/list`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function addDoc(payload) {
  const token = getToken()
  return axiosForJSON.post("/asset/add-document", payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export function getDocumentFilters() {
  const token = getToken()
  return axiosForJSON.get(`/document/getalldocs/filterLists`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function postDocumentFilters(payload) {
  const token = getToken()
  return axiosForJSON.post(`/document/filteredDocuments`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
export function getAllDocuments() {
  const token = getToken()
  return axiosForJSON.get("document", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// New APIs for Documents 

// To get the data of all the possible type of documents (Dropdowns).
export function getDocumentTypesDropdownAPI() {
  const token = getToken()
  return axiosForJSON.get("documents/getDocumentType", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// To get the data of all the possible status of documents (Dropdowns).
export function getDocumentsStatusDropdownAPI() {
  const token = getToken()
  return axiosForJSON.get("approvals/approvalStatus", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// To Delete the document (Single Document Delete).
export function deleteSingleDocumentAPI({ docId }) {
  const token = getToken()
  return axiosForJSON.delete(`documents/delete/${docId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// To Delete the document in the bulk or (Multiple Document Delete).
export function deleteMultipleDocumentAPI({ payload }) {
  console.log('payload:', payload)

  const token = getToken()
  return axiosForJSON.put(`documents/deleteMultiple`, { 'docIds': payload }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function getDocumentAPI({ payload, limit, offset }) {
  const token = getToken()
  return axiosForJSON.post(`documents/getDocuments/${limit}/${offset}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export function downloadDocumentAPI({ docId }) {
  const token = getToken()
  return axiosForJSON.get(`documents/download/${docId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}