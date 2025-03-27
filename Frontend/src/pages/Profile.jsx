import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateUserInfo, Userprojects, getUserProfile, getRecentActivity, getContact } from '../services/ProfileUpdate';

import {
  CameraIcon,
  PencilIcon,
  UserCircleIcon,
  BriefcaseIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,

  ClockIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import { Notification } from '../components/layouts/Notification';
import { InfoItem } from '../components/ProfileCompenents/InfoItem';
import { TeamSection } from '../components/ProfileCompenents/TeamSection';
import { ProjectSection } from '../components/ProfileCompenents/ProjectSection';
import { ActivitySection } from '../components/ProfileCompenents/ActivitySection';
export const Profile = () => {

  const { username: routeUsername } = useParams();
  const currentUser = useSelector((state) => state.auth.user);
  const isMyProfile = !routeUsername || routeUsername === currentUser?.username;
  const [background, setBackground] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [hoverBg, setHoverBg] = useState(false);
  const [hoverProfile, setHoverProfile] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activities, setActivity] = useState([]);
  const navigate = useNavigate()





  const [contacts, setContacts] = useState([]);
  const [userInfo, setUserInfo] = useState({
    job: '',
    phone: '',
    address: '',
    city: ''
  });


  const [profileData, setProfileData] = useState(null);
  const [projects, setProjects] = useState([]);
  

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (isMyProfile && currentUser?.users_info) {
          setProfileData(currentUser);
          updateUserInfoState(currentUser.users_info);
          setMediaUrls(currentUser.users_info);
          return;
        }

        if (!isMyProfile) {
          const response = await getUserProfile(routeUsername);
          if (response.data.user) {
            setProfileData(response.data.user);
            updateUserInfoState(response.data.user.users_info);
            setMediaUrls(response.data.user.users_info);
          }
        }
      } catch (error) {
        handleError('Error loading profile:', error);
      }
    };

    fetchProfileData();
  }, [isMyProfile, currentUser, routeUsername]);

  // Fetch additional data
  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const [projectsRes, activityRes, contactsRes] = await Promise.all([
          Userprojects(routeUsername),
          getRecentActivity(routeUsername),
          getContact()
        ]);
        
        setProjects(projectsRes.data.projects);
        setActivity(activityRes.data.data);
        setContacts(contactsRes.data);
      } catch (error) {
        handleError('Error loading data:', error);
      }
    };

    fetchAdditionalData();
  }, [routeUsername]);

 
  const updateUserInfoState = (info) => {
    if (!info) return;
    setUserInfo({
      job: info.job || '',
      phone: info.phone || '',
      address: info.address || '',
      city: info.city || ''
    });
  };

  const setMediaUrls = (info) => {
    if (info?.background) {
      setBackground(`${import.meta.env.VITE_STORAGE_URL}/${info.background}`);
    }
    if (info?.profile_photo) {
      setProfilePic(`${import.meta.env.VITE_STORAGE_URL}/${info.profile_photo}`);
    }
  };

  const handleError = (message, error) => {
    console.error(message, error);
    setNotification({
      message: "Failed to load data. Please try again later.",
      type: "error"
    });
  };

 
  const handleFileUpload = async (file, type) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append(type, file);

      const response = await updateUserInfo(formData);
      const newUrl = response.data.userInfo[type];
      
      if (type === 'background') {
        setBackground(`${import.meta.env.VITE_STORAGE_URL}/${newUrl}`);
      } else {
        setProfilePic(`${import.meta.env.VITE_STORAGE_URL}/${newUrl}`);
      }

      setNotification({ 
        message: `${type.replace(/_/, ' ')} updated successfully`, 
        type: "success"
      });

    } catch (error) {
      console.error('Upload failed:', error);
      setNotification({ 
        message: "Upload failed. Please try again.",
        type: "error"
      });
    }
  };


  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      {/* Background Section */}
      <div className="relative bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] h-full">
        <div className="max-w-full mx-auto">
          <div className="relative h-64 flex items-end pb-12">
            {/* Background Image Upload */}
            <div
              className="absolute inset-0 overflow-hidden group cursor-pointer transition-all"
              onClick={() => isMyProfile && document.getElementById('backgroundInput').click()}
              onMouseEnter={() => isMyProfile && setHoverBg(true)}
              onMouseLeave={() => isMyProfile && setHoverBg(false)}
            >
              {background && (
                <img src={background} alt="Cover" className="w-full h-full object-cover object-center" />
              )}
              {isMyProfile && (
                <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity ${hoverBg ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                    <CameraIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
              <input
                type="file"
                id="backgroundInput"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files[0], 'background')}
              />
            </div>

            {/* Profile Picture */}
            <div className="relative -mb-24 ml-12 group">
              <div
                className="w-40 h-40 rounded-2xl border-4 border-white bg-gray-100 shadow-xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
                onClick={() => isMyProfile && document.getElementById('profileInput').click()}
                onMouseEnter={() => isMyProfile && setHoverProfile(true)}
                onMouseLeave={() => isMyProfile && setHoverProfile(false)}
              >
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserCircleIcon className="w-full h-full text-indigo-600" />
                )}
                {isMyProfile && (
                  <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity ${hoverProfile ? 'opacity-100' : 'opacity-0'}`}>
                    <CameraIcon className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <input
                type="file"
                id="profileInput"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files[0], 'profile_photo')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">About</h3>
                  <div className="space-y-3">
                    <InfoItem Icon={BriefcaseIcon} label="Position" value={userInfo.job} />
                    <InfoItem Icon={MapPinIcon} label="Location" value={userInfo.city} />
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Contact</h3>
                  <div className="space-y-3">
                    <InfoItem Icon={PhoneIcon} label="Phone" value={userInfo.phone} />
                    <InfoItem Icon={EnvelopeIcon} label="Email" value={profileData?.email} />
                    <InfoItem Icon={MapPinIcon} label="Address" value={userInfo.address} />
                  </div>
                </div>

                {isMyProfile && (
                  <button
                    onClick={() => navigate("/settings")}
                    className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Teams Card */}
            <TeamSection contacts={contacts} isMyProfile={isMyProfile} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <ProjectSection projects={projects} formatRelativeTime={formatRelativeTime} />
            <ActivitySection activities={activities} formatRelativeTime={formatRelativeTime} />
          </div>
        </div>
      </div>

      {notification && (
        <Notification 
          type={notification.type} 
          message={notification.message}
          className="fixed bottom-4 right-4 animate-fade-in-up"
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

