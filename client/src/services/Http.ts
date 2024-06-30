import { useEffect, useState } from 'react';
import axios from 'axios';
import { createSearchParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const http = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: true,
});

const AxiosInterceptor = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(''); //redirection route after authentication

  useEffect(() => {
    const responseInterceptor = (response) => {
      return response;
    };

    const errInterceptor = (error) => {
      // Handle error responses
      if (error.response.status === 401) {
        // Redirect to login page
        logout();
        if (!error.config.url.includes('api/auth/userinfo')) {
          navigate({
            pathname: '/login',
            search: createSearchParams({
              state: currentRoute,
            }).toString(),
          });
        }
      }
      let counter = 1;
      if (error.response?.status >= 500 && counter < Number(process.env.REACT_APP_RETRY)) {
        counter++;
        return http.request(error.config);
      }
      counter = 1;
      return Promise.reject(error);
    };

    const reqInterceptor = http.interceptors.request.use((config) => {
      // Store the current route
      if (!window.location.href.includes(`/login`)) {
        setCurrentRoute(window.location.href);
      }
      return config;
    });
    const resInterceptor = http.interceptors.response.use(responseInterceptor, errInterceptor);

    return () => {
      // Clean up by removing the interceptors
      http.interceptors.request.eject(reqInterceptor);
      http.interceptors.response.eject(resInterceptor);
    };
  }, [navigate, logout]);

  return children;
};

export { AxiosInterceptor };
export default http;