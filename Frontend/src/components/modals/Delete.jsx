import { useState } from "react";
import { deleteProject } from "../../services/projectServices";
import { errors } from "../../constants/Errors";
import { Notification } from "../layouts/Notification";
import { Button } from "../UI/Button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export const Delete = ({ modal, setModal }) => {
  const [loading, setLoading] = useState(false);
  const [notificaton, setNotification] = useState(null);

  const deleteProject_FUNCTION = async () => {
    setNotification(null);
    setLoading(true);

    const response = await deleteProject(modal.data.id);
    console.log(response.data)
    setLoading(false);
    response.status === 200
      ? response.data.message
        ? (setNotification({ type: "success", message: response.data.message }),
          setTimeout(() => {
            setModal({ type: "" });
          }, 3000))
        : setNotification({ type: "error", message: errors.tryAgain })
      : setNotification({ type: "error", message: errors.notFound });
  };


  const delete_FUNCTION = async (e) => {
    e.preventDefault();
    if (modal.toUpdateOrDelete === "project") {
        deleteProject_FUNCTION();
    }
    }

    return(
        <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative"
      >
        {/* Header with Icon */}
        <div className="flex items-center gap-3">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
          <h1
            id="modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            Delete {modal.toUpdateOrDelete}?
          </h1>
        </div>

        {/* Warning Message */}
        <div className="mt-4">
          <p className="text-gray-700 leading-relaxed text-sm">
            {modal.data.username ? (
              <>
                If you delete{" "}
                <span className="font-medium text-red-600">
                  {modal.data.username}
                </span>
                , this action cannot be undone. Are you sure you want to
                proceed?
              </>
            ) : (
              "Are you sure you want to delete this item? This action cannot be undone."
            )}
          </p>
        </div>

        {/* Buttons */}
        <form
          onSubmit={delete_FUNCTION}
          className="mt-6 flex flex-col sm:flex-row justify-end gap-3"
        >
          <Button
            type="button"
            text="Cancel"
            onClick={() => setModal({ type: "" })}
            bg="bg-gray-100"
            color="text-gray-800"
            width="full sm:w-1/2"
          />
          <Button
            type="submit"
            text="Delete"
            loading={loading}
            bg="bg-red-600 hover:bg-red-700"
            color="text-white"
            width="full sm:w-1/2"
          />
        </form>

        {/* Notification */}
        {notificaton && (
          <div className="mt-4">
            <Notification
              type={notificaton.type}
              message={notificaton.message}
            />
          </div>
        )}
      </div>
    </div>
    )
};
