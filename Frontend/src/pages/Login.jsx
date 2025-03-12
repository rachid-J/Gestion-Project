import React, { useState } from 'react'
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { login } from '../services/authServices';
import {useNavigate} from "react-router-dom";

export const Login = ({ onSwitch }) =>  {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("")
    try{
      const response = await login(formData)
      console.log(response.data)
      localStorage.setItem("token",response.data.token)
      navigate("/")
    }catch(err){
      setLoading(false)
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Login to your account</h2>
      <p className="text-sm text-gray-500 mb-6">Enter your credentials to access your projects</p>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Button
          type="submit"
          text="Login"
          loading={loading}
          bg="bg-blue-900 hover:bg-blue-700"
          width="100%"
        />
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-blue-900 font-semibold hover:underline"
        >
          Register
        </button>
      </p>
    </div>
  );
}

