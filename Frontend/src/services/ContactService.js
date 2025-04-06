import { axiosClient } from "./axiosClient";

export const getContact = async (page = 1, search = '') => {
    const response = await axiosClient.get(`/contacts?page=${page}&search=${search}`);
    return response;
};
export const getAllContacts = async (search = '') => {
    const response = await axiosClient.get(`/contacts?search=${search}&per_page=100`);
    return response;
};

// Existing functions

export const ProjectInvite = async (projectId, email) => {
    const response = await axiosClient.post(`/projects/${projectId}/invite`, { email });
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
export const ContactDecline = async (token) => {
    const response = await axiosClient.post('contact-invitations/decline', { token });
    return response;
  };