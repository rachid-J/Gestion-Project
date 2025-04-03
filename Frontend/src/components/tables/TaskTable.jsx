import React, { useState } from "react";
import PropTypes from "prop-types";
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ViewModal } from "../modals/ViewModal";
import { UpdateModal } from "../modals/UpdateModal";
import { Pagination } from "../UI/Paginations";
import { updateTaskStatus } from "../../services/tasksServices";
import { DeleteTask } from "../modals/DeleteTask";

const statusGroups = {
  to_do: { title: "To Do", color: "bg-gray-100" },
  in_progress: { title: "In Progress", color: "bg-blue-100" },
  done: { title: "Done", color: "bg-green-100" }
};

export const TaskTable = ({
  data,
  getData,
  pagination,
  paginate,
  currentUserId,
  viewButton = true,
  updateButton = true,
  deleteButton = true
}) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [modal, setModal] = useState({ type: "", data: {} });

  const canDragTask = (task) => {
    return (
      task.creator?.id === currentUserId ||
      task.assigned_to?.id === currentUserId
    );
  };

  const handleDragStart = (e, task) => {
    if (!canDragTask(task)) {
      e.preventDefault();
      return;
    }
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === newStatus) return;
  
    try {
      await updateTaskStatus(draggedTask.id, { status: newStatus });
      getData(pagination?.currentPage || 1);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const nextData = async () => 
    pagination.currentPage < pagination.lastPage && getData(pagination.currentPage + 1);

  const prevData = async () => 
    pagination.currentPage > 1 && getData(pagination.currentPage - 1);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.entries(statusGroups).map(([status, { title, color }]) => (
          <div
            key={status}
            className="min-w-[300px] w-[300px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className={`rounded-lg p-2 ${color}`}>
              <h3 className="px-2 py-1 text-sm font-semibold text-gray-700">
                {title} • {data.filter(t => t.status === status).length}
              </h3>
              
              <div className="mt-2 space-y-2">
                {data
                  .filter(task => task.status === status)
                  .map((task) => {
                    const isDraggable = canDragTask(task);
                    return (
                      <div
                        key={task.id}
                        draggable={isDraggable}
                        onDragStart={(e) => isDraggable && handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        className={`bg-white rounded-lg shadow-sm p-3 border border-gray-200 transition-transform ${
                          isDraggable 
                            ? "cursor-move hover:scale-[1.005] active:scale-100"
                            : "cursor-not-allowed opacity-75"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className={`text-white text-xs px-2 py-1  rounded-full ${task.priority === "high" ? "bg-red-600" : task.priority==="medium" ? "bg-yellow-500" : "bg-green-500" }`}>{task.priority}</div>
                          <div className="flex space-x-1">
                            {viewButton && (
                              <button
                                onClick={() => setModal({ type: "view", data: task })}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <EyeIcon className="w-4 h-4 text-gray-600" />
                              </button>
                            )}
                            {updateButton && task.creator?.id === currentUserId && (
                              <button
                                onClick={() => setModal({ type: "update", data: task })}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <PencilSquareIcon className="w-4 h-4 text-gray-600" />
                              </button>
                            )}
                            {deleteButton && task.creator?.id === currentUserId && (
                              <button
                                onClick={() => setModal({ type: "delete", data: task })}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <TrashIcon className="w-4 h-4 text-gray-600" />
                              </button>
                            )}
                          </div>
                        </div>

                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {task.description}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="shrink-0">
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                {task.creator?.avatar ? (
                                  <img
                                    src={task.creator.avatar}
                                    className="w-full h-full rounded-full object-cover"
                                    alt="Avatar"
                                  />
                                ) : (
                                  <span className="text-xs text-blue-800">
                                    {task.creator?.name?.charAt(0) || '?'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-gray-600">
                              {task.assigned_to?.name || "Unassigned"}
                            </span>
                          </div>
                          {task.due_date && (
                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                              {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {paginate && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <Pagination
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            total={pagination.total}
            next={nextData}
            previous={prevData}
          />
        </div>
      )}

      {modal.type === "view" && (
        <ViewModal
          task={modal.data}
          statusGroups={statusGroups}
          onClose={() => setModal({ type: "", data: {} })}
        />
      )}

      {modal.type === "update" && (
        <UpdateModal
          task={modal.data}
          statusGroups={statusGroups}
          onClose={() => setModal({ type: "", data: {} })}
          onUpdateSuccess={() => getData(pagination?.currentPage || 1)}
        />
      )}

      {modal.type === "delete" && (
        <DeleteTask 
          modal={modal} 
          setModal={setModal} 
          onDeleteSuccess={() => getData(pagination?.currentPage || 1)}
        />
      )}
    </div>
  );
};

TaskTable.propTypes = {
  data: PropTypes.array.isRequired,
  getData: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    lastPage: PropTypes.number,
    total: PropTypes.number
  }),
  paginate: PropTypes.bool,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  viewButton: PropTypes.bool,
  updateButton: PropTypes.bool,
  deleteButton: PropTypes.bool
};

TaskTable.defaultProps = {
  paginate: true,
  viewButton: true,
  updateButton: true,
  deleteButton: true
};