import React, { useState } from "react";
import { ButtonSvg } from "../UI/ButtonSvg";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Pagination } from "../UI/Paginations";
// import { Update } from "../Modals/Update";
// import { Delete } from "../Modals/Delete";
import { useNavigate } from "react-router-dom";

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
}) => {
  const [modal, setModal] = useState({
    type: "",
    data: {},
    toUpdateOrDelete: toUpdateOrDelete,
  });
  const navigate = useNavigate();

  const nextData = async () => {
    if (pagination.lastPage <= pagination.currentPage) {
      return;
    }
    await getData(pagination.currentPage + 1);
  };

  const prevData = async () => {
    if (pagination.currentPage == 1) {
      return;
    }
    await getData(pagination.currentPage - 1);
  };

  return (
    <div>
      <table className="w-full mt-6">
        <thead>
          {
            <tr className="bg-white text-gray shadow-md">
              {heads && heads.length
                ? heads.map((head) => {
                    return (
                      <th
                        key={head}
                        className="px-4 py-2 border-b border-gray-300"
                      >
                        {head}
                      </th>
                    );
                  })
                : null}
              {viewButton || updateButton || deleteButton ? (
                <th className="border-b border-gray-300">Actions</th>
              ) : null}
            </tr>
          }
        </thead>
        <tbody className="border-b border-gray-300">
          {data && data.length
            ? data.map((dataVar, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-zinc-100">
                  {keys &&
                    keys.map((key, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-2 text-center align-middle"
                      >
                        {key
                          .split(".")
                          .reduce((obj, prop) => obj?.[prop] || "N/A", dataVar)}
                      </td>
                    ))}

                  {(viewButton || updateButton || deleteButton) && (
                    <td className="px-4 py-2 text-center align-middle">
                      {viewButton && (
                        <ButtonSvg
                          svg={<EyeIcon className="w-5 h-5 text-gray" />}
                          color={"green"}
                          onclick={() => navigate(`/project/${dataVar.id}`)}
                        />
                      )}
                      {updateButton && (
                        <ButtonSvg
                          svg={
                            <PencilSquareIcon className="w-5 h-5 text-gray" />
                          }
                          color={"blue"}
                          onclick={() =>
                            setModal({
                              type: "update",
                              data: dataVar,
                              toUpdateOrDelete: toUpdateOrDelete,
                            })
                          }
                        />
                      )}
                      {deleteButton && (
                        <ButtonSvg
                          svg={<TrashIcon className="w-5 h-5 text-gray" />}
                          color={"red"}
                          onclick={() =>
                            setModal({
                              type: "delete",
                              data: dataVar,
                              toUpdateOrDelete: toUpdateOrDelete,
                            })
                          }
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))
            : null}
        </tbody>
      </table>
      {pagination && paginate && (
        <Pagination
          currentPage={pagination.currentPage}
          lastPage={pagination.lastPage}
          total={pagination.total}
          next={nextData}
          previus={prevData}
        />
      )}
      {modal.type === "update" && <Update modal={modal} setModal={setModal} />}
      {modal.type === "view" && navigate("/user/{}")}
      {modal.type === "delete" && <Delete modal={modal} setModal={setModal} />}
    </div>
  );
};
