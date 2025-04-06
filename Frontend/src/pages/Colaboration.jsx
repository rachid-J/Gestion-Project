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
import {
    ArrowPathIcon,
    PlusIcon,
    XMarkIcon,
    UserIcon,
    ClockIcon,
    EnvelopeIcon,
    UserGroupIcon,
    TrashIcon,
    ChevronDownIcon,
    Cog6ToothIcon,
    UserCircleIcon
  } from '@heroicons/react/24/outline';

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
          <div className="p-8 flex items-center justify-center gap-3 text-indigo-600">
            <ArrowPathIcon className="w-6 h-6 animate-spin" />
            <span className="font-medium">Loading Teams...</span>
          </div>
        );
      }
    
      return (
        <div className="min-h-screen bg-gray-50">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex border-b border-gray-200 mb-8">
              {isCreator ? (
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveTab('collaborators')}
                    className={`px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors ${
                      activeTab === 'collaborators'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <UserGroupIcon className="w-5 h-5" />
                    Team ({collaborators.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('invitations')}
                    className={`px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors ${
                      activeTab === 'invitations'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <EnvelopeIcon className="w-5 h-5" />
                    Invitations ({invitations.length})
                  </button>
                </div>
              ) : (
                <div className="px-4 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5" />
                  Team ({collaborators.length})
                </div>
              )}
            </div>
    
            {activeTab === 'collaborators' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white font-semibold">
                        {Infouser.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {Infouser.name}
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                          You
                        </span>
                      </h3>
                      <p className="text-sm text-gray-500">{Infouser.email}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-100 text-purple-600">
                          {selectedProject?.role === 'creator' ? 'Project Owner' : 'Member'}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <ClockIcon className="w-4 h-4" />
                          Active now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Team Members
                      <span className="text-gray-500 ml-2 font-normal">
                        ({collaborators.length - 1})
                      </span>
                    </h2>
                    {isCreator && (
                      <button
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <PlusIcon className="w-5 h-5" />
                        Add Member
                      </button>
                    )}
                  </div>
    
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {collaborators
                      .filter(user => user.username !== Infouser.username)
                      .map(user => (
                        <div key={user.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                  {user.avatar ? (
                                    <img 
                                      src={user.avatar} 
                                      alt={user.name} 
                                      className="w-full h-full rounded-lg object-cover"
                                    />
                                  ) : (
                                    <UserCircleIcon className="w-6 h-6 text-gray-400" />
                                  )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {user.name}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                user.pivot?.role === 'owner'
                                  ? 'bg-blue-100 text-blue-600'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {user.pivot?.role}
                              </span>
                            
                            </div>
                          </div>
                        </div>
                      ))}
    
                    {collaborators.filter(user => user.username !== Infouser.username).length === 0 && (
                      <div className="col-span-full py-12 text-center space-y-4">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                          <UserGroupIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            No team members
                          </h3>
                          <p className="text-sm text-gray-500 max-w-md mx-auto">
                            Start collaborating by inviting team members to your project
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {invitations.map(invitation => (
                    <div key={invitation.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <EnvelopeIcon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {invitation.email}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                invitation.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-600'
                                  : invitation.status === 'accepted'
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-red-100 text-red-600'
                              }`}>
                                {invitation.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(invitation.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {invitation.status === 'pending' && (
                          <button
                            onClick={() => handleCancelInvitation(invitation.id)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded-lg"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
    
                {invitations.length === 0 && (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                      <EnvelopeIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        No pending invitations
                      </h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Invite collaborators by entering their email address
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
              projectId={projectId}
            />
          </main>
        </div>
      );
    };