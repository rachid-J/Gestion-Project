import {  CalendarIcon, EnvelopeIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export const CreatorHoverModal = ({ creator }) => {
  const navigate = useNavigate()
  console.log(creator)
  return (
    <div className="w-72 bg-white shadow-xl border border-gray-200">
      <div className="p-4 flex items-center border-b border-gray-200 bg-gray-50">
        <div className="relative mr-4">
          {creator?.avatar ? (
            <img
              src={creator.user_info.profile_photo}
              alt={creator.creator?.name}
              className="h-12 w-12 rounded-sm object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-sm bg-blue-600 flex items-center justify-center text-white font-medium">
              {creator.creator?.name?.slice(0, 2).toUpperCase() || "US"}
            </div>
          )}
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-sm"></div>
        </div>
        <div>
          <h3 className="text-gray-900 font-semibold text-base">
            {creator.creator?.name || "Unknown User"}
          </h3>
          <p className="text-gray-500 text-sm">{creator?.creator?.role || "Creator"}</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center text-gray-700 text-sm">
          <EnvelopeIcon className="h-4 w-4 mr-3 text-gray-500" />
          <span className="truncate">{creator.creator?.email|| "no-email@example.com"}</span>
        </div>
        <div className="flex items-center text-gray-700 text-sm">
          <CalendarIcon className="h-4 w-4 mr-3 text-gray-500" />
          <span>Joined {creator?.created_at?.split('T')[0] || "N/A"}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 p-2">
        <button onClick={()=> navigate(`/profile/${creator.creator.username}`)} className="w-full flex items-center justify-center px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors">
          <UserCircleIcon className="h-4 w-4 mr-2" />
          View Full Profile
        </button>
      </div>
    </div>
  );
};