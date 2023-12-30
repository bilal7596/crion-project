import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";

const axiosForJSON = axiosInstance("application/json");
const axiosForMultipart = axiosInstance("multipart/form-data");
const token = getToken();
export function createAsset(payload) {
  const token = getToken();
  return axiosForMultipart.post("/assets", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
}


export function getAssetTypes() {
  const token = getToken();
  return axiosForJSON.get("/assets/assetTypes/dropdown", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}

export function getCriticalityDropdown() {
  const token = getToken();
  return axiosForJSON.get("/assets/criticalityLevel", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function editAsset(payload) {
  console.log(payload, "from api")
  const token = getToken();
  return axiosForMultipart.put("/assets/edit", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAllAssets(page, limit) {
  const token = getToken();
  return axiosForJSON.get("/assets/page", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit
    },
  })
}

export function getAllAssetsWithoutLimit({ optionalParams }) {
  const token = getToken()
  return axiosForJSON.get("/assets", {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: optionalParams
  })
}

export function getFilteredAssets({ page, limit, payload, optionalParams }) {
  const token = getToken();
  return axiosForJSON.post("/assets/paginatedSearch", payload, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      ...optionalParams,
      page,
      limit
    }
  })
}

export function getexportableData(filters, optionalParams) {
  const token = getToken();
  console.log(token, "token search")
  return axiosForJSON.post("/assets/search", filters, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: optionalParams
  })
}

export function getAssetHierarchy(assetId) {
  const token = getToken();
  return axiosForJSON.get(`/assets/assetId/${assetId}/hierarchy`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      web: 1
    }
  })
}

export function getSingleAssetHierarchy(assetId) {
  const token = getToken();
  return axiosForJSON.get(`/assets/assetId/${assetId}/nestedChildrenAssets`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  })

}

export function getWorkOrdersAssociatedWithAsset(assetId) {
  const token = getToken();
  return axiosForJSON.get(`/workorders/${assetId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
}

export function createReferenceManualForAsset(assetId, payload) {
  const token = getToken();
  return axiosForMultipart.post(`assets/${assetId}/referenceManuals`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
}


export function getReferenceManualForAsset(assetId, referenceManualsOptionalParams) {
  const token = getToken();
  return axiosForJSON.get(`assets/${assetId}/referenceManuals`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: referenceManualsOptionalParams
  })
}




// export function getAllAssets() {
//   const token = getToken();
//   return axiosForJSON.get("assets", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }

export function getSingleAsset(id, optionalParams) {
  const token = getToken();
  return axiosForJSON.get(`/assets/assetId/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: optionalParams
  });
}

export function getAssetDocuments(assetId) {
  const token = getToken();
  return axiosForJSON.get(`/assetDocuments/list/${assetId}?status=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getDocumentsListOfAssetCategory(id) {
  const token = getToken();
  return axiosForJSON.get(`/assetCategoryDocuments/assetCategory/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function getAssetLevelDropdown() {
  const token = getToken();
  return axiosForJSON.get(`/assets/assetLevelDropdown`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getFilteredAssetLevelDropdown(payload) {
  const token = getToken();
  return axiosForJSON.get(`/assets/assetLevelDropdown`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: payload
  });
}

export function createBulkAssets(payload) {
  const token = getToken();
  return axiosForJSON.post("/assets/createbulkassets", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export function getAssetFilters() {
  const token = getToken();
  return axiosForJSON.get("/assets/filterLists", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export function postAssetFilters(payload) {
  const token = getToken();
  return axiosForJSON.post("/assets/filteredAssets", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function deleteAsset(payload) {
  const token = getToken();
  return axiosForJSON.put("/assets/delete", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export function downloadAssetTemp() {
  const token = getToken();
  return axiosForJSON.get("asset/assetsfile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export function getAllAssetImageDetails() {
  const token = getToken();
  return axiosForJSON.get("asset/allAssetImageDetails", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export function getAllAssetLayoutImageDetails() {
  const token = getToken();
  return axiosForJSON.get("asset/allAssetLayoutImageDetails", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export function getLongDesc(payload) {
  const token = getToken();
  return axiosForJSON.get(`dynamicDescription/getlongdescription/${payload}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAssetDropdown({ limit, assetPaginationCurrentPage }) {
  const token = getToken();
  return axiosForJSON.get(`/assets/dropdown?page=${assetPaginationCurrentPage}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAssetDepartmentDropdown() {
  const token = getToken();
  return axiosForJSON.get("/assets/assetDepartment/dropdown", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getFunctionalAreaDropdown() {
  const token = getToken();
  return axiosForJSON.get("/functionArea/dropdown", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function getAssetModeDropdown() {
  const token = getToken();
  return axiosForJSON.get("/assetModes/dropdown", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getRunningModeDropdown() {
  const token = getToken();
  return axiosForJSON.get("/assetRunningMode/dropdown", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}