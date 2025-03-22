import { useState } from "react";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { DynamicSelect } from "../UI/Select";


export const CreateProjectModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState("Kanban");
  const [type, setType] = useState("Team-managed");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, description, template, type });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-2xl ring-1 ring-gray-900/5">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full p-1 transition-all hover:bg-gray-100 hover:scale-105"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>

          <div className="mb-8 space-y-1">
            <h2 className="text-3xl font-bold text-gray-900">
              Create New Project
            </h2>
            <p className="text-gray-500 text-lg">
              Kickstart your team collaboration with a structured workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6 ">
              {/* Project Name Field */}
              <div className="group relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="peer w-full rounded-xl border-0 bg-gray-100/50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 transition-all placeholder:text-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="Project name"
                />
                <label className="pointer-events-none absolute left-4 top-3.5 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600">
                  Project Name *
                </label>
              </div>

              {/* Description Field */}
              <div className="group relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="peer w-full rounded-xl border-0 bg-gray-100/50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 transition-all placeholder:text-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  rows="3"
                  placeholder="Project description"
                />
                <label className="pointer-events-none absolute left-4 top-3.5 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600">
                  Description
                </label>
              </div>

              {/* Template Selection */}
              <div className="flex justify-between gap-4 ">
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Template</h3>
                <div className="grid gap-4 ">
                  <div
                    onClick={() => setTemplate("Kanban")}
                    className={`relative flex cursor-pointer flex-col gap-3 rounded-xl p-5 transition-all ${
                      template === "Kanban"
                        ? "bg-gradient-to-br from-blue-50 to-purple-50 ring-2 ring-blue-500"
                        : "bg-white ring-1 ring-gray-200 hover:ring-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                        <CheckCircleIcon className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Kanban Board</h4>
                    </div>
                    <p className="text-sm text-gray-500">
                      Visual workflow management with customizable stages
                    </p>
                    {template === "Kanban" && (
                      <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 shadow-sm">
                        <CheckCircleIcon className="h-4 w-4 text-white animate-scaleIn" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Type */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Project Type</h3>
                <div className="grid gap-4 ">
                  <div
                    onClick={() => setType("Team-managed")}
                    className={`relative flex cursor-pointer flex-col gap-3 rounded-xl p-5 transition-all ${
                      type === "Team-managed"
                        ? "bg-gradient-to-br from-blue-50 to-purple-50 ring-2 ring-blue-500"
                        : "bg-white ring-1 ring-gray-200 hover:ring-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                        <CheckCircleIcon className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Team Managed</h4>
                    </div>
                    <p className="text-sm text-gray-500">
                      Full control over workflows and processes
                    </p>
                    {type === "Team-managed" && (
                      <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 shadow-sm">
                        <CheckCircleIcon className="h-4 w-4 text-white animate-scaleIn" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
                
              </div>
            </div>
          

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-6 py-3 font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name}
                className="rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-70 disabled:hover:shadow-lg"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};