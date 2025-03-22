import { axiosClient } from "./axiosClient"

export const getProject = async (page) =>{
    const response = await axiosClient.get(`/project/getProjects?page=${page}`);
    return response;
}
export const getAllProject = async () =>{
    const response = await axiosClient.get(`/project/getAllProject`);
    return response;
}
export const searchProjectbyName = async (name,page)=>{
    const response = axiosClient.get(`/project/searchProjectbyName/${name}?page=${page}`);
    return response;
}

export const filterProjectsByStatus = async (status,page=1)=>{
    const response = await axiosClient.get(`/project/filterProjectsByStatus/${status}?page=${page}`);
    return response;
}

export const addProject = async (data) =>{
    const response = await axiosClient.post("/project/createProject",data);
    return response;
}

export const updateProject = async(id,data)=>{
    const response = await axiosClient.put(`/project/updateProject/${id}`,data);
    return response;
}

export const deleteProject = async(id)=>{
    const response = await axiosClient.delete(`/project/deleteProject/${id}`);
    return response;
}