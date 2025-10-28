import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MobileMenu = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    onClose(); 
    logout(); 
  };

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? 'block text-2xl font-medium bg-color-primary px-4 py-3 rounded-lg text-color-card'
      : 'block text-2xl font-medium px-4 py-3 rounded-lg text-color-bg hover:bg-color-text';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        aria-hidden="true"
        onClick={onClose}
      ></div>

      <nav className="fixed top-0 left-0 z-50 h-full w-full max-w-sm bg-color-accent p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <Link to={user ? "/dashboard" : "/"} onClick={onClose} className="text-3xl font-bold text-color-bg">
            Fix & Fast
          </Link>
          <button 
            type="button" 
            className="-m-2.5 p-2.5 text-color-bg"
            onClick={onClose}
          >
            <span className="sr-only">Close menu</span>
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4">
          {user ? (
            <>
              <NavLink to="/dashboard" className={getNavLinkClass} onClick={onClose}>
                Dashboard
              </NavLink>
              <NavLink to="/tickets" className={getNavLinkClass} onClick={onClose}>
                Tickets
              </NavLink>
              <hr className="border-white/20 my-6" />
              <button
                onClick={handleLogout}
                className="w-full text-left text-2xl font-medium px-4 py-3 rounded-lg text-red-500 hover:bg-color-text"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/auth/login" className={getNavLinkClass} onClick={onClose}>
                Login
              </NavLink>
              <NavLink to="/auth/signup" className={getNavLinkClass} onClick={onClose}>
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;