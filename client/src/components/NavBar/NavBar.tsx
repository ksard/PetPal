import './NavBar.scss';
import logo from '../../assets/logo.jpg';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className='navbar'>
      <div className='logo-container' onClick={goToHome}>
        <img src={logo} alt="Logo" className='logo' />
        <p className='logoText'>PetPal</p>
      </div>
      <nav>
        <NavLink to="/adoption" className="li">Adoption</NavLink>
        <NavLink to="/events" className="li">Events</NavLink>
        <NavLink to="/petservices" className="li">Services</NavLink>
        <NavLink to="/lostandfound" className="li">Lost & Found</NavLink>
        <NavLink to="/petfacilities" className="li">Facilities</NavLink>
        {!user && <NavLink to="/login" className="li">Login</NavLink>}
        {user &&
          <div className="profile-container">
            <div className="profile-icon" onClick={handleLogout}>
              <img src={user.picture} alt={user.name} className="profile-img" />
            </div>
           
          </div>
        }
      </nav>
    </div>
  );
}

export default NavBar;
