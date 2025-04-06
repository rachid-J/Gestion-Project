import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../services/axiosClient';
import { ProjectColab } from '../../services/ProjectCollab';


export const ColaabInvite = ({ show, onClose, onSubmit, email, setEmail, error, success, projectId }) => {
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [projectCollab, setProjectCollab] = useState([]);

    // Fetch data when component mounts or search term changes
    useEffect(() => {
        const fetchData = async () => {
            if (!show) return;
            
            setIsLoading(true);
            try {
                const [contactsResponse, collabResponse] = await Promise.all([
                    axiosClient.get(`/contacts?search=${searchTerm}`),
                    ProjectColab(projectId)
                ]);

                setContacts(contactsResponse.data?.data || []);
                setProjectCollab(collabResponse?.data || []);
            } catch (err) {
                console.error("Data fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [show, searchTerm, projectId]);

    // Filter out existing collaborators
    const filteredContacts = contacts.filter(contact => 
        !projectCollab.some(collab => collab.email === contact.email)
    );

    // Handle contact selection
    const handleContactSelect = (contact) => {
        setSelectedContact(contact);
        setEmail(contact.email);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full border border-gray-100 animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Invite Collaborator</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Search Input */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search contacts..."
                            className="w-full px-4 py-3 pl-10 border-0 rounded-lg bg-gray-50 focus:ring-2 
                                    focus:ring-blue-500 focus:bg-white transition-all"
                        />
                        <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </div>

                    {/* Contacts List */}
                    <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-100">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            </div>
                        ) : filteredContacts.length > 0 ? (
                            <ul className="divide-y divide-gray-100">
                                {filteredContacts.map((contact) => (
                                    <li 
                                        key={contact.id}
                                        className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center ${
                                            selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => handleContactSelect(contact)}
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-blue-800 font-medium text-sm">
                                                {contact.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{contact.name}</p>
                                            <p className="text-sm text-gray-500">{contact.email}</p>
                                        </div>
                                        {selectedContact?.id === contact.id && (
                                            <svg className="w-5 h-5 ml-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                            </svg>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                {searchTerm 
                                    ? 'No matching contacts found' 
                                    : contacts.length === 0 
                                        ? 'No contacts available' 
                                        : 'All contacts are already collaborating'}
                            </div>
                        )}
                    </div>

                    {/* Email Input */}
                    <div className="relative mt-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=" "
                            className="w-full px-4 py-3 border-0 rounded-lg bg-gray-50 focus:ring-2 
                                    focus:ring-blue-500 focus:bg-white peer transition-all"
                            required
                        />
                        <label className="absolute left-4 top-3 px-1 text-gray-400 pointer-events-none 
                            peer-focus:text-blue-600 peer-focus:-translate-y-5 peer-focus:scale-90 
                            peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-90 
                            transition-all bg-white">
                            Email address
                        </label>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="p-3 bg-red-50/80 rounded-xl border border-red-100 flex items-center gap-3 text-red-700">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-50/80 rounded-xl border border-green-100 flex items-center gap-3 text-green-700">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            {success}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-lg 
                                    hover:from-blue-700 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                            </svg>
                            Send Invite
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};