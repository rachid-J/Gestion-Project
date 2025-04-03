import React, { useState } from 'react';
import { 
  Cog6ToothIcon, 
  UserCircleIcon, 
  LockClosedIcon,
  TrashIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updateProfile,

  updatePassword,
  deleteAccount
} from '../services/authServices';
import { Modal } from '../components/UI/Modal';
import { logOut } from '../Redux/features/authSlice';
import { Notification } from '../components/layouts/Notification';
import { PasswordRequirements, PasswordStrengthIndicator } from '../components/modals/checkPassword';


export const Settings = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('profile');
  const [notification, setNotification] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');

 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    username: currentUser?.username || '',
    job: currentUser?.users_info?.job || '',
    phone: currentUser?.users_info?.phone || '',
    address: currentUser?.users_info?.address || '',
    city: currentUser?.users_info?.city || ''
  });
  console.log(currentUser)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });





  const handleProfileUpdate = async () => {
    try {
     
      const { data } = await updateProfile({
        name: profileData.name,
        email: profileData.email,
        username: profileData.username,
        job: profileData.job,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
      });
  
      setNotification({
        message: 'Profile updated successfully',
        type: 'success'
      });
    } catch (error) {
      console.log('Profile update failed:', error);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
  
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
  
      setNotification({
        message: 'Password updated successfully',
        type: 'success'
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
    } catch (error) {
      console.log('Password update failed:', error);
    }
  };

  const handleAccountDeletion = async (password) => {
    try {
      await deleteAccount(password); 
      dispatch(logOut());
      window.location.href = '/redirect';
    } catch (error) {
      console.error('Account deletion failed:', error);
      setNotification({
        message: error.response?.data?.message || 'Account deletion failed',
        type: 'error'
      });
    }
  };

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    if (password.length >= 12) strength++;
    
    setPasswordStrength(Math.min(5, Math.max(1, strength)));
    setIsPasswordValid(
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*]/.test(password) &&
      password === passwordData.confirmPassword
    );
  };

  return (
    <>
    <div className="min-h-screen mt-12 bg-gray-50/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Cog6ToothIcon className="w-9 h-9 text-gray-700 p-1.5 bg-gray-100 rounded-lg" />
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'profile', icon: UserCircleIcon, label: 'Profile' },
              { id: 'security', icon: LockClosedIcon, label: 'Security' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm rounded-xl l ${
                  activeTab === id 
                    ? 'bg-white shadow-xs text-blue-600 font-semibold border border-blue-100' 
                    : 'text-gray-500 hover:bg-gray-50/70 hover:border hover:border-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === id ? 'text-blue-500' : 'text-gray-400'}`} />
                {label}
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl shadow-xs p-8 border border-gray-100">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="pb-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your personal details and contact information</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['name', 'email', 'username', 'job', 'phone', 'address', 'city'].map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {field.replace('_', ' ')}
                      </label>
                      <input
                        type="text"
                        value={profileData[field]}
                        onChange={(e) => setProfileData({...profileData, [field]: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none 
                                  focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                                  transition-all duration-200 placeholder:text-gray-400"
                        placeholder={`Enter ${field.replace('_', ' ')}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={handleProfileUpdate}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:to-blue-600 
                             text-white font-medium rounded-lg transition-all duration-200 shadow-xs
                             flex items-center gap-2 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
  <div className="space-y-8">
    <div className="pb-4 border-b border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
      <p className="text-sm text-gray-500 mt-1">Manage your password and account security</p>
    </div>
    
    <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
        <LockClosedIcon className="w-5 h-5 text-gray-600" />
        Change Password
      </h3>
      <div className="space-y-5">
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-gray-700">Current Password</label>
          <div className="relative">
            <input
              type="password"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none 
                        focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                        transition-all duration-200 placeholder:text-gray-400"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(p => ({...p, currentPassword: e.target.value}))}
              placeholder="Enter current password"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none 
                          focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                          transition-all duration-200 placeholder:text-gray-400"
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData(p => ({...p, newPassword: e.target.value}));
                  checkPasswordStrength(e.target.value);
                }}
                placeholder="At least 8 characters"
              />
              <PasswordStrengthIndicator strength={passwordStrength} />
            </div>
          </div>
          
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none 
                        focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                        transition-all duration-200 placeholder:text-gray-400"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(p => ({...p, confirmPassword: e.target.value}))}
              placeholder="Re-enter new password"
            />
          </div>
        </div>

        <PasswordRequirements 
          password={passwordData.newPassword} 
          confirmPassword={passwordData.confirmPassword}
        />

        <div className="pt-4 flex justify-end">
          <button 
            onClick={handlePasswordUpdate}
            disabled={!isPasswordValid}
            className="px-5 py-2.5 bg-gradient-to-r  from-blue-600 to-blue-500 hover:to-blue-600 
                             text-white font-medium rounded-lg transition-all duration-200 shadow-xs cursor-pointer
                             flex items-center gap-2"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>

                <div className="bg-red-50/30 p-6 rounded-xl border border-red-100">
                  <h3 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                    <TrashIcon className="w-5 h-5 text-red-600" />
                    Danger Zone
                  </h3>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-red-600">
                        Permanent deletion of your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:to-red-600 
                               text-white font-medium rounded-lg transition-all duration-200 shadow-xs
                               whitespace-nowrap cursor-pointer"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

           
          </div>
          
        </div>
        
      </div>
      

     
    </div>
    {notification && (
        <Notification
          type={notification.type} 
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
     <Modal
     isOpen={showDeleteModal}
     onClose={() => setShowDeleteModal(false)}
     title="Confirm Account Deletion"
     actions={
       <>
         <button
           onClick={() => setShowDeleteModal(false)}
           className="px-5 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
         >
           Cancel
         </button>
         <button
           onClick={() => handleAccountDeletion(deletePassword)}
           className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:to-red-600 
                    text-white font-medium rounded-lg transition-all duration-200 shadow-xs"
         >
           Confirm Deletion
         </button>
       </>
     }
   >
     <div className="space-y-5">
       <p className="text-gray-600 text-sm leading-relaxed">
         This action will permanently remove all your data from our servers. 
         Please enter your password to confirm this irreversible action.
       </p>
       <input
         type="password"
         value={deletePassword}
         onChange={(e) => setDeletePassword(e.target.value)}
         className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none 
                  focus:ring-2 focus:ring-red-500/30 focus:border-red-500
                  transition-all duration-200 placeholder:text-gray-400"
         placeholder="Enter your password"
       />
     </div>
   </Modal>
   </>
  );
};