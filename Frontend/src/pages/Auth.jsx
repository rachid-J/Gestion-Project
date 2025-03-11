import React, { useState } from "react";
import { Login } from "./Login";
import { SignUp } from "./SignUp";



const FeatureItem = ({ icon, title, description }) => (
  <div className="flex items-start">
    <div className="rounded-full bg-white/20 p-2 mr-4">{icon}</div>
    <div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-white/70">{description}</p>
    </div>
  </div>
);

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      title: "Task Management",
      description: "Create, assign, and track tasks with priorities and deadlines"
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: "Team Collaboration",
      description: "Work together with your team members on projects"
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: "Real-time Updates",
      description: "Get notified of task updates and project progress"
    }
  ];

  return (
    <div className="flex min-h-screen">
      {/* Login/Signup Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gray-50">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">ProjectHub</h1>
            <p className="text-gray-600">Your complete project management solution</p>
          </div>

          {/* Custom Tab Buttons */}
          <div className="flex gap-2 mb-6 p-1 rounded-sm shadow bg-gray-200">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 p-1  rounded-sm font-medium transition-colors ${
                activeTab === "login"
                  ? "bg-white text-black"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 p-1 rounded-sm font-medium transition-colors ${
                activeTab === "register"
                  ? "bg-white text-black"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Register
            </button>
          </div>

          {/* Content Section */}
          <div className="transition-all duration-300">
            {activeTab === "login" ? (
              <Login onSwitch={() => setActiveTab("register")} />
            ) : (
              <SignUp onSwitch={() => setActiveTab("login")} />
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex-1 bg-blue-900 p-8 text-white hidden lg:flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Streamline your project workflow
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            ProjectHub helps teams plan, track, and manage projects with ease.
          </p>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <FeatureItem
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;