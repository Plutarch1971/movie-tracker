import { Navbar, Nav } from 'react-bootstrap';
import AuthService from '../../utils/auth';
function AppNavbar () {
  const isLoggedIn = AuthService.loggedIn();
    return (
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Nav className="me-auto navbar">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/search">Search</Nav.Link>
            
            <Nav.Link href="/profile">Profile</Nav.Link>
           {isLoggedIn && <Nav.Link href="/profile">Profile</Nav.Link>}
            <Nav.Link href="/signup">Sign Up / Login</Nav.Link>
        </Nav>
      </Navbar>
        
    )

}

export default AppNavbar;