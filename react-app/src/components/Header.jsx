import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MobileMenu from './mobileMenu'; 

const HamburgerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const Header = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getDesktopNavLinkClass = ({ isActive }) =>
    isActive
      ? 'text-color-bg hover:text-color-text'
      : 'text-color-bg hover:text-color-text';

  return (
    <>
      <header className="bg-color-accent shadow-md">
        <nav className="app-container flex justify-between items-center h-24">
          <Link to={user ? "/dashboard" : "/"} className="text-4xl font-bold text-color-text">
            Fix & Fast
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <NavLink to="/dashboard" className={getDesktopNavLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/tickets" className={getDesktopNavLinkClass}>
                  Tickets
                </NavLink>
                <button
                  onClick={logout}
                  className="px-5 py-2 bg-color-card text-color-accent rounded-lg font-semibold hover:bg-color-text hover:text-color-card transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/auth/login" className={getDesktopNavLinkClass}>
                  Login
                </NavLink>
                <Link
                  to="/auth/signup"
                  className="px-5 py-2 bg-color-card text-color-accent rounded-lg font-semibold hover:bg-color-text hover:text-color-card transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button 
              type="button" 
              className="text-color-text"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Menu</span>
              <HamburgerIcon />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />
    </>
  );
};

export default Header;