import React from 'react';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
function AppNavbar () {
    return (
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Nav className="me-auto navbar">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/movieinfo">Movie Info</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
            <div>
              <Nav.Link href="#signin">Sign In / </Nav.Link>
              <Nav.Link href="#login">Login</Nav.Link>
            </div>
            
        </Nav>
      </Navbar>
        
    )

}

export default AppNavbar;