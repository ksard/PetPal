import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchUserData, User } from "../services/Auth";
import http from "../services/Http";

interface AuthContextType {
  user?: User;
  error?: any;
  login: (state) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

// Export the provider as we need to wrap the entire app with it
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<any>();

  const location = useLocation();
 const navigate = useNavigate();
  // Reset the error state if we change page
  useEffect(() => {
    if (error) setError(undefined);
  }, [location.pathname]);


  useEffect(() => {
    fetchUserData()
      .then((res) => setUser(res.data))
      .catch((_error) => { });
  }, []);

  function externalNavigate(url: string) {
    window.location.href = url;
  }


  async function login(state) {
    if (!user) {
      await http.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/login?state=${state}`)
        .then((response) => {
          externalNavigate(response.data.url)
        })
        .catch((error) => setError(error))
    }
    else{
      navigate("/")
    }
  }



  async function logout() {
    // sessionsApi.logout().then(() => setUser(undefined));
    setUser(null);
    await http.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/logout`)

  }


  const memoedValue = useMemo(
    () => ({
      user,
      error,
      login,
      logout,
    }),
    [user, error]
  );

  // We only want to render the underlying app after we
  // assert for the presence of a current user.
  return (
    <AuthContext.Provider value={memoedValue}>
      { children}
    </AuthContext.Provider>
  );
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export default function useAuth() {
  return useContext(AuthContext);
}
