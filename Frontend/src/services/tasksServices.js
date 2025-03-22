import { axiosClient } from "./axiosClient"
export const getTasks =async(page,projectId)=>{
    const response = await axiosClient.get(`/task/getTasks/${projectId}?page=${page}`)
    return response
}

export const deleteTask = async (id) => {
    const response = await axiosClient.get(`/task/deleteTask/${id}`)
    return response
}

export const createTask = async (projectId, data) => {
    const response = await axiosClient.post(`/task/createTask/${projectId}`, data);
    return response;
};

export const members = async (id) => {
    const response = await axiosClient.get(`/task/memberOfProject/${id}`);
    return response;
}
