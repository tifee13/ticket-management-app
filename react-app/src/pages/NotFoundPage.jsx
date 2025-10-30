import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-9xl font-bold text-color-primary">404</h1>
      <h2 className="text-4xl font-semibold text-color-text mt-4 mb-6">
        Page Not Found
      </h2>
      {/* Updated text to match the Vue version */}
      <p className="text-xl text-color-text/80 mb-10 max-w-md">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-8 py-4 bg-color-primary text-white text-lg rounded-lg font-semibold hover:opacity-80 transition-opacity"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;

