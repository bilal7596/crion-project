import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";
const axiosForJSON = axiosInstance("application/json");


export function createDropdownsAPI({ payload }) {
    console.log('payload:', payload)
    const token = getToken();
    return axiosForJSON.post(`dropdowns/create`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
// export function getDropdownsAPI({ dropdownName }) {
//     console.log('payload:', payload)
//     const token = getToken();
//     return axiosForJSON.post(`dropdowns/create`, payload, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
// }