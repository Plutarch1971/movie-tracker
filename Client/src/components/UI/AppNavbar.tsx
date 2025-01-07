import { Navbar, Nav } from 'react-bootstrap';
//import AuthService from '../../utils/auth';
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';


function AppNavbar () {
 //const isLoggedIn = AuthService.loggedIn();
  // const navigate = useNavigate();
  // const location = useLocation();

  // useEffect (() => {
  //   if (isLoggedIn && location.pathname !=='/profile') {
  //     navigate('/profile');
  //   }
  // }, [isLoggedIn, navigate, location.pathname]);
    return (
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Nav className="me-auto navbar">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
           <Nav.Link href="/signup">Sign Up / Login</Nav.Link>
        </Nav>
      </Navbar>
        
    )

}

export default AppNavbar;