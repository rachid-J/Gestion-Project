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
export const updateProfile = async (userData) => {
    const response = await axiosClient.put('auth/account/update', userData);
    return response;
  }
  
  export const updatePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
    const response = await axiosClient.post('auth/password/change', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword
    });
    return response;
  }
  
  export const deleteAccount = async (password) => {
    const response = await axiosClient.delete('auth/account/delete', { 
      data: { password: password } 
    });
    return response;
  }