import React from 'react'
import { Input } from '../components/UI/Input';

export default function Login() {
  return (
    <form>
      <h2 className="text-lg font-bold mb-4">Login to your account</h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter your credentials to access your projects
      </p>
      <Input
        type="text"
        placholder="email"
        className="w-full p-2 mb-4 border rounded-lg"
        name='email'
      />
      <Input
        type="password"
        placholder="Password"
        className="w-full p-2 mb-6 border rounded-lg"
        name="password"
      />
      <button type='submit' className="w-full py-2 bg-blue-900 text-white rounded-lg">
        Login
      </button>
      {/* <p className="text-center text-gray-500 mt-4">
        Don’t have an account?{" "}
        <a href="#" className="text-blue-900">
          Register
        </a>
      </p> */}
      </form>
  );
}
