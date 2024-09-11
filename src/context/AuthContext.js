import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
// import { useHistory } from 'react-router-dom'; // For routing in React

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const history = useHistory(); // React Router's equivalent to useRouter in Next.js

  const checkTokenExpiry = (token) => {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= exp * 1000;
  };

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch('https://aniverse-backend-3gqz.onrender.com/refresh', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        const newAccessToken = data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
        setUser({ token: newAccessToken });
      } else {
        console.log(data.message);
        logout();
      }
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      logout();
    }
  }, []); // Add any dependencies here if needed

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      const isTokenExpired = checkTokenExpiry(token);
      if (!isTokenExpired) {
        setUser({ token });
      } else {
        refreshAccessToken();
      }
    }
  }, [refreshAccessToken]);

  useEffect(() => {
    // Set up a periodic check for token expiry
    const intervalId = setInterval(() => {
      const token = localStorage.getItem('accessToken');
      if (token && checkTokenExpiry(token)) {
        refreshAccessToken();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [ refreshAccessToken]);

  const login = (token) => {
    localStorage.setItem('accessToken', token);
    setUser({ token });
    // history.push('/'); // Redirect to home page after login
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    Cookies.remove('refreshToken');
    setUser(null);
    // history.push('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
