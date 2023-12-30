import { getToken } from "../../utils/clonosCommon";
import { axiosInstance } from "../AxioClient";

const axiosForJSON = axiosInstance("application/json");
const axiosForMultipart = axiosInstance("multipart/form-data");

export const CreateTask = (payload) => {
  const token = getToken();
  return axiosForJSON.post("/tasksLibrary/create", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editTask = (payload) => {
  const token = getToken();
  return axiosForJSON.put("/tasksLibrary/tasks/edit", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTasksLibrary = () => {
  const token = getToken();
  return axiosForJSON.get("/tasksLibrary", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getSingleTask = (taskId) => {
  const token = getToken();
  return axiosForJSON.get(`/tasksLibrary/singleTask/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTasks = (payload) => {
  const token = getToken();
  return axiosForJSON.put("/tasksLibrary/delete", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
