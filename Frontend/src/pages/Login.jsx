import React, { useState } from 'react'
import { Button } from '../components/UI/Button';
import { login } from '../services/authServices';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setAuth } from '../Redux/features/authSlice';
import { Notification } from '../Components/layouts/Notification';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Input } from '../components/UI/Input';

export const Login = ({ onSwitch }) =>  {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const disp = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification("");
    try {
      const response = await login(formData);
      disp(setAuth(response.data));
      navigate("/redirect");
    } catch (err) {
      console.error("Login failed", err)
      setLoading(false);
      setNotification({type:"error",message:"Invalid credentials. Please try again."});
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="mt-2 text-gray-600 font-medium">
          Sign in to manage your projects
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            type="email"
            id="email"
            name="email"
            label="Email Address"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            icon={
              <EnvelopeIcon 
                className="h-5 w-5 text-gray-400" 
                strokeWidth={2}
              />
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
              <LockClosedIcon
                className="h-5 w-5 text-gray-400" 
                strokeWidth={2}
              />
            }
            required
          />
      
        </div>

        <Button
          type="submit"
          text="Continue"
          loading={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white font-semibold py-3 rounded-lg hover:rounded-lg transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        />
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="font-semibold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent hover:underline"
          >
            Create account
          </button>
        </p>
      </div>

      {notification && (
  <Notification 
    type={notification.type} 
    message={notification.message}
    className="fixed top-4 right-4 z-50"
  />
)}
    </div>
  );
}