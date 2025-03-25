import { useEffect, useState } from "react";
import { XMarkIcon, ChevronDownIcon, CalendarDaysIcon, UserCircleIcon, FlagIcon } from "@heroicons/react/24/solid";
import { members } from "../../services/tasksServices";

export const CreateTaskModal = ({ isOpen, onClose, onCreate, projectId ,getData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    due_date: new Date().toISOString().split("T")[0],
    assigned_to: ""
  });
  const [membersdata, setMembersData] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await members(projectId);
        setMembersData(response.data.members);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    if (isOpen) fetchMembers();
  }, [isOpen, projectId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      ...formData,
      priority: formData.priority.toLowerCase(),
      assigned_to: Number(formData.assigned_to)
    });
    getData(1)
    onClose();
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl animate-modal-in border border-gray-100/50">
        <div className="flex justify-between items-center px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">
            <span className="mr-2">✨</span>
            Create New Task
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-all"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
          <div className="space-y-5">
            {/* Title Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>Task Title</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-gray-400"
                placeholder="Write task title..."
              />
            </div>

            {/* Description Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-gray-400 min-h-[100px]"
                placeholder="Add detailed description..."
              />
            </div>

            {/* Priority and Assignee Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Priority Dropdown */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FlagIcon className="w-5 h-5 text-gray-500" />
                  Priority
                </label>
                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <ChevronDownIcon className="w-5 h-5 absolute right-4 top-3.5 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Assignee Dropdown */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <UserCircleIcon className="w-5 h-5 text-gray-500" />
                  Assignee
                </label>
                <div className="relative">
                  <select
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                    className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="">Unassigned</option>
                    {membersdata.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-5 h-5 absolute right-4 top-3.5 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Due Date Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 pr-12"
                />
                <CalendarDaysIcon className="w-5 h-5 absolute right-4 top-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title}
              className="px-6 py-2.5 text-sm font-medium bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:to-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm hover:shadow-md"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};