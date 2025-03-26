import React, { useState, useEffect } from 'react';
import { 
  Cog6ToothIcon, 
  UserCircleIcon, 
  LockClosedIcon, 
  BellIcon, 
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { Notification } from '../components/layouts/Notification';
import { updateUserInfo, updatePassword, deleteAccount, getSessions } from '../services/authServices';
import { Modal } from '../components/UI/Modal';
import { Switch } from '../components/UI/Switch';
import { logOut } from '../Redux/features/authSlice';

export const Settings = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('profile');
  const [notification, setNotification] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Enhanced Security State
  const [security, setSecurity] = useState({
    twoFactor: true,
    suspiciousActivity: true,
    passwordExpiration: false
  });

  // Privacy State
  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    personalizedAds: true,
    searchVisibility: 'private'
  });

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await getSessions();
        setSessions(response.data.sessions);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    };
    
    if (activeTab === 'security') loadSessions();
  }, [activeTab]);

  const handleSecurityUpdate = async (type) => {
    try {
      let response;
      switch(type) {
        case 'password':
          response = await updatePassword(formData);
          break;
        case '2fa':
          response = await update2FA(security.twoFactor);
          break;
      }
      
      setNotification({
        message: response.data.message,
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || 'Operation failed',
        type: 'error'
      });
    }
  };

  const handleDataExport = async () => {
    try {
      const response = await exportUserData();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user-data.zip');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      setNotification({
        message: 'Failed to export data',
        type: 'error'
      });
    }
  };

  const handleAccountDeletion = async () => {
    try {
      await deleteAccount();
      dispatch(logOut());
      window.location = '/login';
    } catch (error) {
      setNotification({
        message: 'Account deletion failed',
        type: 'error'
      });
    }
  };

  const SecuritySessionItem = ({ session }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400" />
        <div>
          <p className="font-medium">{session.device}</p>
          <p className="text-sm text-gray-500">
            {session.location} • Last active {session.last_active}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {session.current && (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Current
          </span>
        )}
        {!session.current && (
          <button className="text-red-600 hover:text-red-700 text-sm">
            Revoke
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Cog6ToothIcon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-1">
            {[
              { id: 'profile', icon: UserCircleIcon, label: 'Profile' },
              { id: 'security', icon: LockClosedIcon, label: 'Security' },
              { id: 'privacy', icon: ShieldCheckIcon, label: 'Privacy' },
              { id: 'notifications', icon: BellIcon, label: 'Notifications' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                  activeTab === id 
                    ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            
            {/* Security Section */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
                
                {/* Active Sessions */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Active Sessions</h3>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sessions.map((session) => (
                      <SecuritySessionItem key={session.id} session={session} />
                    ))}
                  </div>
                </div>

                {/* Password Update */}
                <div className="space-y-4 pt-6">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Password Settings</h3>
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                    <button 
                      onClick={() => handleSecurityUpdate('password')}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Advanced Security */}
                <div className="space-y-4 pt-6">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Advanced Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Add an extra layer of security
                        </p>
                      </div>
                      <Switch
                        enabled={security.twoFactor}
                        onChange={(val) => setSecurity({...security, twoFactor: val})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium">Suspicious Activity Alerts</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get notified about unusual activity
                        </p>
                      </div>
                      <Switch
                        enabled={security.suspiciousActivity}
                        onChange={(val) => setSecurity({...security, suspiciousActivity: val})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Section */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-4">Privacy Controls</h2>
                
                {/* Data Preferences */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Data Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium">Personalized Ads</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allow use of data for tailored advertising
                        </p>
                      </div>
                      <Switch
                        enabled={privacy.personalizedAds}
                        onChange={(val) => setPrivacy({...privacy, personalizedAds: val})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium">Search Visibility</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Control who can find your profile
                        </p>
                      </div>
                      <select
                        value={privacy.searchVisibility}
                        onChange={(e) => setPrivacy({...privacy, searchVisibility: e.target.value})}
                        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="contacts-only">Contacts Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="space-y-4 pt-6">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Account Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleDataExport}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <div className="flex items-center gap-2">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        <span>Export Account Data</span>
                      </div>
                      <span className="text-sm text-gray-500">ZIP archive</span>
                    </button>

                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                    >
                      <div className="flex items-center gap-2">
                        <TrashIcon className="w-5 h-5" />
                        <span>Delete Account</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Account Modal */}
            <Modal
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              title="Delete Account"
              actions={
                <>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAccountDeletion}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Confirm Deletion
                  </button>
                </>
              }
            >
              <p className="text-gray-600 dark:text-gray-300">
                This action is permanent and will delete all your data. 
                Are you sure you want to proceed?
              </p>
            </Modal>
          </div>
        </div>
      </div>

      <Notification
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
};