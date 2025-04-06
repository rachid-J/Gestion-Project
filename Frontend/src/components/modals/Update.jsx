import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Input } from "../UI/Input";
import { errors } from "../../constants/Errors";
import { DynamicSelect } from "../UI/Select";
import { updateProject } from "../../services/projectServices";
import { Notification } from "../layouts/Notification";
import { ArrowPathIcon, CheckCircleIcon, CheckIcon, ChevronUpDownIcon, ClockIcon } from "@heroicons/react/24/solid";

export const Update = ({ modal, setModal }) => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    end_date: "",
    status: "",
  });

  useEffect(() => {
    if (modal?.data) {
      setProjectData({
        name: modal.data.name || "",
        description: modal.data.description || "",
        end_date: modal.data.end_date || "",
        status: modal.data.status,
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
        console.log(response)
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
  const [isOpen, setIsOpen] = useState(false);

const getStatusIcon = (status) => {
  const iconClass = "h-5 w-5";
  switch(status) {
    case 'pending':
      return <ClockIcon className={`${iconClass} text-amber-500`} />;
    case 'in_progress':
      return <ArrowPathIcon className={`${iconClass} text-blue-500 animate-spin`} />;
    case 'completed':
      return <CheckCircleIcon className={`${iconClass} text-emerald-500`} />;
    default:
      return <ClockIcon className={`${iconClass} text-gray-400`} />;
  }
};

  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-2xl ring-1 ring-gray-900/5">
          <button
            onClick={() => setModal({ 
              type: "", 
            
            })}
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
          {modal.toUpdateOrDelete === "project" && (
            <div className="space-y-6">
              <div className="group relative">
                <Input
                  className="peer w-full rounded-xl border-0 outline-none bg-gray-100/50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 transition-all placeholder:text-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  name="name"
                  type="text"
                  value={projectData.name}
                  onChange={handleChangeProject}
                  placeholder="Project Name"
                  label="Project Name *"
                />
              </div>

              <div className="group relative">
                <textarea
                  className="peer w-full rounded-xl border-0 outline-none bg-gray-100/50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 transition-all placeholder:text-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white"
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
                className="peer w-full rounded-xl border-0 bg-gray-100/50 px-4 py-3.5 outline-none text-gray-900 ring-1 ring-gray-200 transition-all placeholder:text-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white"
                name="end_date"
                type="date"
                value={projectData.end_date}
                onChange={handleChangeProject}
                placeholder="End Date"
                label="End Date *"
         

              />

              <div className="group relative ">
              <div className="relative w-full">
  <div className="group relative">
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full cursor-default rounded-xl bg-white py-3 pl-3 pr-10 text-left ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-gray-300 transition-all"
      >
        <span className="flex items-center gap-2">
          {getStatusIcon(projectData.status)}
          <span className="capitalize">
            {projectData.status.replace('_', ' ')}
          </span>
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </button>
    </div>

    {isOpen && (
      <div className="absolute z-10 mt-1 w-full rounded-xl bg-white shadow-lg ring-1 ring-gray-200 focus:outline-none animate-slideDown">
        <ul className="max-h-60 overflow-auto rounded-xl py-2">
          {["pending", "in_progress", "completed"].map((status) => (
            <li
              key={status}
              onClick={() => {
                handleChangeProject({ target: { name: "status", value: status } });
                setIsOpen(false);
              }}
              className="relative cursor-default select-none py-3 pl-3 pr-9 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(status)}
                <span className="capitalize">
                  {status.replace('_', ' ')}
                  {projectData.status === status && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <CheckIcon className="h-5 w-5 text-blue-600" />
                    </span>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>
              </div>
            </div>
          )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setModal({ 
                  type: "", 
                
                })}
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
