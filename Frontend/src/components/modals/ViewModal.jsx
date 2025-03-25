import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { attachmentsTask, commentsTask, deleteAttachmentTask, GetattachmentsTaskk, GetcommentsTask } from "../../services/tasksServices";
import { Notification } from "../layouts/Notification";

export const ViewModal = ({ task, statusGroups, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState("comments");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    if (task) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const [commentsRes, attachmentsRes] = await Promise.all([
            GetcommentsTask(task.id),
            GetattachmentsTaskk(task.id)
          ]);
          setComments(commentsRes.data);
          setAttachments(attachmentsRes.data);
        } catch (error) {
          setNotification({ message: "Failed to load task data", type: "error" });
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [task]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const res = await commentsTask(task.id, newComment);
      setComments([res.data, ...comments]);
      setNewComment("");
      setNotification({ message: "Comment posted successfully!", type: "success" });
    } catch (error) {
      setNotification({ message: `Comment submission failed: ${error}`, type: "error" });
     
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await attachmentsTask(task.id, formData);
      setAttachments([res.data, ...attachments]);
      setFile(null);
      setNotification({ message: "File uploaded successfully!", type: "success" });
    } catch (error) {
   
      setNotification({ message: `File upload failed: ${error}`, type: "error" });
    }
  };

  const deleteAttachment = async (attachmentId) => {
    try {
     const response =  await deleteAttachmentTask(attachmentId); 
     if(response.status === 200){
      setNotification({ message: "Attachment deleted!", type: "success" });
      setAttachments(attachments.filter(a => a.id !== attachmentId));
     }

      
    } catch (error) {
      setNotification({ message: "Failed to delete attachment", type: "error" });
      console.error("Delete failed:", error);
     
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      {notification && (
        <Notification 
          type={notification.type} 
          message={notification.message}
          className="fixed top-4 right-4 z-50"
        />
      )}
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-jira transform transition-all max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">📌</span>
            {task.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Task Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                <div className="mt-1.5">
                  <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                    statusGroups[task.status]?.color || 'bg-gray-100 text-gray-800'
                  }`}>
                    {statusGroups[task.status]?.title || task.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</label>
                <div className="mt-1.5 flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    {task.assigned_to?.avatar ? (
                      <img 
                        src={task.assigned_to.avatar} 
                        className="rounded-full w-full h-full object-cover"
                        alt="Assignee avatar"
                      />
                    ) : (
                      <span className="text-sm text-blue-700 font-medium">
                        {task.assigned_to?.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-900 font-medium">
                    {task.assigned_to?.name || "Unassigned"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</label>
                <div className="mt-1.5 flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    {task.creator?.avatar ? (
                      <img 
                        src={task.creator.avatar} 
                        className="rounded-full w-full h-full object-cover"
                        alt="Creator avatar"
                      />
                    ) : (
                      <span className="text-sm text-green-700 font-medium">
                        {task.creator?.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-900 font-medium">{task.creator?.name}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</label>
                <div className="mt-1.5 flex items-center space-x-2 text-gray-900 font-medium">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : "No due date"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</label>
            <div className="mt-1.5 p-3 bg-gray-50 rounded-md border border-gray-200 prose max-w-none">
              <pre className="text-gray-700 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {task.description || "No description provided"}
              </pre>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-200 pt-4 text-gray-600">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Created {new Date(task.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>
                Updated {new Date(task.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("comments")}
                className={`pb-3 px-1 border-b-2 ${
                  activeTab === "comments" 
                    ? "border-blue-500 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Comments ({comments.length})
              </button>
              <button
                onClick={() => setActiveTab("attachments")}
                className={`pb-3 px-1 border-b-2 ${
                  activeTab === "attachments"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Attachments ({attachments.length})
              </button>
            </nav>
          </div>

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <div className="space-y-6 pt-4">
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={!newComment.trim()}
                  >
                    Post Comment
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center text-gray-500">Loading comments...</div>
                ) : comments.length === 0 ? (
                  <div className="text-center text-gray-500">No comments yet</div>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{comment.user.name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Attachments Tab */}
          {activeTab === "attachments" && (
            <div className="space-y-6 pt-4">
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={!file}
                  >
                    Upload
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {isLoading ? (
                  <div className="text-center text-gray-500">Loading attachments...</div>
                ) : attachments.length === 0 ? (
                  <div className="text-center text-gray-500">No attachments yet</div>
                ) : (
                  attachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <a
                          href={`/storage/${attachment.file_path}`}
                          download
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {attachment.file_name}
                        </a>
                      </div>
                      <button
                        onClick={() => deleteAttachment(attachment.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ViewModal.propTypes = {
  task: PropTypes.object,
  statusGroups: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};