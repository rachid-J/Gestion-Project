import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/24/outline";
import InviteModal from "../layouts/InviteModal";
import { useState } from "react";
import { ContactInvite } from "../../services/ContactService";
import { Notification } from "../layouts/Notification";

export const TeamSection = ({ contacts, isMyProfile }) => {
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleInvite = async (email) => {
    try {
      await ContactInvite(email);
      setNotification({
        message: 'Contact invitation sent!',
        type: 'success'
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({
        message: err.response?.data?.error || 'Failed to send invitation',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">Contact</h3>
          <button className="p-1.5 hover:bg-gray-50 rounded-lg">
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No contacts found
            </div>
          ) : (
            contacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium">{contact.name}</h4>
                  <p className="text-xs text-gray-500">{contact.members_count} members</p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            ))
          )}

          {isMyProfile && (
            <button 
              onClick={() => setShowModal(true)} 
              className="w-full flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add New Contact
            </button>
          )}
        </div>
      </div>

      <InviteModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleInvite={handleInvite}
      />

      {notification && (
        <Notification
          type={notification.type} 
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}