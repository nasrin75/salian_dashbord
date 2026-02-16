import axios from "axios";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { APP_ROUTES } from "../utlis/constants/routePath";

const Api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


Api.interceptors.response.use(
  (response) => {
    // This function runs for successful responses (HTTP status codes 2xx).
    const token = localStorage.getItem("token");
    if (token) {
      response.headers.Authorization = `Bearer ${token}`;
    }
    return response;

  },
  (error) => {
    // This function runs for ALL error responses (non-2xx status codes) or network errors.
    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error("لطفا دوباره وارد شوید")
          localStorage.clear('token')
          this.router.navigate([APP_ROUTES.LOGIN_PATH])
          break;
        case 404:
          toast.error("موردی یافت نشد.")
          break;
        case 403:
          toast.error("عدم دسترسی")
          break;
        case 500:
          toast.error("مشکلی رخ داده است.")
          break;
        default:
          console.log(`Unhandled HTTP Error: Status ${error.response.status}`);
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g., network down).
      console.log('No response received from the server. Please check your network connection.');
    } else {
      // Something happened in setting up the request that triggered an error.
      console.log('Error setting up the request:', error.message);
    }

    return Promise.reject(error);
  }
);
export default Api;