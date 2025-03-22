import React, { useState } from 'react';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { register } from '../services/authServices';
import { useNavigate } from "react-router-dom";
import { Notification } from '../Components/layouts/Notification';
import { useDispatch } from 'react-redux';
import { setAuth } from '../Redux/features/authSlice';

export const SignUp = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    avatar: null
  });
  const disp = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification("");
    try {
      const response = await register(formData);
      disp(setAuth(response.data));
      navigate("/redirect");
    } catch (err) {
      console.error("Registration failed", err);
      setLoading(false);
      setNotification({ type: "error", message: "Registration failed. Please try again." });
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'avatar') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="mt-2 text-gray-600 font-medium">
          Join our project management community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            type="text"
            id="name"
            name="name"
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            required
          />

          <Input
            type="email"
            id="email"
            name="email"
            label="Email Address"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            required
          />

          <Input
            type="text"
            id="username"
            name="username"
            label="Username"
            placeholder="johndoe123"
            value={formData.username}
            onChange={handleChange}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
            required
          />

          <Input
            type="password"
            id="password"
            name="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            required
          />

          <Input
            type="password"
            id="confirmPassword"
            name="password_confirmation"
            label="Confirm Password"
            placeholder="••••••••"
            value={formData.password_confirmation}
            onChange={handleChange}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
            required
          />

       
        </div>

        <Button
          type="submit"
          text="Create Account"
          loading={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        />
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="font-semibold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>

      {notification && (
        <Notification 
          type={notification.type} 
          message={notification.message}
          className="mt-4 animate-fade-in-up"
        />
      )}
    </>
  );
}