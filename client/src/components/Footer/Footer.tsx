import { NavLink } from 'react-router-dom';
import './Footer.scss';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import logo from '../../assets/logo.jpg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <NavLink to="/" className="footer-logo-link">
            <img src={logo} alt="PetPal Logo" className="footer-logo-img" />
            <p className="footer-logo-text">PetPal</p>
          </NavLink>
        </div>
        <div className="footer-nav">
          <NavLink to="/adoption" className="footer-nav-link">Adoption</NavLink>
          <NavLink to="/events" className="footer-nav-link">Events</NavLink>
          <NavLink to="/petservices" className="footer-nav-link">Services</NavLink>
          <NavLink to="/lostandfound" className="footer-nav-link">Lost & Found</NavLink>
          <NavLink to="/petfacilities" className="footer-nav-link">Facilities</NavLink>
        </div>
        <div className="footer-contact">
          <p className="footer-contact-text">Contact Us: (123) 456-7890</p>
          <p className="footer-contact-text">Email: support@petpal.com</p>
        </div>
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link"><FacebookIcon /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link"><XIcon /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link"><InstagramIcon /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
