import { userStore } from "@lib/stores/userStore";
import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: baseURL,
});

api.defaults.headers.common["Content-Type"] = "application/json";

api.interceptors.request.use(
  (config) => {
    const { accessToken } = userStore.getState();
    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export { api };
