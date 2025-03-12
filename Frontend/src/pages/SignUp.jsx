import React, { useState } from 'react';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { register } from '../services/authServices';
import { Notification } from '../Components/layouts/Notification';
export const  SignUp = ({ onSwitch }) => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    accountType: '',
    avatar: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification("")
    try{
      const response = await register(formData);
      console.log(response.data)
      setNotification({type:"success",message:response.data.message});
    }catch(err){
      console.error("Register failed. Please try again.",err)
      setLoading(false)
      setNotification({type:"error",message:"Register failed. Please try again."});
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
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-1 text-gray-800">Create an account</h2>
      <p className="text-sm text-gray-500 mb-6">Enter your details to sign up</p>

      <form onSubmit={handleSubmit} className="space-y-1">
        <div className="space-y-1">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <Input
            type="text"
            id="fullName"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="johndoe123"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <Input
            type="password"
            id="confirmPassword"
            name="password_confirmation"
            placeholder="••••••••"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
        </div>



        <Button
          type="submit"
          text="Register"
          loading={loading}
          bg="bg-blue-900 hover:bg-blue-700"
          width="100%"
        />
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-blue-900 font-semibold hover:underline"
        >
          Login
        </button>
      </p>
      {notification && <Notification type={notification.type} message={notification.message} />}
    </div>
  );
}