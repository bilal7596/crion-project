
import { object } from "yup";
import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";
const axiosForJSON = axiosInstance("application/json");


export function createWorkOrderAPI(payload) {
    console.log('payload:', payload)
    const token = getToken();
    return axiosForJSON.post(`workorders/addWorkOrder`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
}
export function getSingleWorkOrderAPI(workOrderId) {
    const token = getToken();
    return axiosForJSON.get(`workorders/${workOrderId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}



export function getWorkOrderPriorityDropdownAPI() {
    const token = getToken();
    return axiosForJSON.get(`workOrder/priorityStatus`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function getWorkOrderStatusDropdownAPI() {
    const token = getToken();
    return axiosForJSON.get(`workOrder/status`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}


/**
 * 
 * @param {*}  pageNo This will give me all the work order based on the page number.
 * @returns  promise of data axios body
 */
export function getWorkOrderAPI({ offset, payload, assetId }) {
    const token = getToken();
    return axiosForJSON.get(`workorders`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}


/**
 * 
 * @param {*}  pageNo This will give me all the work order based on the page number.
 * @returns  promise of data axios body
 */
export function getWorkOrderBasedOnAssetIdAPI({ assetId }) {
    const token = getToken();
    return axiosForJSON.get(`workorders/getworkordersbyassetid/${assetId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}


/**
 * 
 * @param {*}  documnetId  This will contain Id or of the specific work order
 * @returns  promise of data axios body
 */
export function getWorkOrderViewImageAPI(documnetId) {
    const token = getToken();
    return axiosForJSON.get(`workorderdocuments/getimage/${documnetId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

/**
 * 
 * @param {*}  workOrderId  This will contain Id or of the specific work order
 * @returns  promise of data axios body
 * To Delete the document (Single work order Delete).
 */
export function deleteWorkOrderAPI(workOrderId) {
    const token = getToken();
    return axiosForJSON.delete(`workorders/${workOrderId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

// To Delete the work orders in the bulk or (Multiple Work Order Delete).
export function deleteMultipleWorkOrderAPI({ payload }) {
    let data = { workOrderId: payload }

    const token = getToken()
    return axiosForJSON.put(`workorders/deleteMutiple`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}


/**
 * 
 * @param {*}  workOrderId  This will contain Id or of the specific work order
 * @returns  promise of data axios body
 */
export function editWorkOrderAPI({ workOrderId, formData }) {
    console.log('workOrderId:', workOrderId)
    const token = getToken();
    return axiosForJSON.put(`workorders/${workOrderId}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
}



/**
 * 
 * @param {*} workOrderTaskId  This will contain Id or of the specific work order
 * @returns  promise of data axios body
 */
export function deleteWorkOrderTaskAPI({ payload }) {
    const token = getToken();
    return axiosForJSON.put(`workordertasks/delete`, { "workOrderTaskIds": payload }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
/**
 * 
 * @param {*} workOrderDocumentId  This will contain Id or of the specific work order
 * @returns  promise of data axios body
 */
export function deleteWorkOrderDocumentAPI(workOrderDocumentIds) {
    console.log('workOrderDocumentIds:', workOrderDocumentIds)
    const token = getToken();
    return axiosForJSON.put(`workorderdocuments/delete `, { docIds: workOrderDocumentIds }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function updateWorkOrderStatusAPI({ workOrderId, status }) {
    const token = getToken();
    return axiosForJSON.put(`workorders/changestatus/${workOrderId}`, { status }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}


export function workOrderFilterAPI({ limit, offset, payload }) {
    const token = getToken();
    return axiosForJSON.post(`workorders / ${limit} / ${offset}`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
export function editWorkOrderTaskAPI({ payload }) {
    const token = getToken();
    return axiosForJSON.put(`workordertasks/edit`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
export function createWorkOrderRemarkAPI({ payload }) {
    const token = getToken();
    return axiosForJSON.post(`workorderremarks`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
export function getWorkOrderRemarkAPI({ workOrderId }) {
    const token = getToken();
    return axiosForJSON.get(`workorderremarks/${workOrderId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function requestToExtendDueDateAPI({ workOrderId, payload }) {
    const token = getToken();
    return axiosForJSON.post(`workordersduedate/requestextension/${workOrderId}`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
export function extendingDueDateRequestsAPI({ workOrderId, payload }) {
    const token = getToken();
    return axiosForJSON.post(`workordersduedate/extendduedate/${workOrderId}`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
export function getAllExtendDueDateRequestsAPI({ workOrderId }) {
    const token = getToken();
    return axiosForJSON.get(`workordersduedate/fetchactiverequest/${workOrderId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}


export function getWorkOrdersOfAsset({ assetId }) {
    const token = getToken();
    return axiosForJSON.get(`/workorders/getworkordersbyassetid/${assetId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}





