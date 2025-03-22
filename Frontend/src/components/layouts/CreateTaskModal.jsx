import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { members } from "../../services/tasksServices";

export const CreateTaskModal = ({ isOpen, onClose, onCreate ,projectId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [due_date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [assigned_to, setAssignedTo] = useState("");
  const [membersdata, setMembersData] = useState([]);
  console.log("assignedto",assigned_to)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await members(projectId);
        setMembersData(response.data.members);
        console.log(response.data.members)
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, []);
  console.log(membersdata)

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ title, description, priority: priority.toLowerCase(), due_date, assigned_to:Number(assigned_to) });
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
              Create New Task
            </h2>
            <p className="text-gray-500 text-lg">
              Kickstart your team collaboration with a structured workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="group relative">
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="peer w-full rounded-xl border-0 bg-gray-100/50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 transition-all placeholder:text-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="Project name"
                />
                <label className="absolute left-4 top-3.5 text-sm text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600">
                  Title
                </label>
              </div>

              <div className="group relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="peer w-full rounded-xl border-0 bg-gray-100/50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 transition-all placeholder:text-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  rows="3"
                  placeholder="Project description"
                />
                <label className="absolute left-4 top-3.5 text-sm text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600">
                  Description
                </label>
              </div>

              <div className="group relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="peer w-full rounded-xl border-0 bg-gray-100/50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 transition-all focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="group relative">
                <select
                  value={assigned_to}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="peer w-full rounded-xl border-0 bg-gray-100/50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 transition-all focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="">Select a Member</option>
                  {membersdata.length > 0 ? (
                    membersdata.map((elem) => (
                      <option key={elem.id} value={elem.id}>
                        {elem.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading members...</option>
                  )}
                </select>
              </div>

              <div className="group relative">
                <input
                  type="date"
                  value={due_date}
                  onChange={(e) => setDate(e.target.value)}
                  className="peer w-full rounded-xl border-0 bg-gray-100/50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 transition-all focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

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
                disabled={!title}
                className="rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-70 disabled:hover:shadow-lg"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
