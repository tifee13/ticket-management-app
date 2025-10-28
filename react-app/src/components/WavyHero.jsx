import React from 'react';
import { Link } from 'react-router-dom';

const WavyHero = () => {
  return (
    <section className="relative pt-20 pb-32 rounded-3xl overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full filter blur-xl opacity-70"></div>
      <div className="absolute -bottom-50 -right-10 w-48 h-48 rounded-full filter blur-lg opacity-80"></div>
      
      {/* Main container */}
      <div className="relative z-10 app-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Hero text */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold lg:text-6xl mb-6 text-color-text">
              Stop Losing Track...
              <br />
              Start Fixing Fast!
            </h1>
            <p className="text-xl lg:text-2xl text-color-text mb-10 max-w-xl mx-auto md:mx-0">
              Manage, monitor, and resolve issues all in one place with our simple and powerful ticketing app.
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-6">
              <Link 
                to="/auth/signup"
                className="px-8 py-4 bg-color-card text-color-accent text-xl rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-transform"
              >
                Get Started
              </Link>
              <Link 
                to="/auth/login"
                className="px-8 py-4 bg-transparent border-2 border-color-card text-color-card text-xl rounded-lg font-semibold hover:bg-color-card hover:text-color-accent transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="hidden md:block">
            <img 
              src="/shared-assets/hero-decoratives.svg" 
              alt="Hero decoratives" 
              className=" "
            />
          </div>

        </div>
      </div>

      {/* Bottom wave SVG */}
      <div className=" ">
        <img 
          src="/shared-assets/hero-wave.svg" 
          alt="Hero Wave" 
          className="absolute bottom-0 left-0 w-full leading-[0] "
        />
      </div>
    </section>
  );
};

export default WavyHero;
