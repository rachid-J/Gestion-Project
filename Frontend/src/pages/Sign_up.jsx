import React from 'react';
import { Input } from '../components/UI/Input';
import { Select } from '../components/UI/Select';

export default function Sign_up() {
  return (
    <form className="w-[60%] mx-auto">
      <h2 className="text-lg font-bold mb-4 text-left">Create an account</h2>
      <p className="text-sm text-gray-500 mb-4 text-left">
        Enter your details to sign up
      </p>
      <Input
        type="text" 
        placholder="Username" 
        name="username" 
        className="w-full p-2 mb-4 border rounded-lg"
      />
      <Input 
        type="password"
        placholder="Password" 
        name="password" 
        className="w-full p-2 mb-4 border rounded-lg"
      />
      <Input
        type="password" 
        placholder="Confirm Password" 
        name="confirmPassword" 
        className="w-full p-2 mb-4 border rounded-lg" 
      />
      <Input 
        type="file"
        name="image"
        className="w-full p-2 mb-4 border rounded-lg" 
      />
      <Select 
        title="Account Type" 
        width="100%" 
        options={["Admin", "Manager", "Member"]}
        className="w-full p-2 mb-4 border rounded-lg" 
      />

      <button type='submit' className="w-full py-2 bg-blue-900 text-white rounded-lg mt-7">
        Register
      </button>
      {/* <p className="text-center text-gray-500 mt-4">
        Already have an account? <a href="#" className="text-blue-900">Login</a>
      </p> */}
    </form>
  );
}
