import { Navbar, Nav } from 'react-bootstrap';
import Auth from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import  client  from '../../utils/apolloClient';

function AppNavbar() {
  const navigate = useNavigate();
  const isLoggedIn = Auth.loggedIn();

  const handleLogout = () => {
    Auth.logout();
    // Clear Apollo cache
    client.clearStore().then(() => {
      // Navigate to home page after logout and cache clear
      navigate('/home');
    });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Nav className="me-auto navbar">
        <Nav.Link href="/home">Home</Nav.Link>
        <Nav.Link href="/search">Search</Nav.Link>
        <Nav.Link href="/profile">Profile</Nav.Link>
        {isLoggedIn ? (
          <Nav.Link 
            onClick={handleLogout}
            style={{ cursor: 'pointer' }}
          >
            Logout
          </Nav.Link>
        ) : (
          <Nav.Link href="/signup">Sign Up / Login</Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
}

export default AppNavbar;