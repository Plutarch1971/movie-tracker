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
            <Nav.Link href="/signup">Sign Up</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>    
        </Nav>
      </Navbar>
        
    )

}

export default AppNavbar;