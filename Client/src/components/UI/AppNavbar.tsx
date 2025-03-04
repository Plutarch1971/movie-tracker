import { Navbar, Nav } from 'react-bootstrap';
import AuthService from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import  client  from '../../utils/apolloClient';
import '../../assets/styles/AppNavbar.css';

function AppNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    // Clear Apollo cache
    client.clearStore().then(() => {
      // Navigate to home page after logout and cache clear
      navigate('/home');
    });
  };

  return (
    <Navbar className="custom-navbar-bg" variant="dark" expand="lg" fixed="top">
      <Nav className="ms-auto me-3">
          <Nav.Link href="/home" className="text-white">Home</Nav.Link>
          <Nav.Link href="/search" className="text-white">Search</Nav.Link>
          <Nav.Link href="/profile" className="text-white">Profile</Nav.Link>
          {AuthService.loggedIn() ? (
            <Nav.Link onClick={handleLogout} className="text-white">Logout</Nav.Link>
          ) : (
            <Nav.Link href="/signup" className="text-white">Sign Up / Login</Nav.Link>
          )}     
      </Nav>
    </Navbar>      
  );    
}

export default AppNavbar;