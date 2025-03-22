import React, { useState, useRef } from "react";
import { ButtonSvg } from "../UI/ButtonSvg";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Pagination } from "../UI/Paginations";
import { useNavigate } from "react-router-dom";
import { CreatorHoverModal } from "../layouts/CreatorHoverModal";
import { Update } from "../modals/Update";
import { useDispatch } from "react-redux";
import { setselectedProject } from "../../Redux/features/projectSlice";
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
  headerStyle,
  rowStyle,
  currentUserId
}) => {
  const [modal, setModal] = useState({
    type: "",
    data: {},
    toUpdateOrDelete: toUpdateOrDelete,
  });
  const navigate = useNavigate();

  // State for hover modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentCreator, setCurrentCreator] = useState({});
  const hideTimeoutRef = useRef(null);
 
  const dispatch = useDispatch()
  const nextData = async () => {
    if (pagination.lastPage <= pagination.currentPage) return;
    await getData(pagination.currentPage + 1);
  };

  const prevData = async () => {
    if (pagination.currentPage === 1) return;
    await getData(pagination.currentPage - 1);
  };

  // Handle hover on creator name
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

  // Delay hiding modal when mouse leaves
  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setModalVisible(false);
      setCurrentCreator(null);
    }, 300); // 300ms delay; adjust as needed
  };

  // Cancel hide when mouse enters modal
  const handleModalMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  return (
    <div className="relative rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Table content */}
      <div className="overflow-x-auto pb-2">
        <table className="w-full">
          {/* Header */}
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

          {/* Rows */}
          <tbody className="divide-y divide-gray-100">
            {data.map((dataVar, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 transition-colors group"
              >
                {keys.map((key, colIndex) => {
                  if (key === "creator.name") {
                    return (
                      <td
                        key={colIndex}
                        className="px-6 py-4 text-sm relative whitespace-nowrap"
                        onMouseEnter={(e) => dataVar.creator && handleCreatorHover(dataVar, e)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <span className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1.5">
                        <div className="shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                              {dataVar.creator?.avatar ? (
                                <img 
                                  src={dataVar.creator.avatar} 
                                  className="w-full h-full rounded-full object-cover"
                                  alt="Creator avatar"
                                />
                              ) : (
                                <span className="text-sm font-medium text-blue-800">
                                  {dataVar.creator?.name?.charAt(0) || '?'}
                                </span>
                              )}
                            </div>
                          </div>
                          {dataVar.creator?.name || "N/A"}
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            ↗
                          </span>
                        </span>
                        
                      </td>
                    );
                  }
                  
                  // Add special formatting for status
                  if (key === "status") {
                    return (
                      <td key={colIndex} className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          dataVar.status === 'completed' ? 'bg-green-100 text-green-800' :
                          dataVar.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {dataVar.status.replace('_', ' ')}
                        </span>
                      </td>
                    );
                  }

                  return (
                    <td key={colIndex} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {key.split(".").reduce((obj, prop) => obj?.[prop] || "N/A", dataVar)}
                    </td>
                  );
                })}

                {(viewButton || updateButton || deleteButton) && (
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center justify-center space-x-3">
                  
  {viewButton && (
    <button
      onClick={() => {
        dispatch(setselectedProject(dataVar)); // Dispatch action to set selected project
        navigate(`/projects/${dataVar.id}/board`); // Navigate to the project board
      }}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors tooltip"
      data-tip="View"
    >
      <EyeIcon className="w-5 h-5 text-gray-600 hover:text-blue-600" />
    </button>
  )}

                      
                      {updateButton && dataVar.creator?.id === currentUserId && (
                        <button
                          onClick={() => setModal({ type: "update", data: dataVar, toUpdateOrDelete: toUpdateOrDelete })}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors tooltip"
                          data-tip="Edit"
                        >
                          <PencilSquareIcon className="w-5 h-5 text-gray-600 hover:text-green-600" />
                        </button>
                      )}
                      
                      {deleteButton && dataVar.creator?.id === currentUserId && (
                        <button
                          onClick={() => setModal({ type: "delete", data: dataVar })}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors tooltip"
                          data-tip="Delete"
                        >
                          <TrashIcon className="w-5 h-5 text-gray-600 hover:text-red-600" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hover Modal */}
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


      {paginate && (
        <div className="border-t border-gray-100 px-6 py-4">
          <Pagination
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            total={pagination.total}
            next={nextData}
            previous={prevData}
          />
        </div>
      )}

      {modal && modal.type === "update" && <Update modal={modal} setModal={setModal} />}
      {modal && modal.type === "delete" && <Delete modal={modal} setModal={setModal} />}

    </div>
  );
};