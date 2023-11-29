import axios, {
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { BASE_URL } from "./apiConstants";

const axiosPrivateInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosPublicInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const addBearerToken = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const token = localStorage.getItem("token");
  if (token) {
    if (!config.headers) {
      config.headers = {} as AxiosHeaders;
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

axiosPrivateInstance.interceptors.request.use(addBearerToken);

export { axiosPrivateInstance, axiosPublicInstance };
