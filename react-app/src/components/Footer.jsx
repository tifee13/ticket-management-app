import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="flex justify-center items-center bg-color-accent shadow-inner mt-16 text-center">
      <div className="app-container py-12">
        <div>
          <ul className="flex justify-center space-x-4">
            <li><a href="#" className="text-color-card/70 hover:text-color-card">Privacy Policy</a></li>
            <li><a href="#" className="text-color-card/70 hover:text-color-card">Terms of Service</a></li>
          </ul>
        </div>
        <p>&copy; {new Date().getFullYear()} Fix & Fast. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;