import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";

const axiosForJSON = axiosInstance("application/json");
const axiosForMultipart = axiosInstance("multipart/form-data");
const token = getToken();
export function getTechnicalSpecsOfAsset(id) {
  const token = getToken();
  return axiosForJSON.get(`/technicalSpecifications/assets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}