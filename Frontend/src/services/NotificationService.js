import { axiosClient } from "./axiosClient";

export const GetNotification= async () => {
   const response = await axiosClient.get('/notifications');
    return response;
}

export const markRead = async (ids, types) => {
    const response = await axiosClient.put('/notifications/mark-read', { ids, types });
     return response;
 }

 export const AcceptInvite = async (token ,type) => {
    const endpoint = type === 'project' 
    ? '/invitations/accept' 
    : '/contact-invite/accept';

    const response =  await axiosClient.post(endpoint, { token })
     return response;
 }



 