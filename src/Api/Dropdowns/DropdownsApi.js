import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";
const axiosForJSON = axiosInstance("application/json");

export function getStaticDropdownAPI({ staticDropdownNameOrId }) {
    const token = getToken();
    return axiosForJSON.get(`dropdown/${staticDropdownNameOrId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}