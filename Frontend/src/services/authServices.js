import { axiosClient } from "./axiosClient"

export const login = async(formData) => {
    const response = await axiosClient.post("/auth/login",formData)
    return response
}

export const register = async(formData) =>{
    const response = await axiosClient.post("/auth/register",formData)
    return response
}


export const user = async(token)=>{
    const response = await axiosClient.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response
}
export const Logout = async()=>{
    const response = await axiosClient.post("/auth/logout");
    return response
}
