import { axiosClient } from "./axiosClient"
export const getTasks =async(page,projectId)=>{
    const response = await axiosClient.get(`/task/getTasks/${projectId}?page=${page}`)
    return response
}
export const getAllTasks =async(projectId)=>{
  const response = await axiosClient.get(`/task/getAllTasks/${projectId}`)
  return response
}

export const deleteTask = async (id) => {
    const response = await axiosClient.delete(`/task/deleteTask/${id}`)
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

export const updateTaskStatus = async (taskId, { status }) => {
   
      const response = await axiosClient.patch(`/task/${taskId}/status`, { status })
      return response;
}

export const updateTask = async (projectId, taskId, taskData) => {
    const response = await axiosClient.patch(
      `task/projects/${projectId}/tasks/${taskId}`, 
      taskData
    );
    return response;
  };

  export const attachmentsTask = async ( taskId, taskData) => {
    const response = await axiosClient.post(`/task/${taskId}/attachments`, taskData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    return response;
  };

  export const commentsTask = async ( taskId, newComment) => {
    const response = await axiosClient.post(`/task/${taskId}/comments`, {
        content: newComment
      });
    return response;
  };

  export const GetcommentsTask = async ( taskId) => {
    const response = await axiosClient.get(`/task/${taskId}/comments`)
    return response;
  };

  export const GetattachmentsTaskk = async ( taskId) => {
    const response = await axiosClient.get(`/task/${taskId}/attachments`)
    return response;
  };

  export const deleteAttachmentTask = async (attachmentId) => {
    const response = await axiosClient.delete(`/task/attachments/${attachmentId}`);
    return response;
  };


