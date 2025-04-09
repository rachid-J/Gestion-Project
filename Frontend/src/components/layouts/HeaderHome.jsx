import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export const HeaderHome = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  
  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);
  
  const navigation = [
    { name: 'Home', path: '/home' },
    { name: 'Features', path: '/home/features' },
    { name: 'About', path: '/home/about' },
   
  ];

  // Function to check if a link is active
  const isActiveLink = (path) => {
    if (path.includes('#')) {
      const pathWithoutHash = path.split('#')[0];
      const hash = path.split('#')[1];
      return location.pathname === pathWithoutHash && location.hash === `#${hash}`;
    }
    return location.pathname === path;
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="text-xl font-bold text-indigo-600">ProjectHub</span>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2 text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors relative ${
                  isActiveLink(item.path) 
                    ? 'text-indigo-600 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600 after:-mb-1' 
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
            <Link
              to="/auth?signup=false"
              className={`text-sm font-medium leading-6 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50 ${
                location.pathname === '/auth' && location.search.includes('signup=false')
                  ? 'text-indigo-600 font-semibold bg-indigo-50'
                  : 'text-gray-700'
              }`}
            >
              Log in
            </Link>
            <Link
              to="/auth?signup=true"
              className={`text-sm font-medium leading-6 px-4 py-2 rounded-lg transition-all ${
                location.pathname === '/auth' && location.search.includes('signup=true')
                  ? 'bg-indigo-700 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30'
              }`}
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>
      
      {/* Mobile menu - positioned outside header */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                  <span className="text-xl font-bold text-indigo-600">ProjectHub</span>
                </Link>
                <button
                  type="button"
                  className="rounded-full p-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-6 px-6">
                <nav className="flex flex-col space-y-6">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2 px-3">Navigation</p>
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center px-3 py-3 rounded-xl text-base font-medium transition-all ${
                          isActiveLink(item.path)
                            ? 'text-indigo-600 bg-indigo-50 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                        {isActiveLink(item.path) && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                        )}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2 px-3">Account</p>
                    <Link
                      to="/auth?signup=false"
                      className={`flex items-center px-3 py-3 rounded-xl text-base font-medium transition-all ${
                        location.pathname === '/auth' && location.search.includes('signup=false')
                          ? 'text-indigo-600 bg-indigo-50 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/auth?signup=true"
                      className="flex items-center justify-center mt-3 px-3 py-3 rounded-xl text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                </nav>
              </div>
              
              <div className="p-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">© 2025 ProjectHub</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};