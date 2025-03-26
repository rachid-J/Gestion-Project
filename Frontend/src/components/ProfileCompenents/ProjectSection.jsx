import { DocumentTextIcon } from "@heroicons/react/24/outline";

export const ProjectSection = ({ projects, formatRelativeTime }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">Active Projects</h2>
      </div>
      <div className="p-5 space-y-4">
        {projects?.map((project, index) => (
          <div key={index} className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900">{project.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Created: {formatRelativeTime(project.created_at)}
                </p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {project.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );