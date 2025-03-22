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
    <div className="relative overflow-hidden rounded-lg">
      {/* Table content */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className={`grid grid-cols-${heads.length + 1} gap-4 px-6 py-4 ${headerStyle}`}>
            {heads.map((head) => (
              <div key={head} className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {head}
              </div>
            ))}
            {(viewButton || updateButton || deleteButton) && (
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide text-center">
                Actions
              </div>
            )}
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-200">
            {data.map((dataVar, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid grid-cols-${heads.length + 1} gap-4 px-6 py-4 ${rowStyle}`}
              >
                {keys.map((key, colIndex) => {
                  if (key === "creator.name") {
                    return (
                      <div
                        key={colIndex}
                        className="text-gray-700 text-sm relative"
                        onMouseEnter={(e) => dataVar.creator && handleCreatorHover(dataVar, e)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <span className="cursor-pointer text-blue-600 hover:underline">
                          {dataVar.creator?.name || "N/A"}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div key={colIndex} className="text-gray-700 text-sm">
                      {key.split(".").reduce((obj, prop) => obj?.[prop] || "N/A", dataVar)}
                    </div>
                  );
                })}

{(viewButton || updateButton || deleteButton) && (
              <div className="flex items-center justify-center space-x-3">
                {viewButton && (
                  <ButtonSvg
                    svg={<EyeIcon className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors" />}
                    onclick={() => navigate(`/projects/${dataVar.id}/board`)}
                  />
                )}
                
                {/* Only show edit button if current user is creator */}
                {updateButton && dataVar.creator?.id === currentUserId && (
                  <ButtonSvg
                    svg={<PencilSquareIcon className="w-5 h-5 text-gray-600 hover:text-green-600 transition-colors" />}
                    onclick={() => setModal({ type: "update", data: dataVar,toUpdateOrDelete: toUpdateOrDelete })}
                  />
                )}
                
                {/* Only show delete button if current user is creator */}
                {deleteButton && dataVar.creator?.id === currentUserId && (
                  <ButtonSvg
                    svg={<TrashIcon className="w-5 h-5 text-gray-600 hover:text-red-600 transition-colors" />}
                    onclick={() => setModal({ type: "delete", data: dataVar,toUpdateOrDelete: toUpdateOrDelete })}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      
          </div>
        </div>
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

      {/* Pagination */}
      {paginate && (
        <Pagination
          currentPage={pagination.currentPage}
          lastPage={pagination.lastPage}
          total={pagination.total}
          next={nextData}
          previous={prevData}
        />
      )}
      {modal && modal.type === "update" && <Update modal={modal} setModal={setModal} />}
      {modal && modal.type === "delete" && <Delete modal={modal} setModal={setModal} />}
    </div>
  );
};
