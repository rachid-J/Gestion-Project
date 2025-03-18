import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectAccept, ProjectColab, ProjectInvite, ProjectReceived } from '../services/ProjectCollab';

export const Collaboration = () => {
    const { projectId } = useParams();
    const [email, setEmail] = useState('');
    const [collaborators, setCollaborators] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('collaborators');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [collabRes, invRes] = await Promise.all([
                    ProjectColab(projectId),
                    ProjectReceived()
                ]);
                
                setCollaborators(collabRes.data);
                setInvitations(invRes.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    const handleInvite = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await ProjectInvite(projectId, email);
            setSuccess('Invitation sent successfully!');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send invitation');
        }
    };

    const handleAcceptInvitation = async (token) => {
        try {
            await ProjectAccept(token);
            setInvitations(invitations.filter(inv => inv.token !== token));
            setSuccess('Invitation accepted!');
            
            const collabResponse = await ProjectColab(projectId);
            setCollaborators(collabResponse.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to accept invitation');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-white">
                <div className="animate-pulse flex space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Header */}
            <header className="bg-white text-black shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight">Team Collaboration</h1>
                        
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Invite Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="max-w-2xl">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800">Invite Team Members</h2>
                        <form onSubmit={handleInvite} className="flex gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder=" "
                                    className="w-full px-4 py-3 border-0 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white peer transition-all"
                                    required
                                />
                                <label className="absolute left-4 top-3 px-1 text-gray-400 pointer-events-none 
                                    peer-focus:text-blue-600 peer-focus:-translate-y-5 peer-focus:scale-90 
                                    peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-90 
                                    transition-all bg-white">
                                    Email address
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                                    flex items-center gap-2 transition-all hover:shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                Send Invite
                            </button>
                        </form>
                    </div>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm rounded-xl border border-red-100 
                        flex items-center gap-3 text-red-700 animate-fade-in">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                        </svg>
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm rounded-xl border border-green-100 
                        flex items-center gap-3 text-green-700 animate-fade-in">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        {success}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-gray-200/80 mb-8">
                    {['collaborators', 'invitations'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium flex items-center gap-2 transition-colors
                                ${activeTab === tab 
                                    ? 'text-blue-600 border-b-2 border-blue-600' 
                                    : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab === 'collaborators' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            )}
                            {tab === 'invitations' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                </svg>
                            )}
                            {tab === 'collaborators' ? `Team (${collaborators.length})` : `Invitations (${invitations.length})`}
                        </button>
                    ))}
                </div>

                {/* Collaborators Grid */}
                {activeTab === 'collaborators' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {collaborators.map(user => (
                            <div key={user.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 
                                hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-medium">
                                            {user.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-full text-sm 
                                        ${user.pivot?.role === 'owner' 
                                            ? 'bg-blue-100 text-blue-600' 
                                            : 'bg-gray-100 text-gray-600'}`}>
                                        {user.pivot?.role}
                                    </span>
                                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {collaborators.length === 0 && (
                            <div className="col-span-full text-center py-12">
                                <div className="text-gray-400 mb-4">No team members yet</div>
                                <div className="text-sm text-gray-500">Start by inviting collaborators above</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Invitations List */}
                {activeTab === 'invitations' && (
                    <div className="space-y-4">
                        {invitations.map(invitation => (
                            <div key={invitation.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 
                                hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {invitation.project?.name || 'New Project'}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Invited by {invitation.sender?.name || 'Unknown User'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAcceptInvitation(invitation.token)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg 
                                            flex items-center gap-2 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Accept
                                    </button>
                                </div>
                            </div>
                        ))}
                        {invitations.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">No pending invitations</div>
                                <div className="text-sm text-gray-500">All set! No outstanding invites</div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};