import React from 'react';
import { Navigate } from 'react-router-dom'; // Or your preferred routing library
import isLoggedIn from './authUtils'; // Assuming authUtils.js is in the same directory

function withAuth(WrappedComponent) {
  return (props) => {
    if (!isLoggedIn()) {
      return <Navigate to="/login" replace />; // Redirect to login and replace current history entry
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
