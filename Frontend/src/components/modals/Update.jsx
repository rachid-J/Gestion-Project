import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Input } from "../UI/Input";
import { errors } from "../../constants/Errors";
import { DynamicSelect } from "../UI/Select";
import { updateProject } from "../../services/projectServices";
import { Notification } from "../layouts/Notification";

export const Update = ({ modal, setModal }) => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "pending",
  });

  useEffect(() => {
    if (modal?.data) {
      setProjectData({
        name: modal.data.name || "",
        description: modal.data.description || "",
        start_date: modal.data.start_date || "",
        end_date: modal.data.end_date || "",
        status: modal.data.status || "pending",
      });
    }
  }, [modal]);

  const handleChangeProject = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const update_FUNCTION = async (e) => {
    e.preventDefault();
    setNotification(null);
    setLoading(true);

    try {
      if (modal.toUpdateOrDelete === "project") {
        const response = await updateProject(modal.data.id, projectData);

        if (response.status === 200 && response.data.message) {
          setNotification({ type: "success", message: response.data.message });
          setTimeout(() => {
            setModal({ type: "" });
          }, 3000);
        } else {
          setNotification({ type: "error", message: errors.tryAgain });
        }
      }
    } catch (error) {
      console.error(error);
      setNotification({
        type: "error",
        message: error.response?.data?.message || errors.tryAgain,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-2xl ring-1 ring-gray-900/5">
          <button
            onClick={() => setModal(null)}
            className="absolute right-6 top-6 rounded-full p-1 transition-all hover:bg-gray-100 hover:scale-105"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>

          <div className="mb-8 space-y-1">
            <h2 className="text-3xl font-bold text-gray-900">
              Update {modal.toUpdateOrDelete} Credentials
            </h2>
            <p className="text-gray-500 text-lg">
              Modify the details below to update the project information.
            </p>
          </div>

          <form className="space-y-8" onSubmit={update_FUNCTION}>
            <div className="space-y-6">
              {/* Project Name Field */}
              <div className="group relative">
                <Input
                  className="peer w-full rounded-xl border-0 bg-gray-100/50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 transition-all placeholder:text-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  name="name"
                  type="text"
                  value={projectData.name}
                  onChange={handleChangeProject}
                  placeholder="Project Name"
                  label="Project Name *"
                />
              </div>

              {/* Description Field */}
              <div className="group relative">
                <textarea
                  className="peer w-full rounded-xl border-0 bg-gray-100/50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 transition-all placeholder:text-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  name="description"
                  type="text"
                  value={projectData.description}
                  onChange={handleChangeProject}
                  rows="3"
                  placeholder="Project description"
                />
                <label className="pointer-events-none absolute left-4 top-3.5 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600">
                  Description
                </label>
              </div>

              <Input
                className="peer w-full rounded-xl border-0 bg-gray-100/50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 transition-all placeholder:text-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white"
                name="start_date"
                type="date"
                value={projectData.start_date}
                onChange={handleChangeProject}
                placeholder="Start Date"
                label="Start Date *"
              />

              <Input
                className="peer w-full rounded-xl border-0 bg-gray-100/50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 transition-all placeholder:text-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white"
                name="end_date"
                type="date"
                value={projectData.end_date}
                onChange={handleChangeProject}
                placeholder="End Date"
                label="End Date *"
              />

              <div className="group relative">
              <DynamicSelect
  name="status" // Add this prop
  title="Status"
  value={projectData.status}
  onChange={handleChangeProject}
  options={["pending", "in_progress", "completed"]}
  width={"w-152"}
  className="w-auto"
/>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-xl px-6 py-3 font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-70 disabled:hover:shadow-lg"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>

          {notification && (
            <Notification type={notification.type} message={notification.message} />
          )}
        </div>
      </div>
    </div>
  );
};
