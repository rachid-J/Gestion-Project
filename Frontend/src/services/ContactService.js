import { axiosClient } from "./axiosClient";

export const getContact = async()=>{
    const response = axiosClient.get('/contacts')
    return response;
}

export const ContactReceived = async() =>{
    const response =  axiosClient.get('/contact-invitations/received')
    return response;
}

export const ContactInvite = async(email) =>{
    const response =  axiosClient.post('contact-invite', { email });
    return response;
}

export const ContactSent = async() =>{
    const response =  axiosClient.get('/contact-invitations/sent')
    return response;
}

export const ContactVerify = async(token) =>{
    const response = await axiosClient.get(`/contact-invitations/verify?token=${token}`);
    return response;
}

export const ContactAccept = async(token) =>{
    const response = await axiosClient.post('/contact-invite/accept', { token });

    return response;
}