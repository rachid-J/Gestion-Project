import { axiosClient } from "./axiosClient"

export const Userprojects = async()=>{
    const response = await axiosClient.get("/user/projects")
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
  