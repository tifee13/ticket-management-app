import React, { useState }from 'react';
import {Link} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required.';
    if (!password) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form.');
      return;
    }
    login(email, password);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-color-accent p-10 rounded-2xl shadow-xl">
        <h2 className="text-5xl font-bold text-center mb-8 text-color-bg">
            Welcome Back!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            Login
          </button>
        </form>

        <p className="text-center mt-6">
          Don't have an account? {" "}
          <Link to="/auth/signup" className="font-semibold text-color-text hover:text-color-bg">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
