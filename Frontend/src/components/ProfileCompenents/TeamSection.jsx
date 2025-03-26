import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/24/outline";

export const TeamSection = ({ contacts }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">Teams</h3>
          <button className="p-1.5 hover:bg-gray-50 rounded-lg">
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="space-y-3">
          {contacts.map(contact => (
            <div key={contact.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-sm font-medium">{contact.name}</h4>
                <p className="text-xs text-gray-500">{contact.members_count} members</p>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ))}
          <button className="w-full flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium p-2 hover:bg-blue-50 rounded-lg transition-colors">
            <PlusIcon className="w-5 h-5" />
            Add New Contact
          </button>
        </div>
      </div>
    </div>
  );