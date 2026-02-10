import axios from "axios";
import { getToken, GetTokenFromLocalStorage } from "../utlis/constants/common";
import { toast } from "react-toastify";

const Api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 15000,
    headers: {
    'Accept' : 'application"application/json',
    'Content-Type' : "application/json",
    'Authorization' : `Bearer ${getToken}`
    }, 
})


Api.interceptors.response.use(
    (response) => response,
    (error) =>{
        console.log("errrrrrrrrrr:",error)
        if(error.response?.status == 401){
            localStorage.clear();
            window.location.href = '/login'
            toast.error("ACCESS_DENY")
        }
        return Promise.reject(error)
    }
    
)

export default Api;