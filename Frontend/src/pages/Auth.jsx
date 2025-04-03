import { useState } from "react";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { ArrowLeftIcon, BoltIcon, ChartBarIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";


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
      icon: <ChartBarIcon className="h-6 w-6 text-white" strokeWidth={2} />,
      title: "Task Management",
      description: "Create, assign, and track tasks with priorities and deadlines",
    },
    {
      icon: <UserGroupIcon className="h-6 w-6 text-white" strokeWidth={2} />,
      title: "Team Collaboration",
      description: "Work together with your team members on projects",
    },
    {
      icon: <BoltIcon className="h-6 w-6 text-white" strokeWidth={2} />,
      title: "Real-time Updates",
      description: "Get notified of task updates and project progress",
    },
  ];

  const handleTabChange = (newTab) => {
    setAnimationKey((prevKey) => prevKey + 1);
    setActiveTab(newTab);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-500">
       <div className="absolute top-4 left-8 z-20">
  <Link
    to="/home"
    className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-indigo-200 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
  >
    <ArrowLeftIcon className="w-5 h-5" />
    <span className="hidden sm:inline">Back to Home</span>
  </Link>
</div>
    <div className="flex min-h-screen max-w-7xl mx-auto">
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