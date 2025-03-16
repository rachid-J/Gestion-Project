import React, { useState, useEffect } from "react";
import { Input } from "../components/UI/Input";
import { Button } from "../components/UI/Button";
import { Select } from "../components/UI/Select";
import { filterProjectsByStatus, getProject, searchProjectbyName } from "../services/projectServices";
import { errors } from "../constants/Errors";
import { TableSkeleton } from "../components/Skeleton/TableSkeleton";
import { useDebounce } from "../hooks/useDebounce";
import { Table } from "../components/tables/Table";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const Project = () => {
  const [projects, setProjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paginate, setPaginate] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    lastPage: 0,
    total: 0,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchProjects = async (searchQuery = "",page=1) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const response = searchQuery
        ? await searchProjectbyName(searchQuery,page)
        : await getProject(page);

        console.log(response.data.projects)
        setPaginate(true)
      if (response.status === 200) {
        if (response.data.projects.data?.length > 0) {
          setPagination({
            currentPage:response.data.projects.current_page,
            lastPage:response.data.projects.last_page,
            total:response.data.projects.total
          })
          setProjects(response.data.projects.data);
          console.log(response.data.projects.data)
          setErrorMessage("");
        } else {
          setProjects([]);
          setErrorMessage(errors.notFound);
        }
      }
    } catch (error) {
      setErrorMessage(
        error.response?.status === 404 ? errors.notFound : errors.tryAgain
      );
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProjectsByStatus_FUNCTION = async () => {
    setErrorMessage(null);
    setLoading(true);
  
    try {
      const response = await filterProjectsByStatus(selectedStatus);
      console.log("API Response: ", response.data);
  
      if (response.status === 200) {
        if (response.data.projects?.length) {
          setProjects(response.data.projects);
        } else {
          setErrorMessage(errors.notFound);
          setProjects([]);
        }
      } else {
        setErrorMessage(errors.tryAgain);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.status === 404 ? errors.notFound : errors.tryAgain
      );
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (selectedStatus) {
      if (selectedStatus !== "All Statuses") {
        filterProjectsByStatus_FUNCTION();
      } else {
        setErrorMessage(null);
        fetchProjects();
      }
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchProjects(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <div className="p-6 bg-white-900 text-black min-h-screen">
      <h1 className="text-xl font-semibold">Projects</h1>

      <div className="flex w-full items-center gap-3 mt-4">
  {/* Search Input with Icon */}
  <div className="relative flex-1 max-w-xl">
    <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
    <Input
      className="w-full p-2 pl-10 border border-white-700 rounded-md bg-white-800 text-black"
      placeholder="Search projects..."
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  {/* Status Filter */}
  <Select
    title="All Statuses"
    value={selectedStatus}
    onChange={(e) => setSelectedStatus(e.target.value)}
    options={["pending", "in_progress", "completed"]}
    className="w-auto"
  />

  {/* New Project Button */}
  <Button text="+ New Project" width="w-auto" />
</div>


      <div className="mt-4 px-2">
        {errorMessage && (
          <span className="text-red-300 text-xl font-semibold">
            {errorMessage}
          </span>
        )}

        {loading ? (
          <TableSkeleton heads={["Name","Status","Creator","Action"]} />
        ) : projects.length > 0 ? (
          <Table
            heads={["Name","Status","Creator"]}
            data={projects}
            keys={["name","status","creator.name"]}
            getData={(page) => fetchProjects(debouncedSearchTerm, page)}
            paginate={paginate}
            pagination={pagination}
            deleteButton={true}
            updateButton={true}
            viewButton={true}
          />
        ) : (
          !loading && (
            <div className="mt-10 flex flex-col items-center justify-center border border-white-700 rounded-lg p-6 bg-white-800">
              <div className="text-5xl">📁</div>
              <p className="text-lg font-semibold mt-2">No projects found</p>
              <p className="text-sm text-white-400">
                {searchTerm
                  ? "Try different search terms"
                  : "Create your first project to get started"}
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700">
                + Create Project
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Project;
