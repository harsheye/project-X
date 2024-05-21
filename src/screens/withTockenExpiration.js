import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function withTokenExpiration(WrappedComponent) {
  return function TokenExpirationWrapper(props) {
    const history = useHistory();

    useEffect(() => {
      const authToken = sessionStorage.getItem('authToken');
      
      if (!authToken) {
        history.push('/login');
      } else {
        window.addEventListener('beforeunload', () => {
          sessionStorage.removeItem('authToken');
        });

        const tokenData = JSON.parse(atob(authToken.split('.')[1]));
        const expirationTime = tokenData.exp * 1000;

        if (Date.now() >= expirationTime) {
          sessionStorage.removeItem('authToken');
          history.push('/login');
        }
      }
    }, [history]);

    return <WrappedComponent {...props} />;
  };
}

export default withTokenExpiration;
