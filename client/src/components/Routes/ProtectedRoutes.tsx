import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


const ProtectedRoutes = ({ children }) => {
    const { user } = useAuth();

    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoutes