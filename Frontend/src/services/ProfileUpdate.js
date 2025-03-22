import { axiosClient } from "./axiosClient"

export const Userprojects = async(username)=>{
    const response = await axiosClient.get(`/user/${username}/projects`)
    return response
}
export const getUserProfile = async(username)=>{
    const response = await axiosClient.get(`/user/${username}/profile`)
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
  

  