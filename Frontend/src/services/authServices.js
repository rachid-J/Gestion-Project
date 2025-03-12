import { axiosClient } from "./axiosClient"

export const login = async(formData) =>{
    const response = await axiosClient.post("/auth/login",formData)
    return response
}

export const register = async(formData) =>{
    const response = await axiosClient.post("/auth/register",formData)
    return response
}