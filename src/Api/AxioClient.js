import axios from "axios";
import { getToken } from "../utils/clonosCommon";
import configs from "../config";


export const axiosInstance = (contentType) => {
  const token = getToken();
  const axiosClient = axios.create({
    baseURL: `${configs?.url}/api/v1`,
    headers: {
      Accept: "application/json",
      "Content-Type": contentType ? contentType : "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return axiosClient;
};

export const loginAxiosClient = axios.create({
  baseURL: `${configs.url}/api/v1`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
