import React, { useState } from "react";
import { Login } from "./Login";
import { SignUp } from "./SignUp";

const FeatureItem = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4 group">
    <div className="p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-white/80 mt-1">{description}</p>
    </div>
  </div>
);

export const Auth = () => {

    const [activeTab, setActiveTab] = useState("login");
    const [animationKey, setAnimationKey] = useState(0);
  

  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.4145.414A1 1 0 0119 5.414V21a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Task Management",
      description:
        "Create, assign, and track tasks with priorities and deadlines",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Team Collaboration",
      description: "Work together with your team members on projects",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Real-time Updates",
      description: "Get notified of task updates and project progress",
    },
  ];


  
    const handleTabChange = (newTab) => {
      setAnimationKey(prevKey => prevKey + 1);
      setActiveTab(newTab);
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-500">
    <div className="flex min-h-screen max-w-7xl mx-auto">
      {/* Auth Section */}
      <div className="flex flex-col justify-center items-center flex-1 p-8">
        <div className="w-full max-w-md space-y-8 backdrop-blur-sm bg-white/70 rounded-3xl p-8 shadow-xl">

        
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                ProjectHub
              </h1>
              <p className="mt-2 text-gray-600 font-medium">
                Your complete project management solution
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b-2 border-gray-200">
              <button
                onClick={() => handleTabChange("login")}
                className={`flex-1 pb-2 text-center font-semibold transition-colors ${
                  activeTab === "login"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => handleTabChange("register")}
                className={`flex-1 pb-2 text-center font-semibold transition-colors ${
                  activeTab === "register"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Register
              </button>
            </div>

            {/* Animated Form Content */}
            <div className="relative overflow-hidden min-h-[400px] transition-all duration-300">
              <div key={animationKey} className="animate-fade-in-up">
                {activeTab === "login" ? (
                  <Login onSwitch={() => handleTabChange("register")} />
                ) : (
                  <SignUp onSwitch={() => handleTabChange("login")} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="hidden lg:flex flex-1 p-8 text-white flex-col justify-center">
          <div className="max-w-md mx-auto space-y-8">
            <h2 className="text-4xl font-bold leading-tight">
              Streamline your project workflow
            </h2>
            <p className="text-lg text-blue-100 font-medium">
              ProjectHub helps teams plan, track, and manage projects with
              enterprise-grade security.
            </p>
            <div className="space-y-8">
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
    </div>
  );
};