import axios from "axios";
import { toast } from "react-toastify";
import { APP_ROUTES } from "../utlis/constants/routePath";
import { ResponseMessage } from "../Response/ResponseMessage";


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
  config.timeout = 10000; // 10s timeout
  return config;
}, (error) => {
  console.error('Error in request interceptor:', error);
  return Promise.reject(error);
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
    if (!error.response) {
      console.error('Network Error or Request Setup Error:', error.message || error);
      window.location.href = APP_ROUTES.NOT_FOUND_PATH
      toast.error('مشکل در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');

    } else {
      let result = "مشکلی رخ داده است";
      if (error.response?.data?.message) {
        const message = error.response?.data?.message;
        const resp = ResponseMessage.find((item) => item?.key && item?.key.toUpperCase() === message.toUpperCase());
        result = resp?.mgs || message;
      }

      switch (error.response.status) {
        case 400:
          toast.error(result || 'خطای ورودی');
          break;
        case 401:
          // Unauthenticated
          toast.error("لطفاً دوباره وارد شوید.");
          localStorage.removeItem("token");
          //window.location.href = APP_ROUTES.UNAUTHORIZED_PATH
          if (typeof this !== 'undefined' && this.router) {
            window.location.href = APP_ROUTES.UNAUTHORIZED_PATH
          }
          break;
        case 403:
          toast.error("عدم دسترسی کافی.");
          break;
        case 404:
          console.log(error.response)
          //window.location.href = APP_ROUTES.NOT_FOUND_PATH
          break;
        case 500:
          // Internal Server Error
          toast.error("خطای داخلی سرور. لطفاً بعداً دوباره تلاش کنید.");
          break;
        default:
          console.warn(`Unhandled HTTP Error: Status ${error.response.status}`);
          toast.error(`خطایی رخ داد (${error.response.status}).`);
          break;
      }
    }

    return Promise.reject(error);
  }
);
export default Api;