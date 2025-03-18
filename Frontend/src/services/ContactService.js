import { axiosClient } from "./axiosClient";

export const getContact = async (page = 1, search = '') => {
    const response = await axiosClient.get(`/contacts?page=${page}&search=${search}`);
    return response;
};

export const ContactReceived = async (page = 1, search = '') => {
    const response = await axiosClient.get(`/contact-invitations/received?page=${page}&search=${search}`);
    return response;
};

export const ContactInvite = async(email) =>{
    const response =  axiosClient.post('contact-invite', { email });
    return response;
}

export const ContactSent = async (page = 1, search = '') => {
    const response = await axiosClient.get(`/contact-invitations/sent?page=${page}&search=${search}`);
    return response;
};
export const ContactVerify = async(token) =>{
    const response = await axiosClient.get(`/contact-invitations/verify?token=${token}`);
    return response;
}

export const ContactAccept = async(token) =>{
    const response = await axiosClient.post('/contact-invite/accept', { token });

    return response;
}