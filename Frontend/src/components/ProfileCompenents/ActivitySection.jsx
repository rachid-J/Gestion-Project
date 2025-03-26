import { ClockIcon, PaperClipIcon } from "@heroicons/react/24/outline";

export const ActivitySection = ({ activities }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div className="p-5 space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <ClockIcon className="w-5 h-5 text-gray-400 mt-1.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                {activity.message}
                {activity.reference?.project && (
                  <span className="ml-1 text-gray-400">({activity.reference.project})</span>
                )}
              </p>
              {activity.type === 'attachment_created' && (
                <div className="mt-1 text-xs text-blue-500 hover:underline flex items-center gap-1">
                  <PaperClipIcon className="w-4 h-4" />
                  <a href={`${import.meta.env.VITE_STORAGE_URL}/${activity.reference.filpath}`} target="_blank" rel="noreferrer">
                    {activity.reference.filename}
                  </a>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {activity.human_time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );