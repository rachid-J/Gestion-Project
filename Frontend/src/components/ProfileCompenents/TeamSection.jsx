import { EllipsisVerticalIcon, PlusIcon, UserCircleIcon, SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import InviteModal from "../layouts/InviteModal";
import { useState, useEffect } from "react";
import { ContactInvite } from "../../services/ContactService";
import { Notification } from "../layouts/Notification";
import { useNavigate } from "react-router-dom";

export const TeamSection = ({ contacts, isMyProfile }) => {
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navigate = useNavigate()
  const [showHeaderDropdown, setShowHeaderDropdown] = useState(false);




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

  const handleDropdownToggle = (contactId) => {
    setOpenDropdown(openDropdown === contactId ? null : contactId);
  };


  const handleHeaderDropdownToggle = () => {
    setShowHeaderDropdown(!showHeaderDropdown);
  };

  const handleSeeAllContacts = () => {
    navigate('/contact'); 
    setShowHeaderDropdown(false);
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isDropdown = event.target.closest('.contact-dropdown');
      const isHeaderDropdown = event.target.closest('.header-dropdown');
      const isMenuButton = event.target.closest('.menu-button');
      
      if (!isDropdown && !isHeaderDropdown && !isMenuButton) {
        setOpenDropdown(null);
        setShowHeaderDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">Contact</h3>
          <div className="relative header-dropdown">
            <button 
              onClick={handleHeaderDropdownToggle}
              className="p-1.5 hover:bg-gray-50 rounded-lg menu-button"
            >
              <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
            </button>
            
            {showHeaderDropdown && (
              <div className="absolute left-5 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg ring-black ring-opacity-5 focus:outline-none">
                <div>
                  <button
                    onClick={handleSeeAllContacts}
                    className="flex items-center w-full p-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowRightIcon className="w-5 h-5 mr-2 text-gray-400" />
                    See All Contacts
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No contacts found
            </div>
          ) : (
            contacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group">
                <div>
                  <h4 className="text-sm font-medium">{contact.name}</h4>
                  <p className="text-xs text-gray-500">{contact.members_count} members</p>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => handleDropdownToggle(contact.id)}
                    className="p-1 hover:bg-gray-100 rounded menu-button"
                  >
                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                  
                  {openDropdown === contact.id && (
                    <div className="contact-dropdown absolute left-4 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg ring-black ring-opacity-5 focus:outline-none">
                      <div>
                        <button
                          onClick={() => navigate(`/profile/${contact.username}`)}
                          className="flex items-center h-full w-full p-3 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                        >
                          <UserCircleIcon className="w-5 h-5 mr-2 text-gray-400" />
                          See Profile
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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