import React, { useState }from 'react';
import {Link} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required.';
    if (!email) newErrors.email = 'Email is required.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form.');
      return;
    }
    signup( email, password);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-color-accent p-10 rounded-2xl shadow-xl">
        <h2 className="text-5xl font-bold text-center mb-8 text-color-bg">
            Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-color-primary rounded-lg focus:outline-none focus:ring-2 focus:color-bg"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div> 

          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-color-primary rounded-lg focus:outline-none focus:ring-2 focus:color-bg"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

           <div>
            <label className="block text-lg font-medium mb-2" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-color-primary rounded-lg focus:outline-none focus:ring-2 focus:color-bg"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button 
            type="submit"
            className="w-full py-3 text-color-card font-semibold rounded-lg hover:text-color-bg text-2xl"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account? {" "}
          <Link to="/auth/login" className="font-semibold text-color-text hover:text-color-bg">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
