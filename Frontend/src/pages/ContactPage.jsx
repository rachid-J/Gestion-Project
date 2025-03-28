import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  UserIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { 
  ContactReceived, 
  ContactSent, 
  getContact, 
  ContactAccept,
  ContactDecline,
} from '../services/ContactService';

export const ContactsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState({ data: [], current_page: 1, last_page: 1 });
  const [receivedInvites, setReceivedInvites] = useState({ data: [], current_page: 1, last_page: 1 });
  const [sentInvites, setSentInvites] = useState({ data: [], current_page: 1, last_page: 1 });
  const [processingId, setProcessingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [contactsRes, receivedRes, sentRes] = await Promise.all([
          getContact(1, searchQuery),
          ContactReceived(1, searchQuery),
          ContactSent(1, searchQuery)
        ]);
        setContacts(contactsRes.data);
        setReceivedInvites(receivedRes.data);
        setSentInvites(sentRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [searchQuery]);

  // Function to load more for the current active tab
  const loadData = async (tab, page = 1, search = '') => {
    setLoading(true);
    try {
      let response;
      switch (tab) {
        case 0:
          response = await getContact(page, search);
          setContacts(prev => ({
            ...response.data,
            data: page === 1 ? response.data.data : [...prev.data, ...response.data.data]
          }));
          break;
        case 1:
          response = await ContactReceived(page, search);
          setReceivedInvites(prev => ({
            ...response.data,
            data: page === 1 ? response.data.data : [...prev.data, ...response.data.data]
          }));
          break;
        case 2:
          response = await ContactSent(page, search);
          setSentInvites(prev => ({
            ...response.data,
            data: page === 1 ? response.data.data : [...prev.data, ...response.data.data]
          }));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const currentTab = tabValue;
    const currentPage = 
      currentTab === 0 ? contacts.current_page :
      currentTab === 1 ? receivedInvites.current_page :
      sentInvites.current_page;
    const nextPage = currentPage + 1;

    if (currentTab === 0 && contacts.current_page < contacts.last_page) {
      loadData(0, nextPage, searchQuery);
    } else if (currentTab === 1 && receivedInvites.current_page < receivedInvites.last_page) {
      loadData(1, nextPage, searchQuery);
    } else if (currentTab === 2 && sentInvites.current_page < sentInvites.last_page) {
      loadData(2, nextPage, searchQuery);
    }
  };

  const handleAcceptInvitation = async (inviteId, token) => {
    setProcessingId(inviteId);
    setError(null);
    
    try {
      await ContactAccept(token);
      setReceivedInvites(prev => ({
        ...prev,
        data: prev.data.filter(invite => invite.id !== inviteId)
      }));
      const contactsRes = await getContact();
      setContacts(contactsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept invitation');
    } finally {
      setProcessingId(null);
    }
  };
  const handleDeclineInvitation = async (inviteId, token) => {
    setProcessingId(inviteId);
    setError(null);
    
    try {
      await ContactDecline(token); 
      setReceivedInvites(prev => ({
        ...prev,
        data: prev.data.filter(invite => invite.id !== inviteId)
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to decline invitation');
    } finally {
      setProcessingId(null);
    }
  };
  

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
          <UserIcon className="w-6 h-6 mr-2 text-blue-600" />
          My Network
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setTabValue(0)}
            className={`pb-3 px-4 font-medium ${
              tabValue === 0 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Contacts ({contacts.data.length})
          </button>
          <button
            onClick={() => setTabValue(1)}
            className={`pb-3 px-4 font-medium ${
              tabValue === 1 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Requests ({receivedInvites.data.length})
          </button>
          <button
            onClick={() => setTabValue(2)}
            className={`pb-3 px-4 font-medium ${
              tabValue === 2 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sent Invitations ({sentInvites.data.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {tabValue === 0 && (
        <div className="space-y-2">
          {contacts.data.map(contact => (
            <div key={contact.id} className="flex items-center justify-between p-4 bg-white rounded-md border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {contact.avatar ? (
                    <img src={contact.avatar} alt={contact.name} className="w-full h-full rounded-full" />
                  ) : (
                    <span className="text-gray-500 text-sm">{contact.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{contact.name}</p>
                  <p className="text-gray-500 text-sm">{contact.email}</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-green-700">
                <CheckCircleIcon className="w-4 h-4" />
                Connected
              </span>
            </div>
          ))}
          {contacts.data.length > 0 && contacts.current_page < contacts.last_page && (
            <button 
              onClick={handleLoadMore}
              disabled={loading}
              className="w-full p-3 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 rounded-md"
            >
              {loading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                'Load More Contacts'
              )}
            </button>
          )}
        </div>
      )}

      {tabValue === 1 && (
        <div className="space-y-2">
          {receivedInvites.data.map(invite => (
            <div key={invite.id} className="flex items-center justify-between p-4 bg-white rounded-md border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {invite.sender.avatar ? (
                    <img src={invite.sender.avatar} alt={invite.sender.name} className="w-full h-full rounded-full" />
                  ) : (
                    <span className="text-gray-500 text-sm">{invite.sender.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{invite.sender.name}</p>
                  <p className="text-gray-500 text-sm">
                    Request received: {new Date(invite.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAcceptInvitation(invite.id, invite.token)}
                  disabled={processingId === invite.id}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
                  aria-label="Accept invitation"
                >
                  {processingId === invite.id ? (
                    <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <CheckCircleIcon className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => handleDeclineInvitation(invite.id,invite.token)}
                  disabled={processingId === invite.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {receivedInvites.data.length > 0 && receivedInvites.current_page < receivedInvites.last_page && (
            <button 
              onClick={handleLoadMore}
              disabled={loading}
              className="w-full p-3 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 rounded-md"
            >
              {loading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                'Load More Requests'
              )}
            </button>
          )}
        </div>
      )}

      {tabValue === 2 && (
        <div className="space-y-2">
          {sentInvites.data.map(invite => (
            <div key={invite.id} className="p-4 bg-white rounded-md border border-gray-200 hover:shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{invite.recipient_email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invite.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      invite.status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {invite.status}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Sent: {new Date(invite.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {sentInvites.data.length > 0 && sentInvites.current_page < sentInvites.last_page && (
            <button 
              onClick={handleLoadMore}
              disabled={loading}
              className="w-full p-3 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 rounded-md"
            >
              {loading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                'Load More Invitations'
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
