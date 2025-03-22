import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    cancelProjectInvitation,
    ProjectColab,
    ProjectInvite,
    ProjectSent,
} from '../services/ProjectCollab';
import { useSelector } from 'react-redux';

import { ColaabInvite } from '../components/layouts/ColaabInvite';

export const Collaboration = () => {
    const { projectId } = useParams();
    const [collaborators, setCollaborators] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [isCreator, setIsCreator] = useState(false);
    const [activeTab, setActiveTab] = useState('collaborators');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [email, setEmail] = useState('');

    const selectedProject = useSelector((state) => state.project.selectedProject);
    const Infouser = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [collabRes, invRes] = await Promise.all([
                    ProjectColab(projectId),
                    ProjectSent(projectId),
                ]);

                setCollaborators(collabRes.data);
                console.log(collabRes)
                setInvitations(invRes.data);
                setIsCreator(selectedProject?.role === 'creator');
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [projectId, selectedProject]);

    const handleCancelInvitation = async (invitationId) => {
        try {
            await cancelProjectInvitation(invitationId);
            setInvitations(invitations.filter((inv) => inv.id !== invitationId));
            setSuccess('Invitation canceled successfully!');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to cancel invitation');
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await ProjectInvite(projectId, email);
            setSuccess('Invitation sent successfully!');
            setEmail('');
            setShowInviteModal(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send invitation');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                <header className="bg-white shadow-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48"></div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                        <div className="max-w-2xl">
                            <div className="h-6 bg-gray-200 rounded w-64 mb-6"></div>
                            <div className="flex gap-3">
                                <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
                                <div className="w-32 h-12 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex border-b border-gray-200/80 mb-8 animate-pulse">
                        <div className="w-32 h-10 bg-gray-200 mr-4 rounded-t-lg"></div>
                        <div className="w-32 h-10 bg-gray-200 rounded-t-lg"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex border-b border-gray-200/80 mb-8">
                    {isCreator ? (
                        <>
                            <button
                                onClick={() => setActiveTab('collaborators')}
                                className={`px-6 py-3 font-medium flex items-center gap-2 transition-colors ${activeTab === 'collaborators'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Team ({collaborators.length })
                            </button>
                            <button
                                onClick={() => setActiveTab('invitations')}
                                className={`px-6 py-3 font-medium flex items-center gap-2 transition-colors ${activeTab === 'invitations'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Invitations ({invitations.length})
                            </button>
                        </>
                    ) : (
                        <div className="px-6 py-3 font-medium text-blue-600 border-b-2 border-blue-600">
                            Team ({collaborators.length })
                        </div>
                    )}
                </div>

                {activeTab === 'collaborators' && (
                    <div className="space-y-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100/30 hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-400 flex items-center justify-center text-white font-semibold shadow-lg">
                                        {Infouser.name?.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        {Infouser.name}
                                        <span className="text-sm px-2.5 py-1 bg-blue-100/50 text-blue-600 rounded-full backdrop-blur-sm">You</span>
                                    </h3>
                                    <p className="text-gray-500 text-sm font-mono">{Infouser.email}</p>
                                    <div className="mt-2 flex items-center gap-3">
                                        <span className="text-sm font-medium text-purple-600 bg-purple-100/30 px-3 py-1 rounded-full">
                                            {selectedProject?.role === 'creator' ? 'Project Owner' : 'member'}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-xs">Active now</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg text-gray-900 font-[600]">
                                    Team Members · <span className="text-blue-600">{collaborators.length -1}</span>
                                </h3>
                                {isCreator && (
                                    <button
                                        onClick={() => setShowInviteModal(true)}
                                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Member
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {collaborators
                                    .filter(user => user.username !== Infouser.username)
                                    .map(user => (
                                        <div key={user.id} className="group bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-100/30 hover:border-blue-100/60 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                            <div className="flex items-center gap-4">
                                                <div className="relative flex-shrink-0">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400/80 to-gray-600/90 flex items-center justify-center text-white font-medium shadow-lg">
                                                        {user.name?.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 border-2 border-white rounded-full animate-pulse"></div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                                                    <p className="text-sm text-gray-500/90 truncate font-mono">{user.email}</p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${user.pivot?.role === 'owner' ? 'bg-blue-100/30 text-blue-600' : 'bg-gray-100/30 text-gray-600'}`}>
                                                            {user.pivot?.role}
                                                        </span>
                                                        <span className="text-xs text-gray-400/80 flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            2h ago
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-gray-100/30 flex items-center justify-end">
                                                <button className="text-gray-400/80 hover:text-blue-600 p-1.5 rounded-lg transition-colors hover:bg-gray-100/30 backdrop-blur-sm">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                {collaborators.filter(user => user.username !== Infouser.username).length === 0 && (
                                    <div className="col-span-full py-12 text-center space-y-4">
                                        <div className="mx-auto w-24 h-24 bg-gray-100/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                            <svg className="w-8 h-8 text-gray-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-gray-900 font-medium">No team members yet</h4>
                                            <p className="text-sm text-gray-500/90 max-w-md mx-auto">
                                                Invite collaborators to work together on this project
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {isCreator && activeTab === 'invitations' && (
                    <div className="space-y-4">
                        {invitations.map(invitation => (
                            <div key={invitation.id} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-100/30 hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100/30 flex items-center justify-center backdrop-blur-sm">
                                            <svg className="w-5 h-5 text-purple-600/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{invitation.email}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${invitation.status === 'pending' ? 'bg-yellow-100/30 text-yellow-600' : invitation.status === 'accepted' ? 'bg-green-100/30 text-green-600' : 'bg-red-100/30 text-red-600'}`}>
                                                    {invitation.status}
                                                </span>
                                                <span className="text-xs text-gray-400/80 flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {new Date(invitation.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {invitation.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancelInvitation(invitation.id)}
                                                className="p-2 text-gray-400/80 hover:text-red-600 rounded-lg transition-colors hover:bg-gray-100/30 backdrop-blur-sm"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {invitations.length === 0 && (
                            <div className="py-12 text-center space-y-4">
                                <div className="mx-auto w-24 h-24 bg-gray-100/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-8 h-8 text-gray-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-gray-900 font-medium">No pending invitations</h4>
                                    <p className="text-sm text-gray-500/90 max-w-md mx-auto">
                                        Invite new collaborators using the form above
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <ColaabInvite
                    show={showInviteModal}
                    onClose={() => setShowInviteModal(false)}
                    onSubmit={handleInvite}
                    email={email}
                    setEmail={setEmail}
                    error={error}
                    success={success}
                />
            </main>
        </div>
    );
};