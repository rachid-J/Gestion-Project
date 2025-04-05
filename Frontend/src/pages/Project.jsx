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
const dispatch = useDispatch()
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const resp = await getAllProject();
        console.log(resp.data.projects)
        dispatch(setProject(resp.data.projects));
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
  
    fetchProjects();
  }, []);

  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);


  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchProjects = async (searchQuery = "", page = 1) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const response = searchQuery
        ? await searchProjectbyName(searchQuery, page)
        : await getProject(page);
      setPaginate(true);
      if (response.status === 200) {
        if (response.data.projects.data?.length > 0) {
          console.log(response.data)
          setPagination({
            currentPage: response.data.projects.current_page,
            lastPage: response.data.projects.last_page,
            total: response.data.projects.total
          });
          setProjects(response.data.projects.data);
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

  const filterProjectsByStatus_FUNCTION = async (page = 1) => {
    setErrorMessage(null);
    setLoading(true);
  
    try {
      const response = await filterProjectsByStatus(selectedStatus, page);
      console.log(response)
      setPaginate(true);
      if (response.status === 200) {
        if (response.data.projects.data?.length > 0) {
          setPagination({
            currentPage: response.data.projects.current_page,
            lastPage: response.data.projects.last_page,
            total: response.data.projects.total
          });
          setProjects(response.data.projects.data);
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

  const handleCreateProject = async (data) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const response = await addProject(data);
      console.log(response.data);
      if (response.status === 200) {
        if (response.data.project) {
          setProjects(((prevProjects) => [...prevProjects, response.data.project]));
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
  }



  useEffect(() => {
    if (selectedStatus === "All Statuses") {
      fetchProjects("", 1);
    } else {
      filterProjectsByStatus_FUNCTION(1);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchProjects(debouncedSearchTerm, 1);
  }, [debouncedSearchTerm]);

 
  return (
    <>
      <CreateProjectModal
        isOpen={isModalCreateOpen}
        onClose={() => setIsModalCreateOpen(false)}
        onCreate={(projectData) => {
          handleCreateProject(projectData)
          console.log("Creating project:", projectData);
        }}
      />
      
      <div className="flex mt-12 min-h-screen">
    
        
        <div className="flex-1  p-6 bg-gray-50">
          <div className="ml-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Project Management</h1>
            <p className="text-gray-600">Manage and track your ongoing projects</p>
          </div>

        <div className="flex w-full items-center gap-3 mt-4">
          <div className="relative flex-1 max-w-xl">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              className="w-full ml-2 p-2 pl-10 border border-white-700 rounded-md bg-white-800 text-black"
              placeholder="Search projects..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

     

            <DynamicSelect
              title="All Statuses"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={["All Statuses","pending", "in_progress", "completed"]}
              width={"w-48"}
              className="w-auto"
            />

            <Button
              text="+ New Project"
              width="w-auto"
              onClick={() => setIsModalCreateOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            />
          </div>
        <div className="mt-4 px-2">
          {errorMessage && (
            <span className="text-red-300 text-xl font-semibold">
              {errorMessage}
            </span>
          )}

          {loading ? (
                 <TableSkeleton heads={["Name", "Status", "Creator"]}/>
          ) : projects.length > 0 ? (
            <Table
              heads={["Name", "Status", "Creator"]}
              data={projects}
              keys={["name", "status", "creator.name"]}
              getData={(page) => {
                if (selectedStatus !== "All Statuses") {
                  filterProjectsByStatus_FUNCTION(page);
                } else {
                  fetchProjects(debouncedSearchTerm, page);
                }

              }}
              paginate={paginate}
              pagination={pagination}
              updateButton={true}
              viewButton={true}
              deleteButton={true}
              currentUserId={user.id}
              toUpdateOrDelete={"project"}
            />
          ) : (
            !loading && (
              <div className="overflow-hidden rounded-xl border mt-3 border-gray-200 bg-white shadow-sm">
                <div className="p-8 text-center">
                  <div className="mx-auto max-w-md">
                    <div className="mb-4 text-6xl">📭</div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">No projects found</h3>
                    <p className="text-gray-500">
                      {searchTerm ?
                        "No results for your search criteria" :
                        "Get started by creating a new project"}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        </div>
      </div>
    </>
  );
};