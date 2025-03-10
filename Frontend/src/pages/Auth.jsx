import React, { useState } from "react";
import Login from "./Login";
import Sign_up from "./Sign_up";

const Auth = () => {
  const [show, setShow] = useState(true);
  const [active, setActive] = useState(true);

  const toggleLogin = () => {
    setShow(true);
    setActive(true);
  };
  const toggleSignUP = () => {
    setShow(false);
    setActive(!active);
  };
  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-3 ">ProjectHub</h1>
        <p className="text-gray-500 mb-12">
          Your complete project management solution
        </p>

        <div>
          <div className="flex justify-center mb-4 gap-5 w-full">
            <button
              className={`w-1/2 py-2 rounded-lg ${active ? "bg-blue-900 text-white" : "bg-gray-200 text-black"}`}
              onClick={toggleLogin}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-2 rounded-lg ${!active ? "bg-blue-900 text-white" : "bg-gray-200 text-black"}`}
              onClick={toggleSignUP}
            >
              Register
            </button>
          </div>

          <div>{show ? <Login /> : <Sign_up />}</div>
        </div>
      </div>

      <div className="w-1/2 bg-blue-900 text-white flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold mb-6">
          Streamline your project workflow
        </h2>
        <p className="mb-8">
          ProjectHub helps teams plan, track, and manage projects with ease.
        </p>

        <ul>
          <li className="flex items-center mb-4">
            <span className="mr-5">✅</span>
            <div>
              <strong>Task Management</strong>
              <p>
                Create, assign, and track tasks with priorities and deadlines.
              </p>
            </div>
          </li>
          <li className="flex items-center mb-4">
            <span className="mr-5">👥</span>
            <div>
              <strong>Team Collaboration</strong>
              <p>Work together with your team members on projects.</p>
            </div>
          </li>
          <li className="flex items-center">
            <span className="mr-5">⏰</span>
            <div>
              <strong>Real-time Updates</strong>
              <p>Get notified of task updates and project progress.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Auth;
