import axios from "axios";

const Api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 15000,
    headers: {
    'Accept' : 'application"application/json',
    'Content-Type' : "application/json"
    }, 
})


Api.interceptors.response.use(
    (response) => response,
    (error) =>{
        if(error.response?.status == 401){
            localStorage.clear();
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
    
)
export default Api;