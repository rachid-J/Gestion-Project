import React, { useState, useRef, useEffect } from "react";
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setselectedProject } from "../../Redux/features/projectSlice";
import { Pagination } from "../UI/Paginations";
import { CreatorHoverModal } from "../layouts/CreatorHoverModal";
import { Update } from "../modals/Update";
import { Delete } from "../modals/Delete";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

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
  currentUserId,
  isLoading = false
}) => {
  const [modal, setModal] = useState({
    type: "",
    data: {},
    toUpdateOrDelete
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Responsive detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Changed from 140 to 640 to match sm: breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Creator hover/modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentCreator, setCurrentCreator] = useState(null);
  const hideTimeoutRef = useRef(null);
  const tableRef = useRef(null);

  // Pagination handlers
  const handleNextPage = async () => {
    if (pagination.lastPage <= pagination.currentPage) return;
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    await getData(pagination.currentPage + 1);
  };

  const handlePreviousPage = async () => {
    if (pagination.currentPage === 1) return;
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    await getData(pagination.currentPage - 1);
  };

  // Creator modal handling
  const handleCreatorHover = (creator, event) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    // Set creator data first
    setCurrentCreator(creator);
    
    if (isMobile) {
      // Centered position for mobile
      setModalPosition({
        top: window.scrollY + window.innerHeight / 2 - 150,
        left: window.innerWidth / 2,
      });
    } else {
      // Position near the cursor for desktop
      const rect = event.currentTarget.getBoundingClientRect();
      setModalPosition({
        top: rect.top + window.scrollY - 160,
        left: rect.left + window.scrollX + rect.width - 30,
      });
    }
    
    // Show modal after position is set
    setModalVisible(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      hideTimeoutRef.current = setTimeout(() => {
        setModalVisible(false);
        setCurrentCreator(null);
      }, 300);
    }
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
      completed: "bg-green-100 text-green-800 border-green-200",
      in_progress: "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-orange-100 text-orange-800 border-orange-200",
      default: "bg-gray-100 text-gray-800 border-gray-200"
    };
    const style = statusStyles[status] || statusStyles.default;
    const label = status?.replace(/_/g, ' ') || 'Unknown';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
        <span className="relative flex h-2 w-2 mr-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'completed' ? 'bg-green-400' : status === 'in_progress' ? 'bg-blue-400' : 'bg-orange-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'completed' ? 'bg-green-500' : status === 'in_progress' ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
        </span>
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </span>
    );
  };

  // Render creator cell with avatar (adjust events based on device)
  const renderCreatorCell = (item, colIndex) => (
    <td
      key={colIndex}
      className="px-6 py-4 text-sm relative whitespace-nowrap"
      onClick={(e) => item.creator && isMobile && handleCreatorHover(item.creator, e)}
      onMouseEnter={(e) => !isMobile && item.creator && handleCreatorHover(item, e)}
      onMouseLeave={!isMobile ? handleMouseLeave : undefined}
    >
      <span className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1.5">
        <div className="shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-sm">
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
        <span className="ml-1">{item.creator?.name || "N/A"}</span>
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

  // Loading state component
  const LoadingRows = () => (
    <>
      {[...Array(5)].map((_, idx) => (
        <tr key={`skeleton-${idx}`} className="animate-pulse">
          {keys.map((_, colIdx) => (
            <td key={`skeleton-cell-${idx}-${colIdx}`} className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </td>
          ))}
          {(viewButton || updateButton || deleteButton) && (
            <td className="px-6 py-4">
              <div className="flex justify-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );

  // Mobile card view render for each item
  const renderMobileCard = (item, index) => (
    <div key={`mobile-card-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 sm:hidden">
      {keys.map((key, idx) => {
        if (key === "status") {
          return (
            <div key={`mobile-${index}-${idx}`} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-sm font-medium text-gray-500">{heads[idx]}</span>
              <div>{renderStatusBadge(item.status)}</div>
            </div>
          );
        }
        if (key === "creator.name") {
          return (
            <div key={`mobile-${index}-${idx}`} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-sm font-medium text-gray-500">{heads[idx]}</span>
              <div 
                className="flex items-center" 
                onClick={(e) => item.creator && handleCreatorHover(item, e)}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mr-2">
                  {item.creator?.avatar ? (
                    <img
                      src={item.creator.avatar}
                      className="w-full h-full rounded-full object-cover"
                      alt={`${item.creator.name} avatar`}
                    />
                  ) : (
                    <span className="text-xs font-medium text-blue-800">
                      {item.creator?.name?.charAt(0) || '?'}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-900">
                  {key.split(".").reduce((obj, prop) => obj?.[prop] || "N/A", item)}
                </span>
              </div>
            </div>
          );
        }
        return (
          <div key={`mobile-${index}-${idx}`} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-sm font-medium text-gray-500">{heads[idx]}</span>
            <span className="text-sm text-gray-900">
              {key.split(".").reduce((obj, prop) => obj?.[prop] || "N/A", item)}
            </span>
          </div>
        );
      })}
      {(viewButton || updateButton || deleteButton) && (
        <div className="mt-3 pt-3  flex justify-between space-x-2">
           <span className="text-sm font-medium text-gray-500">Action</span>
          <div className="flex space-x-2">
            {viewButton && (
              <button
                onClick={() => handleViewItem(item)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
                aria-label="View item"
              >
                <EyeIcon className="w-3.5 h-3.5 mr-1" />
                View
              </button>
            )}
            {updateButton && item.creator?.id === currentUserId && (
              <button
                onClick={() => handleUpdateItem(item)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-green-50 text-green-600 hover:bg-green-100"
                aria-label="Edit item"
              >
                <PencilSquareIcon className="w-3.5 h-3.5 mr-1" />
                Edit
              </button>
            )}
            {deleteButton && item.creator?.id === currentUserId && (
              <button
                onClick={() => handleDeleteItem(item)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                aria-label="Delete item"
              >
                <TrashIcon className="w-3.5 h-3.5 mr-1" />
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile cards view */}
      <div className="sm:hidden">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={`mobile-skeleton-${idx}`} className="bg-white rounded-lg shadow p-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={`mobile-skeleton-row-${idx}-${i}`} className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end space-x-2">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : data.length > 0 ? (
          <div>
            {data.map((item, index) => renderMobileCard(item, index))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-14 0h14" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">No items are available to display.</p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop table view */}
      <div ref={tableRef} className="relative rounded-xl border border-gray-100 bg-white shadow-sm hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
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
              {isLoading ? (
                <LoadingRows />
              ) : data.length > 0 ? (
                data.map((item, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    {keys.map((key, colIndex) => {
                      if (key === "creator.name") {
                        return renderCreatorCell(item, colIndex);
                      }
                      if (key === "status") {
                        return (
                          <td key={colIndex} className="px-6 py-4 text-sm">
                            {renderStatusBadge(item.status)}
                          </td>
                        );
                      }
                      return (
                        <td key={colIndex} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {key.split(".").reduce((obj, prop) => obj?.[prop] || "N/A", item)}
                        </td>
                      );
                    })}
                    {(viewButton || updateButton || deleteButton) && (
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center justify-center space-x-3">
                          {viewButton && (
                            <button
                              onClick={() => handleViewItem(item)}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group/btn relative"
                              aria-label="View item"
                            >
                              <EyeIcon className="w-5 h-5 text-gray-600 group-hover/btn:text-blue-600" />
                              <span className="absolute opacity-0 group-hover/btn:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
                                View
                              </span>
                            </button>
                          )}
                          {updateButton && item.creator?.id === currentUserId && (
                            <button
                              onClick={() => handleUpdateItem(item)}
                              className="p-2 hover:bg-green-50 rounded-lg transition-colors group/btn relative"
                              aria-label="Edit item"
                            >
                              <PencilSquareIcon className="w-5 h-5 text-gray-600 group-hover/btn:text-green-600" />
                              <span className="absolute opacity-0 group-hover/btn:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
                                Edit
                              </span>
                            </button>
                          )}
                          {deleteButton && item.creator?.id === currentUserId && (
                            <button
                              onClick={() => handleDeleteItem(item)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors group/btn relative"
                              aria-label="Delete item"
                            >
                              <TrashIcon className="w-5 h-5 text-gray-600 group-hover/btn:text-red-600" />
                              <span className="absolute opacity-0 group-hover/btn:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
                                Delete
                              </span>
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
      </div>

      {/* Mobile Pagination */}
      {paginate && data.length > 0 && (
        <div className="sm:hidden mt-4 px-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {pagination.currentPage} of {pagination.lastPage}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={pagination.currentPage === 1}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  pagination.currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextPage}
                disabled={pagination.lastPage <= pagination.currentPage}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  pagination.lastPage <= pagination.currentPage
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
                aria-label="Next page"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creator Hover Modal - Single instance for both mobile and desktop */}
      {modalVisible && currentCreator && (
        <div
          className="fixed inset-0 z-50"
          style={{ pointerEvents: isMobile ? "auto" : "none" }}
          onClick={() => isMobile && setModalVisible(false)}
        >
          <div
            className={` rounded-lg pointer-events-auto ${
              isMobile
                ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md p-4"
                : "absolute p-3 min-w-[250px] max-w-sm"
            }`}
            style={
              !isMobile
                ? {
                    top: modalPosition.top,
                    left: modalPosition.left,
                    transform: "translateX(-50%)",
                  }
                : {}
            }
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={handleModalMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
          <CreatorHoverModal creator={currentCreator} />
          </div>
        </div>
      )}

      {/* Modals */}
      {modal.type === "update" && <Update modal={modal} setModal={setModal} />}
      {modal.type === "delete" && <Delete modal={modal} setModal={setModal} />}
    </>
  );
};