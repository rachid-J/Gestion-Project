import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
export const axiosClient = axios.create({
    baseURL: apiUrl,
    headers:{
        "Content-Type" : "application/json",
    }
});

axiosClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token")
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})