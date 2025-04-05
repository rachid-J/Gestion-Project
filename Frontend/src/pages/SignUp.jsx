import React, { useState } from 'react';
import { Button } from '../components/UI/Button';
import { register } from '../services/authServices';
import { useNavigate } from "react-router-dom";
import { Notification } from '../Components/layouts/Notification';
import { useDispatch } from 'react-redux';
import { setAuth } from '../Redux/features/authSlice';
import { Input } from '../components/UI/Input';
import { AtSymbolIcon, CheckIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

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
            icon={<UserIcon className="h-5 w-5 text-gray-400" strokeWidth={2} />}
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
            icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" strokeWidth={2} />}
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
            icon={<AtSymbolIcon className="h-5 w-5 text-gray-400" strokeWidth={2} />}
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
            icon={<LockClosedIcon className="h-5 w-5 text-gray-400" strokeWidth={2} />}
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
            icon={<CheckIcon className="h-5 w-5 text-gray-400" strokeWidth={2} />}
            required
          />
        </div>




        <Button
          type="submit"
          text="Create Account"
          loading={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all transform  shadow-lg hover:shadow-xl"
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