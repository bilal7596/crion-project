import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";
const axiosForJSON = axiosInstance("application/json");



export function getCommentAPI(payload) {
    console.log('payload:', payload)
    const token = getToken();
    return axiosForJSON.get(`comments/getcommentsbyformid/${payload}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export function createCommentAPI(payload) {
    const token = getToken();
    return axiosForJSON.post('comments/addcomment', payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
export function editCommentAPI(payload) {
    const token = getToken();
    return axiosForJSON.put(`comments/${payload.commentId}`,payload.body, {
        mode: 'no-cors',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
export function deleteCommentAPI(payload) {
    const token = getToken();
    return axiosForJSON.delete(`comments/${payload}`, {
        mode: 'no-cors',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

