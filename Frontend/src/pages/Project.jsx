import React, { useState, useEffect } from "react";
import { Input } from "../components/UI/Input";
import { Button } from "../components/UI/Button";
import { DynamicSelect } from "../components/UI/Select";
import { addProject, filterProjectsByStatus, getAllProject, getProject, searchProjectbyName } from "../services/projectServices";
import { errors } from "../constants/Errors";
import { TableSkeleton } from "../components/Skeleton/TableSkeleton";
import { useDebounce } from "../hooks/useDebounce";
import { Table } from "../components/tables/Table";
import {  MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { CreateProjectModal } from "../components/layouts/CreateProjectModal";
import { setProject } from "../Redux/features/projectSlice";
import { XMarkIcon } from "@heroicons/react/24/solid";

export const Project = () => {
  const user = useSelector(state => state.auth.user);
  const [projects, setProjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paginate, setPaginate] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    lastPage: 0,
    total: 0,
  });
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const resp = await getAllProject();
        dispatch(setProject(resp.data.projects));
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
  
    fetchProjects();
  }, []);

  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

  const fetchProjects = async (searchQuery = "", page = 1) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      let response;
      if (searchQuery) {
        response = await searchProjectbyName(searchQuery, page);
      } else {
        response = await getAllProject(page);
      }
      setProjects(response.data.projects);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total,
      });
      setPaginate(true);
    } catch (error) {
      setErrorMessage(errors.FETCH_ERROR);
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjectsByStatus_FUNCTION = async (page = 1) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await filterProjectsByStatus(selectedStatus, page);
      setProjects(response.data.projects);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total,
      });
      setPaginate(true);
    } catch (error) {
      setErrorMessage(errors.FETCH_ERROR);
      console.error("Error filtering projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (data) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      await addProject(data);
      await fetchProjects();
      setIsModalCreateOpen(false);
    } catch (error) {
      setErrorMessage(errors.CREATE_ERROR);
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchProjects(debouncedSearchTerm);
    } else if (selectedStatus !== "All Statuses") {
      filterProjectsByStatus_FUNCTION();
    } else {
      fetchProjects();
    }
  }, [debouncedSearchTerm, selectedStatus]);

  const handlePageChange = (page) => {
    if (searchTerm) {
      fetchProjects(searchTerm, page);
    } else if (selectedStatus !== "All Statuses") {
      filterProjectsByStatus_FUNCTION(page);
    } else {
      fetchProjects("", page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your projects and track their progress
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalCreateOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              New Project
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <DynamicSelect
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value)}
                  options={[
                    { value: "All Statuses", label: "All Statuses" },
                    { value: "active", label: "Active" },
                    { value: "completed", label: "Completed" },
                    { value: "on_hold", label: "On Hold" },
                  ]}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <TableSkeleton />
          ) : errorMessage ? (
            <div className="p-4 text-center text-red-600">{errorMessage}</div>
          ) : (
            <Table
              data={projects}
              pagination={pagination}
              onPageChange={handlePageChange}
              paginate={paginate}
            />
          )}
        </div>
      </div>

      {isModalCreateOpen && (
        <CreateProjectModal
          onClose={() => setIsModalCreateOpen(false)}
          onSubmit={handleCreateProject}
        />
      )}
    </div>
  );
};


