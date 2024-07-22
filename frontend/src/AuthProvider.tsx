import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import App from './App';

const AuthProvider: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedIn = Boolean(token);
    const currentPath = location.pathname;

    if (isLoggedIn) {
      // If user is logged in and trying to access the login page, redirect to home
      if (currentPath === '/login') {
        navigate('/');
      } else {
        // Optionally, handle other redirects for authenticated users
        // e.g., redirect to a default route if needed
      }
    } else {
      // If user is not logged in and trying to access authenticated routes
      if (currentPath !== '/login') {
        navigate('/login');
      }
    }
  }, [navigate, location.pathname]);

  return <App />;
};

export default AuthProvider;
