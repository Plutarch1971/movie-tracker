//import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, Row, Col, Card } from 'react-bootstrap';

const Homepage = () => {
  // Sample movie data - replace with your actual data
  const recommendedMovies = [
    { id: 1, title: 'Movie 1' },
    { id: 2, title: 'Movie 2' },
    { id: 3, title: 'Movie 3' },
    { id: 4, title: 'Movie 4' },
    { id: 5, title: 'Movie 5' }
  ];

  return (
    <div className="min-vh-100 bg-dark">
      {/* Navigation Bar */}
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home" className="fs-3">Movie Tracker</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link href="#search">Search</Nav.Link>
              <Nav.Link href="#signup">Sign up</Nav.Link>
              <Nav.Link href="#login">Log in</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <Container className="mb-5">
        <Row className="align-items-center bg-primary text-white p-4 rounded">
          <Col md={6}>
            <div className="bg-light p-3 rounded" style={{ height: '300px' }}>
              <h3 className="text-dark text-center">Placeholder Image</h3>
            </div>
          </Col>
          <Col md={6}>
            <h2 className="mb-3">Favorite, review, or log all of what you want to watch with ease!</h2>
            <p className="fs-5">Join our growing community today!</p>
          </Col>
        </Row>
      </Container>

      {/* Recommended Movies Section */}
      <Container className="mb-5">
        <h3 className="text-white mb-4">Recommend Movies/TV Shows – Based on overall user Rating</h3>
        <Row className="g-4">
          {recommendedMovies.map(movie => (
            <Col key={movie.id} xs={12} sm={6} md={4} lg={2.4}>
              <Card className="h-100 bg-primary text-white">
                <Card.Body className="d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                  <Card.Title>{movie.title}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Homepage;