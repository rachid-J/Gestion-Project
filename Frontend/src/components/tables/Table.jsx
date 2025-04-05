import React, { useState, useRef } from "react";
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setselectedProject } from "../../Redux/features/projectSlice";
import { Pagination } from "../UI/Paginations";
import { CreatorHoverModal } from "../layouts/CreatorHoverModal";
import { Update } from "../modals/Update";
import { Delete } from "../modals/Delete";


export const Table = ({
  heads,
  data,
  viewButton,
  updateButton,
  deleteButton,
  keys,
  pagination,
  paginate,
  getData,
  toUpdateOrDelete,
  currentUserId
}) => {
  const [modal, setModal] = useState({
    type: "",
    data: {},
    toUpdateOrDelete
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Creator hover modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentCreator, setCurrentCreator] = useState(null);
  const hideTimeoutRef = useRef(null);

  // Pagination handlers
  const handleNextPage = async () => {
    if (pagination.lastPage <= pagination.currentPage) return;
    await getData(pagination.currentPage + 1);
  };

  const handlePreviousPage = async () => {
    if (pagination.currentPage === 1) return;
    await getData(pagination.currentPage - 1);
  };

  // Creator hover functionality
  const handleCreatorHover = (creator, event) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY - 240,
      left: rect.left + window.scrollX + rect.width / 2,
    });
    setCurrentCreator(creator);
    setModalVisible(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setModalVisible(false);
      setCurrentCreator(null);
    }, 300); 
  };

  const handleModalMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  // Action handlers
  const handleViewItem = (item) => {
    dispatch(setselectedProject(item));
    navigate(`/projects/${item.id}/board`);
  };

  const handleUpdateItem = (item) => {
    setModal({ 
      type: "update", 
      data: item, 
      toUpdateOrDelete 
    });
  };

  const handleDeleteItem = (item) => {
    setModal({ 
      type: "delete", 
      data: item,
      toUpdateOrDelete
    });
  };

  // Render status badge with appropriate styling
  const renderStatusBadge = (status) => {
    const statusStyles = {
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      default: "bg-orange-100 text-orange-800"
    };
    
    const style = statusStyles[status] || statusStyles.default;
    const label = status.replace('_', ' ');
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${style}`}>
        {label}
      </span>
    );
  };

  // Render creator cell with avatar
  const renderCreatorCell = (item, colIndex) => (
    <td
      key={colIndex}
      className="px-6 py-4 text-sm relative whitespace-nowrap"
      onMouseEnter={(e) => item.creator && handleCreatorHover(item, e)}
      onMouseLeave={handleMouseLeave}
    >
      <span className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1.5">
        <div className="shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            {item.creator?.avatar ? (
              <img
                src={item.creator.avatar}
                className="w-full h-full rounded-full object-cover"
                alt={`${item.creator.name} avatar`}
              />
            ) : (
              <span className="text-sm font-medium text-blue-800">
                {item.creator?.name?.charAt(0) || '?'}
              </span>
            )}
          </div>
        </div>
        {item.creator?.name || "N/A"}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          ↗
        </span>
      </span>
    </td>
  );

  // Empty state component
  const EmptyState = () => (
    <tr>
      <td colSpan={heads.length + (viewButton || updateButton || deleteButton ? 1 : 0)} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-14 0h14" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">No items are available to display.</p>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="relative rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50">
            <tr className="border-b border-gray-200">
              {heads.map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
              {(viewButton || updateButton || deleteButton) && (
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  {keys.map((key, colIndex) => {
                    // Handle creator cell with avatar
                    if (key === "creator.name") {
                      return renderCreatorCell(item, colIndex);
                    }
                    
                    // Handle status cell with colored badge
                    if (key === "status") {
                      return (
                        <td key={colIndex} className="px-6 py-4 text-sm">
                          {renderStatusBadge(item.status)}
                        </td>
                      );
                    }
                    
                    // Handle nested properties
                    return (
                      <td key={colIndex} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {key.split(".").reduce((obj, prop) => obj?.[prop] || "N/A", item)}
                      </td>
                    );
                  })}

                  {/* Action buttons */}
                  {(viewButton || updateButton || deleteButton) && (
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center justify-center space-x-3">
                        {viewButton && (
                          <button
                            onClick={() => handleViewItem(item)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors tooltip"
                            data-tip="View"
                            aria-label="View item"
                          >
                            <EyeIcon className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                          </button>
                        )}

                        {updateButton && item.creator?.id === currentUserId && (
                          <button
                            onClick={() => handleUpdateItem(item)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors tooltip"
                            data-tip="Edit"
                            aria-label="Edit item"
                          >
                            <PencilSquareIcon className="w-5 h-5 text-gray-600 hover:text-green-600" />
                          </button>
                        )}

                        {deleteButton && item.creator?.id === currentUserId && (
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors tooltip"
                            data-tip="Delete"
                            aria-label="Delete item"
                          >
                            <TrashIcon className="w-5 h-5 text-gray-600 hover:text-red-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <EmptyState />
            )}
          </tbody>
        </table>
      </div>

      {/* Creator hover modal */}
      {modalVisible && currentCreator && (
        <div
          onMouseEnter={handleModalMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="fixed z-50 w-64 p-4 transition-opacity duration-200"
          style={{
            top: modalPosition.top,
            left: modalPosition.left,
            transform: "translateX(-50%)",
          }}
        >
          <CreatorHoverModal creator={currentCreator} />
        </div>
      )}

      {/* Pagination */}
      {paginate && data.length > 0 && (
        <div className="border-t border-gray-100 px-6 py-4">
          <Pagination
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            total={pagination.total}
            next={handleNextPage}
            previous={handlePreviousPage}
          />
        </div>
      )}

      {/* Modals */}
      {modal.type === "update" && <Update modal={modal} setModal={setModal} />}
      {modal.type === "delete" && <Delete modal={modal} setModal={setModal} />}
    </div>
  );
};