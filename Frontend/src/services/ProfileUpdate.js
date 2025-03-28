import { axiosClient } from "./axiosClient"

export const Userprojects = async(username)=>{
    const response = await axiosClient.get(`/user/${username}/projects`)
    return response
}
export const getUserProfile = async(username)=>{
    const response = await axiosClient.get(`/user/${username}/profile`)
    return response
}

export const getRecentActivity = async(username)=>{
  const response = await axiosClient.get(`/user/${username}/activity`)
  return response
}

export const getContact = async(username)=>{
  const response = await axiosClient.get(`/user/${username}/getContact`)
  return response
}

export const updateUserInfo = async (formData) => {
    const response = await axiosClient.post('/user/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response;
  };
  

  