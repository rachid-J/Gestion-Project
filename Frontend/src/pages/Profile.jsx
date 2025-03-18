import React,{useState}  from 'react'
import { useSelector } from 'react-redux';
export const Profile = () => {
  const projects = [
    {
      "name": "E-Commerce Platform",
      "created_date": "2025-03-15",
      "end_date": "2025-06-30"
    },
    {
      "name": "Real Estate Website",
      "created_date": "2025-02-10",
      "end_date": "2025-07-01"
    },
    {
      "name": "Social Media App",
      "created_date": "2025-01-05",
      "end_date": "2025-05-20"
    },
    {
      "name": "AI Chatbot Development",
      "created_date": "2025-04-01",
      "end_date": "2025-09-15"
    },
    {
      "name": "Inventory Management System",
      "created_date": "2025-03-20",
      "end_date": "2025-08-10"
    }
  ]

  const [background, setBackground] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [hoverBg, setHoverBg] = useState(false);
  const [hoverProfile, setHoverProfile] = useState(false);
  const user = useSelector((state)=>state.auth.user)
  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    if (file) setBackground(URL.createObjectURL(file));
  };

  const handleProfileUpload = (event) => {
    const file = event.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };
  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Profile Header */}
      <div className="relative bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] h-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-64 flex items-end pb-12">
            {/* Background Upload */}
            <div className="absolute inset-0 overflow-hidden group cursor-pointer transition-all"
              onClick={() => document.getElementById("backgroundInput").click()}
              onMouseEnter={() => setHoverBg(true)}
              onMouseLeave={() => setHoverBg(false)}
            >
              {background && (
                <img src={background} alt="Cover" className="w-full h-full object-cover object-center" />
              )}
              <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity ${hoverBg ? 'opacity-100' : 'opacity-0'}`}>
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <input type="file" id="backgroundInput" className="hidden" onChange={handleBackgroundUpload} />
            </div>

            {/* Profile Picture */}
            <div className="relative -mb-24 ml-8 group">
              <div className="w-40 h-40 rounded-2xl border-4 border-white bg-gray-100 shadow-xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
                onClick={() => document.getElementById("profileInput").click()}
                onMouseEnter={() => setHoverProfile(true)}
                onMouseLeave={() => setHoverProfile(false)}
              >
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity ${hoverProfile ? 'opacity-100' : 'opacity-0'}`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <input type="file" id="profileInput" className="hidden" onChange={handleProfileUpload} />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Info */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                  <p className="text-gray-500">Senior Product Designer</p>
                </div>
                <button className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all text-sm font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Edit Profile
                </button>
              </div>

              {/* About Section */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Job Title"
                        className="bg-transparent flex-1 text-gray-700 placeholder-gray-400 focus:outline-none"
                      />
                    </div>

                    {/* Other input fields with similar structure */}
                    
                  </div>
                </div>

                {/* Contact Section */}
                <div className="space-y-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</h3>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Projects */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Active Projects</h2>
              <div className="space-y-5">
                {projects.map((project, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-200 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full">In Progress</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>Start: {project.created_date}</span>
                      <span>End: {project.end_date}</span>
                    </div>
                    <div className="relative pt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>65% Complete</span>
                        <span>3/5 Tasks</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="w-2/3 bg-indigo-500 rounded-full h-2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teams Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Teams</h2>
              <button className="w-full p-3 flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-semibold">New Team</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};