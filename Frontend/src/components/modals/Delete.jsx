import { useState } from "react";
import { deleteProject } from "../../services/projectServices";
import { errors } from "../../constants/Errors";
import { Notification } from "../layouts/Notification";
import { Button } from "../UI/Button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export const Delete = ({ modal, setModal }) => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); 

  const handleDelete = async (e) => {
    e.preventDefault();
    setNotification(null);
    setLoading(true);

    try {
      const response = await deleteProject(modal.data.id);
       console.log(response)
      if (response.status >= 200 && response.status < 300) {
        setNotification({
          type: "success",
          message: response.data?.message || "Deleted successfully"
        });
        
        setTimeout(() => {
          setModal({ type: "" });
        }, 2000);
      } else {
        throw new Error(response.data?.error || errors.tryAgain);
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || errors.tryAgain
      });
    } finally {
      setLoading(false);
    }
  };

  const getContent = () => {
    if (!modal.data) return "this item";
    return modal.data.username 
      ? <span className="font-medium text-red-600">{modal.data.username}</span>
      : <span className="font-medium text-red-600">{modal.data.name}</span>;
  };

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-opacity-40 backdrop-blur-sm px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative"
      >
   
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            className="fixed top-4 right-4 z-50"
          />
        )}

       
        <div className="flex items-center gap-3 mb-4">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
          <h1 id="modal-title" className="text-xl font-semibold text-gray-900">
            Confirm Deletion
          </h1>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            You are about to permanently delete {getContent()}. This action:
          </p>
          <ul className="list-disc list-inside mt-2 text-red-500 text-sm">
            <li>Cannot be undone</li>
            <li>Will remove all associated data</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button
            type="button"
            text="Cancel"
            onClick={() => setModal({ type: "" })}
            className="w-full sm:w-32 bg-gray-100 hover:bg-gray-200 text-gray-800"
          />
          <Button
            type="submit"
            text="Confirm Delete"
            loading={loading}
            disabled={loading}
            className="w-full sm:w-32 bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};