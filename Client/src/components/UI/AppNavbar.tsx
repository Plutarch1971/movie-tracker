import { Navbar, Nav } from 'react-bootstrap';
import '../../assets/styles/AppNavbar.css';

function AppNavbar () {
 
    return (
      <Navbar className="custom-navbar-bg" variant="dark" expand="lg" fixed="top">
        <Nav className="ms-auto me-3">
            <Nav.Link href="/home" className="text-white">Home</Nav.Link>
            <Nav.Link href="/search" className="text-white">Search</Nav.Link>
            <Nav.Link href="/profile" className="text-white">Profile</Nav.Link>
           <Nav.Link href="/signup" className="text-white">Sign Up / Login</Nav.Link>
        </Nav>
      </Navbar>
        
    )

}

export default AppNavbar;