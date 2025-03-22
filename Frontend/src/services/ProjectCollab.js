import { axiosClient } from "./axiosClient";

export const ProjectReceived = async () => {
     const response = await axiosClient.get("/invitations/received");
     return response;
}

export const ProjectAccept = async (token) => {
    const response = await axiosClient.post("/invitations/accept", { token });
    return response;
}
export const ProjectDecline = async (token) => {
    const response = await axiosClient.post("/invitations/project/decline", { token });
    return response;
}
export const ProjectColab= async (projectId) => {
    const response = await axiosClient.get(`/projects/${projectId}/users`)
    return response;
}

export const ProjectInvite= async (projectId,email) => {
    const response = await axiosClient.post(`/projects/${projectId}/invite`, { email });
    return response;
}

export const ProjectSent = async (projectId) => {
    const response = await axiosClient.get(`/invitations/project/${projectId}/sent`);
    return response;
};
export const cancelProjectInvitation = async (invitationId) => {
    const response = await axiosClient.delete(`/invitations/project/${invitationId}`);
    return response;
};