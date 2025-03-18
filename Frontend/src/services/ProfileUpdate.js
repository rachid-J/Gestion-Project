import { axiosClient } from "./axiosClient"

export const Userprojects = async()=>{
    const response = await axiosClient.get("/user-info/projects")
    return response
}

