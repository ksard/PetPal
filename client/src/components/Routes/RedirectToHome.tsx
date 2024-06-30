import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RedirectToHome = ({ children }) => {
  const { user } = useAuth();

  return user ? <Navigate to="/" /> : children;
};

export default RedirectToHome;
