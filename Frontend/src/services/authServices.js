import { axiosClient } from "./axiosClient"

export const login = async(formData) =>{
    const response = await axiosClient.post("/auth/login",formData)
    return response
}